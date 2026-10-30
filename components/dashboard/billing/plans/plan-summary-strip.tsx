import {
  formatDate,
  formatPrice,
  getPlan,
  nextBillingDate,
} from "@/lib/plans/selectors";
import type { SubscriptionRecord } from "@/lib/plans/types";
import SubscriptionStatus from "./subscription-status";

type PlanSummaryStripProps = {
  subscription: SubscriptionRecord;
  onView: () => void;
};

// Compact reminder of the active subscription for the other tabs.
const PlanSummaryStrip = ({ subscription, onView }: PlanSummaryStripProps) => {
  const plan = getPlan(subscription.plan);
  const premium = subscription.type === "Premium";
  return (
    <div className="plan-strip">
      <div className="plan-strip-main">
        <span className="plan-strip-label">Current plan</span>
        <strong>{subscription.plan}</strong>
        <SubscriptionStatus status={subscription.status} />
      </div>
      <div className="plan-strip-meta">
        {plan && (
          <span>
            Base price{" "}
            <strong>
              {formatPrice(plan.monthlyPrice, plan.currency)}
              {plan.monthlyPrice ? " / month" : ""}
            </strong>{" "}
            + usage charges
          </span>
        )}
        {premium && (
          <span>
            Next billing{" "}
            <strong>
              {formatDate(nextBillingDate(subscription.startDate))}
            </strong>
          </span>
        )}
      </div>
      <button className="bl-link" onClick={onView}>
        View details
      </button>
    </div>
  );
};

export default PlanSummaryStrip;
