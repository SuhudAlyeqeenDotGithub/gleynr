import { ChevronRight, FileText } from "lucide-react";
import { formatMoney } from "@/lib/usage-bills/calculations";
import { formatInvoiceDate } from "@/lib/invoices/selectors";
import type { InvoiceRecord } from "@/lib/invoices/types";
import InvoiceStatusLabel from "./invoice-status";

type InvoiceTableProps = {
  invoices: InvoiceRecord[];
  onSelect: (id: string) => void;
};

const InvoiceTable = ({ invoices, onSelect }: InvoiceTableProps) => (
  <div className="bl-table-wrap">
    <table className="bl-table">
      <thead>
        <tr>
          <th scope="col">Invoice</th>
          <th scope="col">Invoice date</th>
          <th scope="col">Billing period</th>
          <th scope="col" className="num">
            Total
          </th>
          <th scope="col">Currency</th>
          <th scope="col">Status</th>
          <th scope="col">
            <span className="sr-only">Open</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr
            key={invoice.id}
            className={
              invoice.status === "Failed"
                ? "attn-danger"
                : invoice.status === "Action Required"
                  ? "attn-warning"
                  : undefined
            }
            onClick={() => onSelect(invoice.id)}
          >
            <th scope="row">
              <div className="bl-cell-id">
                <span className="bl-mini-icon">
                  <FileText size={15} />
                </span>
                <button
                  className="bl-row-button"
                  aria-label={`View details for invoice ${invoice.number}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(invoice.id);
                  }}
                >
                  {invoice.number}
                </button>
              </div>
            </th>
            <td>{formatInvoiceDate(invoice.chargedDate)}</td>
            <td>{invoice.period}</td>
            <td className="num strong">
              {formatMoney(invoice.amount, invoice.amountCurrency)}
            </td>
            <td>
              <span className="bl-code">{invoice.amountCurrency}</span>
            </td>
            <td>
              <InvoiceStatusLabel status={invoice.status} />
            </td>
            <td className="bl-cell-end">
              <ChevronRight size={16} className="bl-row-chev" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default InvoiceTable;
