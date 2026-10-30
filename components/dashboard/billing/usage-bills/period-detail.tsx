import {
  formatMoney,
  getPeriodTotal,
} from "@/lib/usage-bills/calculations";
import ModalShell from "@/components/dashboard/dialogs/modal-shell";
import type { BillingPeriod, PeriodBreakdown } from "@/lib/usage-bills/types";
import BillingStatusLabel from "./billing-status";
import UsageBreakdown from "./usage-breakdown";

type PeriodDetailProps = {
  period: BillingPeriod;
  breakdown: PeriodBreakdown;
  onClose: () => void;
};

const STATUS_NOTE: Record<BillingPeriod["status"], string> = {
  "In Progress":
    "This period is still open. Figures are estimates and may change.",
  "Awaiting Calculation":
    "This period has ended. Usage charges will appear once calculation completes.",
  Calculated: "Usage charges are final. The bill has not been charged yet.",
  Charged: "Final bill. This amount has been charged.",
  "Not Charged": "Final bill. This amount has not been charged.",
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const PeriodDetail = ({ period, breakdown, onClose }: PeriodDetailProps) => {
  const total = getPeriodTotal(period, breakdown);
  const estimate = breakdown.basis === "estimate";
  const money = (amount: number | null) =>
    amount === null ? "Pending" : formatMoney(amount, period.currency);

  return (
    <ModalShell title={`${period.label} bill`} onClose={onClose} wide>
      <div className="ub-detail">
        <div className="ub-detail-head">
          <BillingStatusLabel status={period.status} />
          <p>{STATUS_NOTE[period.status]}</p>
        </div>
        <dl className="ub-detail-dates">
          <div>
            <dt>Period start</dt>
            <dd>{formatDate(period.startDate)}</dd>
          </div>
          <div>
            <dt>Period end</dt>
            <dd>{formatDate(period.endDate)}</dd>
          </div>
          <div>
            <dt>Plan</dt>
            <dd>{period.planName}</dd>
          </div>
        </dl>
        <dl className="ub-detail-summary">
          <div>
            <dt>Base subscription</dt>
            <dd>{money(period.baseSubscriptionPrice)}</dd>
          </div>
          <div>
            <dt>{estimate ? "Estimated usage" : "Usage charges"}</dt>
            <dd className={estimate ? "estimate" : undefined}>
              {money(breakdown.usageTotal)}
            </dd>
          </div>
          <div>
            <dt>{estimate ? "Estimated total" : "Total bill"}</dt>
            <dd className={`total ${estimate ? "estimate" : ""}`}>
              {money(total)}
            </dd>
          </div>
        </dl>
        <UsageBreakdown
          breakdown={breakdown}
          currency={period.currency}
          idPrefix={`ub-detail-${period.id}`}
          defaultExpanded
        />
      </div>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </ModalShell>
  );
};

export default PeriodDetail;
