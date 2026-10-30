import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZE_OPTIONS } from "@/lib/pagination/types";
import type { PaginationControls } from "@/lib/pagination/types";

type PaginationProps = {
  controls: PaginationControls;
  // Plural noun for the records, e.g. "invoices".
  label?: string;
  // Edge-to-edge placement beneath a flush table.
  flush?: boolean;
};

const Pagination = ({ controls, label = "records", flush }: PaginationProps) => {
  const { page, pageSize, total, totalPages, from, to, hasPrev, hasNext } =
    controls;
  if (total === 0) return null;

  return (
    <nav
      className={`pagination ${flush ? "flush" : ""}`}
      aria-label={`${label} pagination`}
    >
      <span className="pagination-range" aria-live="polite">
        Showing{" "}
        <strong>
          {from}–{to}
        </strong>
        {total !== undefined && (
          <>
            {" "}
            of <strong>{total.toLocaleString("en-GB")}</strong>
          </>
        )}{" "}
        {label}
      </span>
      <div className="pagination-controls">
        <label className="pagination-size">
          <span>Rows per page</span>
          <select
            className="filter-select"
            value={pageSize}
            onChange={(event) => controls.setPageSize(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <span className="pagination-page">
          Page <strong>{page}</strong>
          {totalPages !== undefined && <> of {totalPages}</>}
        </span>
        <div className="pagination-nav">
          <button
            className="button secondary"
            onClick={controls.prev}
            disabled={!hasPrev || controls.loading}
            aria-label="Previous page"
          >
            <ChevronLeft size={14} /> <span>Previous</span>
          </button>
          <button
            className="button secondary"
            onClick={controls.next}
            disabled={!hasNext || controls.loading}
            aria-label="Next page"
          >
            <span>Next</span> <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;
