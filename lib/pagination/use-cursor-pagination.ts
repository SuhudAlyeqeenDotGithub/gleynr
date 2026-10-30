"use client";

import { useEffect, useRef, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "./types";
import type { PageFetcher, PaginationControls } from "./types";

// Forward/backward paging for sources addressed by cursors. Only the current page is held.
// `fetchPage` must be referentially stable (useCallback) and should embed active filters/sorting.
export const useCursorPagination = <T>(
  fetchPage: PageFetcher<T>,
  resetKey: string,
) => {
  const [target, setTarget] = useState({
    key: resetKey,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [result, setResult] = useState<{
    items: T[];
    total?: number;
    hasMore: boolean;
  }>({ items: [], hasMore: false });
  const [loading, setLoading] = useState(true);
  // cursors[n] is the cursor that starts page n + 1.
  const cursors = useRef<unknown[]>([undefined]);

  const page = target.key === resetKey ? target.page : 1;
  const { pageSize } = target;

  useEffect(() => {
    let cancelled = false;
    if (page === 1) cursors.current = [undefined];
    setLoading(true);
    fetchPage({ pageSize, cursor: cursors.current[page - 1] })
      .then((response) => {
        if (cancelled) return;
        cursors.current[page] = response.nextCursor;
        // A page emptied by deletions steps back instead of stranding the user.
        if (response.items.length === 0 && page > 1) {
          setTarget({ key: resetKey, page: page - 1, pageSize });
          return;
        }
        setResult(response);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchPage, resetKey, page, pageSize]);

  const go = (next: number) =>
    setTarget({ key: resetKey, page: Math.max(1, next), pageSize });
  const { items, total, hasMore } = result;

  const pagination: PaginationControls = {
    page,
    pageSize,
    total,
    totalPages:
      total === undefined
        ? undefined
        : Math.max(1, Math.ceil(total / pageSize)),
    from: items.length ? (page - 1) * pageSize + 1 : 0,
    to: (page - 1) * pageSize + items.length,
    hasPrev: page > 1,
    hasNext: hasMore,
    loading,
    setPage: go,
    next: () => go(page + 1),
    prev: () => go(page - 1),
    setPageSize: (size) =>
      setTarget({ key: resetKey, page: 1, pageSize: size }),
  };

  return { rows: items, pagination };
};
