import {
  Building2,
  CalendarDays,
  CalendarRange,
  Download,
  FileText,
  Mail,
  MapPin,
  RefreshCw,
} from "lucide-react";
import ModalShell from "@/components/dashboard/dialogs/modal-shell";
import {
  formatInvoiceDate,
  formatInvoiceDateTime,
} from "@/lib/invoices/selectors";
import type { InvoiceRecord } from "@/lib/invoices/types";
import { formatMoney } from "@/lib/usage-bills/calculations";
import Receipt from "../shared/receipt";
import StatusBadge from "../shared/status-badge";
import { ATTEMPT_OUTCOME } from "../shared/status-presets";
import InvoiceStatusLabel from "./invoice-status";

type InvoiceDetailsDialogProps = {
  invoice: InvoiceRecord;
  onClose: () => void;
  onRetry: () => void;
  onUpdatePaymentMethod: () => void;
  onDownload: () => void;
};

const STATUS_NOTE: Record<InvoiceRecord["status"], string> = {
  Paid: "Payment received. Thank you.",
  Pending: "Payment is being processed. No action is needed.",
  Failed: "The last payment attempt failed. You can retry the payment.",
  "Action Required":
    "Payment could not be taken. Update your payment method, then retry.",
  "Not Charged": "No payment was attempted for this invoice.",
};

const InvoiceDetailsDialog = ({
  invoice,
  onClose,
  onRetry,
  onUpdatePaymentMethod,
  onDownload,
}: InvoiceDetailsDialogProps) => {
  const money = (amount: number) => formatMoney(amount, invoice.amountCurrency);
  const { billing, charges, status } = invoice;
  const needsMethod = status === "Failed" || status === "Action Required";
  const canRetry =
    status === "Failed" ||
    (status === "Action Required" && invoice.paymentMethodUpdated);

  return (
    <ModalShell title={`Invoice ${invoice.number}`} onClose={onClose} wide>
      <div className="bl-dialog">
        <div className="bl-dialog-hero">
          <div>
            <InvoiceStatusLabel status={status} />
            <p>{STATUS_NOTE[status]}</p>
          </div>
          <div className="bl-dialog-figure">
            <span>Total amount</span>
            <strong>{money(invoice.amount)}</strong>
          </div>
        </div>

        <ul className="bl-facts">
          <li>
            <FileText size={14} /> <span>Invoice number</span>
            <strong>{invoice.number}</strong>
          </li>
          <li>
            <CalendarDays size={14} /> <span>Invoice date</span>
            <strong>{formatInvoiceDate(invoice.chargedDate)}</strong>
          </li>
          <li>
            <CalendarRange size={14} /> <span>Billing period</span>
            <strong>
              {formatInvoiceDate(invoice.periodStart)} –{" "}
              {formatInvoiceDate(invoice.periodEnd)}
            </strong>
          </li>
          <li>
            <span className="bl-code-mini">{invoice.amountCurrency}</span>
            <span>Currency</span>
            <strong>{invoice.amountCurrency}</strong>
          </li>
        </ul>

        <section>
          <h3 className="bl-dialog-heading">Billing information</h3>
          <div className="inv-billing">
            <div>
              <Building2 size={15} />
              <span>{billing.name}</span>
            </div>
            <div>
              <Mail size={15} />
              <span>{billing.email}</span>
            </div>
            <div>
              <MapPin size={15} />
              <span>
                {billing.address}, {billing.city}, {billing.postalCode}
              </span>
            </div>
          </div>
          <p className="bl-hint">
            Details as they were when this invoice was issued.
          </p>
        </section>

        <section>
          <h3 className="bl-dialog-heading">Charge breakdown</h3>
          <Receipt
            lines={[
              {
                label: "Base subscription",
                hint: "Fixed monthly",
                amount: money(charges.baseSubscription),
              },
              {
                label: "Usage charges",
                hint: "Final, based on usage in the period",
                amount: money(charges.usage),
              },
              ...charges.additional.map((item) => ({
                label: "Additional purchase",
                hint: item.label,
                amount: money(item.amount),
              })),
            ]}
            total={{ label: "Total", amount: money(invoice.amount) }}
          />
        </section>

        <section>
          <h3 className="bl-dialog-heading">Payment history</h3>
          {invoice.attempts.length === 0 ? (
            <p className="bl-hint">No payment attempts.</p>
          ) : (
            <ol className="inv-timeline">
              {invoice.attempts.map((attempt) => {
                const preset = ATTEMPT_OUTCOME[attempt.outcome];
                const Icon = preset.icon;
                return (
                  <li key={attempt.id} className={`tone-${preset.tone}`}>
                    <span className="inv-node">
                      <Icon size={14} />
                    </span>
                    <div className="inv-attempt">
                      <div className="inv-attempt-row">
                        <StatusBadge label={attempt.outcome} preset={preset} />
                        <strong>{money(attempt.amount)}</strong>
                      </div>
                      <small>{formatInvoiceDateTime(attempt.date)}</small>
                      {attempt.note && <p>{attempt.note}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        {invoice.paymentMethodUpdated && status !== "Paid" && (
          <p className="bl-callout" role="status">
            Payment method updated (simulated).
            {canRetry ? " You can now retry the payment." : ""}
          </p>
        )}
      </div>

      <div className="modal-actions inv-actions">
        <button className="button secondary" onClick={onDownload}>
          <Download size={14} /> Download PDF
        </button>
        {needsMethod && (
          <button
            className={`button ${canRetry ? "secondary" : "primary"}`}
            onClick={onUpdatePaymentMethod}
          >
            Update payment method
          </button>
        )}
        {needsMethod && (
          <button
            className="button primary"
            onClick={onRetry}
            disabled={!canRetry}
            title={canRetry ? undefined : "Update the payment method first"}
          >
            <RefreshCw size={14} /> Retry payment
          </button>
        )}
        <button className="button secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </ModalShell>
  );
};

export default InvoiceDetailsDialog;
