import { CalendarDays, ChevronRight } from "lucide-react";
import {
  buildBreakdown,
  formatMoney,
  formatPeriodRange,
  getPeriodTotal,
} from "@/lib/usage-bills/calculations";
import type { BillingPeriod } from "@/lib/usage-bills/types";
import BillingStatusLabel from "./billing-status";

type BillingHistoryTableProps = {
  periods: BillingPeriod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const BillingHistoryTable = ({
  periods,
  selectedId,
  onSelect,
}: BillingHistoryTableProps) => (
  <div className="bl-table-wrap">
    <table className="bl-table">
      <thead>
        <tr>
          <th scope="col">Billing period</th>
          <th scope="col" className="num">
            Base subscription
          </th>
          <th scope="col" className="num">
            Usage charges
          </th>
          <th scope="col" className="num">
            Total bill
          </th>
          <th scope="col">Status</th>
          <th scope="col">
            <span className="sr-only">Open</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {periods.map((period) => {
          const breakdown = buildBreakdown(period);
          const total = getPeriodTotal(period, breakdown);
          const estimate = breakdown.basis === "estimate";
          const selected = period.id === selectedId;
          return (
            <tr
              key={period.id}
              className={`${selected ? "selected" : ""} ${estimate ? "is-current" : ""}`}
              onClick={() => onSelect(period.id)}
            >
              <th scope="row">
                <div className="bl-cell-id">
                  <span className="bl-mini-icon">
                    <CalendarDays size={15} />
                  </span>
                  <div>
                    <button
                      className="bl-row-button"
                      aria-pressed={selected}
                      aria-label={`View usage breakdown for ${period.label}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelect(period.id);
                      }}
                    >
                      {period.label}
                    </button>
                    <small>{formatPeriodRange(period)}</small>
                  </div>
                </div>
              </th>
              <td className="num">
                {formatMoney(period.baseSubscriptionPrice, period.currency)}
              </td>
              <td className={`num ${estimate ? "est" : ""}`}>
                {breakdown.usageTotal === null
                  ? "Pending"
                  : formatMoney(breakdown.usageTotal, period.currency)}
                {estimate && <small>Estimate</small>}
              </td>
              <td className={`num strong ${estimate ? "est" : ""}`}>
                {total === null
                  ? "Pending"
                  : formatMoney(total, period.currency)}
                {estimate && <small>Estimate</small>}
              </td>
              <td>
                <BillingStatusLabel status={period.status} />
              </td>
              <td className="bl-cell-end">
                <ChevronRight size={16} className="bl-row-chev" />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default BillingHistoryTable;
