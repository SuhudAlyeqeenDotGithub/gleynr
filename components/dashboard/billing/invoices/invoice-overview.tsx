import { INVOICE_STATUSES } from "@/lib/invoices/selectors";
import type { InvoiceFilter, InvoiceStatus } from "@/lib/invoices/types";
import { INVOICE_STATUS } from "../shared/status-presets";

type InvoiceOverviewProps = {
  total: number;
  counts: Record<InvoiceStatus, number>;
  filter: InvoiceFilter;
  onFilter: (filter: InvoiceFilter) => void;
};

const InvoiceOverview = ({
  total,
  counts,
  filter,
  onFilter,
}: InvoiceOverviewProps) => {
  const items: {
    key: InvoiceFilter;
    label: string;
    count: number;
    tone?: string;
  }[] = [
    { key: "All", label: "Total invoices", count: total },
    ...INVOICE_STATUSES.map((status) => ({
      key: status as InvoiceFilter,
      label: status,
      count: counts[status],
      tone: INVOICE_STATUS[status].tone,
    })),
  ];

  return (
    <div className="inv-overview" role="group" aria-label="Invoice overview">
      {items.map(({ key, label, count, tone }) => (
        <button
          key={key}
          className={`inv-stat ${tone ? `tone-${tone}` : ""} ${filter === key ? "active" : ""}`}
          aria-pressed={filter === key}
          onClick={() => onFilter(key)}
        >
          <span className="inv-stat-label">
            {tone && <i aria-hidden />}
            {label}
          </span>
          <strong>{count}</strong>
        </button>
      ))}
    </div>
  );
};

export default InvoiceOverview;
