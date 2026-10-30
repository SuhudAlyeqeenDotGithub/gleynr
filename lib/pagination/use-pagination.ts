"use client";

import { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "./types";
import type { PaginationControls } from "./types";

export const getTotalPages = (total: number, pageSize: number) =>
  Math.max(1, Math.ceil(total / pageSize));

export const clampPage = (page: number, totalPages: number) =>
  Math.min(Math.max(1, page), totalPages);

// Page state for a collection of known size. Resets to page 1 when resetKey
// (search, filters, sorting) changes and clamps if the collection shrinks.
export const usePagination = (
  total: number,
  resetKey: string,
): PaginationControls => {
  const [state, setState] = useState({
    key: resetKey,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const { pageSize } = state;
  const totalPages = getTotalPages(total, pageSize);
  const page = clampPage(state.key === resetKey ? state.page : 1, totalPages);

  const setPage = (next: number) =>
    setState((current) => ({
      key: resetKey,
      page: clampPage(next, totalPages),
      pageSize: current.pageSize,
    }));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;

  return {
    page,
    pageSize,
    total,
    totalPages,
    from,
    to: Math.min(page * pageSize, total),
    hasPrev: page > 1,
    hasNext: page < totalPages,
    setPage,
    next: () => setPage(page + 1),
    prev: () => setPage(page - 1),
    setPageSize: (size) => setState({ key: resetKey, page: 1, pageSize: size }),
  };
};
