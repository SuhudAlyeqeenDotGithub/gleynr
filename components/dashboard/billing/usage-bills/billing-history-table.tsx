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
  <div className="ub-history-wrap">
    <table className="ub-history">
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
              className={selected ? "selected" : undefined}
              onClick={() => onSelect(period.id)}
            >
              <th scope="row">
                <button
                  className="ub-row-button"
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
              </th>
              <td className="num">
                {formatMoney(period.baseSubscriptionPrice, period.currency)}
              </td>
              <td className={`num ${estimate ? "estimate" : ""}`}>
                {breakdown.usageTotal === null
                  ? "Pending"
                  : formatMoney(breakdown.usageTotal, period.currency)}
                {estimate && <small>Estimate</small>}
              </td>
              <td className={`num total ${estimate ? "estimate" : ""}`}>
                {total === null ? "Pending" : formatMoney(total, period.currency)}
                {estimate && <small>Estimate</small>}
              </td>
              <td>
                <BillingStatusLabel status={period.status} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default BillingHistoryTable;
