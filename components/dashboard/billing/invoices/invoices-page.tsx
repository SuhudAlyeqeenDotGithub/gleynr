"use client";

import { useMemo, useState } from "react";
import { FileText, Receipt } from "lucide-react";
import EmptyState from "@/components/dashboard/shared/empty-state";
import ListToolbar from "@/components/dashboard/shared/list-toolbar";
import {
  INVOICE_STATUSES,
  countByStatus,
  filterInvoices,
} from "@/lib/invoices/selectors";
import type { InvoiceFilter } from "@/lib/invoices/types";
import { useInvoicesStore } from "@/lib/invoices/use-invoices-store";
import BillingHeader from "../shared/billing-header";
import BillingSection from "../shared/billing-section";
import InvoiceDetailsDialog from "./invoice-details-dialog";
import InvoiceOverview from "./invoice-overview";
import InvoiceTable from "./invoice-table";

const InvoicesPage = ({ notify }: { notify: (text: string) => void }) => {
  const { invoices, retryPayment, updatePaymentMethod } = useInvoicesStore();
  const [filter, setFilter] = useState<InvoiceFilter>("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(() => countByStatus(invoices), [invoices]);
  const visible = useMemo(
    () => filterInvoices(invoices, filter, query),
    [invoices, filter, query],
  );
  const selected = invoices.find((invoice) => invoice.id === selectedId);

  return (
    <div className="page-content bl-page">
      <BillingHeader
        icon={FileText}
        title="Invoices"
        description="Review invoices, payment outcomes and payment history."
      />

      <InvoiceOverview
        total={invoices.length}
        counts={counts}
        filter={filter}
        onFilter={setFilter}
      />

      <BillingSection
        id="inv-history-title"
        icon={Receipt}
        title="Invoice history"
        description="All invoices, regardless of payment outcome."
        flush
      >
        <div className="bl-toolbar">
          <ListToolbar
            query={query}
            onQuery={setQuery}
            placeholder="Search by invoice number"
            count={`${visible.length} of ${invoices.length} invoices`}
          >
            <select
              className="filter-select"
              aria-label="Filter by status"
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as InvoiceFilter)
              }
            >
              <option value="All">All statuses</option>
              {INVOICE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </ListToolbar>
        </div>
        {visible.length > 0 ? (
          <InvoiceTable invoices={visible} onSelect={setSelectedId} />
        ) : (
          <EmptyState text="No invoices match your search or filter." />
        )}
      </BillingSection>

      {selected && (
        <InvoiceDetailsDialog
          invoice={selected}
          onClose={() => setSelectedId(null)}
          onRetry={() => {
            notify(`Retrying payment for ${selected.number} (simulated).`);
            retryPayment(selected, () =>
              notify(`Payment for ${selected.number} succeeded (simulated).`),
            );
          }}
          onUpdatePaymentMethod={() => {
            updatePaymentMethod(selected.id);
            notify("Payment method updated (simulated).");
          }}
          onDownload={() =>
            notify(`Invoice ${selected.number} PDF downloaded (simulated).`)
          }
        />
      )}
    </div>
  );
};

export default InvoicesPage;
