export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export const DEFAULT_PAGE_SIZE: number = PAGE_SIZE_OPTIONS[0];

// Everything the pagination UI needs; produced by both local and cursor-based sources.
export type PaginationControls = {
  page: number;
  pageSize: number;
  // Undefined when the source cannot report a total (e.g. cursor-based APIs).
  total?: number;
  totalPages?: number;
  // 1-based position of the first/last visible record; 0 when the page is empty.
  from: number;
  to: number;
  hasPrev: boolean;
  hasNext: boolean;
  loading?: boolean;
  next: () => void;
  prev: () => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
};

export type PageResult<T> = {
  items: T[];
  total?: number;
  nextCursor?: unknown;
  hasMore: boolean;
};

// Implement with e.g. Firestore query.startAfter(cursor).limit(pageSize + 1).
export type PageFetcher<T> = (request: {
  pageSize: number;
  cursor: unknown;
}) => Promise<PageResult<T>>;
