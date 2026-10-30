"use client";

import { usePagination } from "./use-pagination";

// Pages an in-memory collection. Swap for useCursorPagination once a backend supplies pages.
export const useLocalPage = <T>(items: T[], resetKey: string) => {
  const pagination = usePagination(items.length, resetKey);
  const start = (pagination.page - 1) * pagination.pageSize;
  return {
    rows: items.slice(start, start + pagination.pageSize),
    // Index of the first visible row within the full collection.
    offset: start,
    pagination,
  };
};
