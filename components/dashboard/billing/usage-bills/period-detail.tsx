import { CalendarDays, CalendarRange, Layers } from "lucide-react";
import ModalShell from "@/components/dashboard/dialogs/modal-shell";
import { formatMoney, getPeriodTotal } from "@/lib/usage-bills/calculations";
import type { BillingPeriod, PeriodBreakdown } from "@/lib/usage-bills/types";
import Receipt from "../shared/receipt";
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
      <div className="bl-dialog">
        <div className="bl-dialog-hero">
          <div>
            <BillingStatusLabel status={period.status} />
            <p>{STATUS_NOTE[period.status]}</p>
          </div>
          <div className="bl-dialog-figure">
            <span>{estimate ? "Estimated total" : "Total bill"}</span>
            <strong className={estimate ? "muted" : undefined}>
              {money(total)}
            </strong>
          </div>
        </div>

        <ul className="bl-facts">
          <li>
            <CalendarDays size={14} /> <span>Period start</span>
            <strong>{formatDate(period.startDate)}</strong>
          </li>
          <li>
            <CalendarRange size={14} /> <span>Period end</span>
            <strong>{formatDate(period.endDate)}</strong>
          </li>
          <li>
            <Layers size={14} /> <span>Plan</span>
            <strong>{period.planName}</strong>
          </li>
        </ul>

        <section>
          <h3 className="bl-dialog-heading">Charges</h3>
          <Receipt
            lines={[
              {
                label: "Base subscription",
                hint: "Fixed monthly",
                amount: money(period.baseSubscriptionPrice),
              },
              {
                label: estimate ? "Estimated usage" : "Usage charges",
                hint: estimate ? "Accumulated so far" : "Final usage charges",
                tag: estimate ? "Estimate" : undefined,
                amount: money(breakdown.usageTotal),
                muted: estimate,
              },
            ]}
            total={{
              label: estimate ? "Estimated total" : "Total bill",
              amount: money(total),
              muted: estimate,
            }}
          />
        </section>

        <section>
          <h3 className="bl-dialog-heading">Usage breakdown</h3>
          <UsageBreakdown
            breakdown={breakdown}
            currency={period.currency}
            idPrefix={`ub-detail-${period.id}`}
            defaultExpanded
          />
        </section>
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
