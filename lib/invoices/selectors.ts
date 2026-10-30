import type {
  InvoiceCharges,
  InvoiceFilter,
  InvoiceRecord,
  InvoiceStatus,
} from "./types";

export const INVOICE_STATUSES: InvoiceStatus[] = [
  "Paid",
  "Pending",
  "Failed",
  "Action Required",
  "Not Charged",
];

export const getChargesTotal = (charges: InvoiceCharges) =>
  Math.round(
    (charges.baseSubscription +
      charges.usage +
      charges.additional.reduce((sum, item) => sum + item.amount, 0)) *
      100,
  ) / 100;

// Each invoice counts once, by its current status; payment attempts are never counted.
export const countByStatus = (invoices: InvoiceRecord[]) => {
  const counts = Object.fromEntries(
    INVOICE_STATUSES.map((status) => [status, 0]),
  ) as Record<InvoiceStatus, number>;
  for (const invoice of invoices) counts[invoice.status] += 1;
  return counts;
};

export const filterInvoices = (
  invoices: InvoiceRecord[],
  filter: InvoiceFilter,
  query: string,
) => {
  const term = query.trim().toLowerCase();
  return invoices.filter(
    (invoice) =>
      (filter === "All" || invoice.status === filter) &&
      (!term || invoice.number.toLowerCase().includes(term)),
  );
};

export const formatInvoiceDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatInvoiceDateTime = (date: Date) =>
  `${formatInvoiceDate(date)}, ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
