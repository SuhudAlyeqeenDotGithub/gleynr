import { Info, Undo2 } from "lucide-react";
import {
  formatDate,
  formatPrice,
  getPlan,
  nextBillingDate,
} from "@/lib/plans/selectors";
import type { SubscriptionRecord } from "@/lib/plans/types";
import SubscriptionStatus from "./subscription-status";

type CurrentSubscriptionProps = {
  subscription: SubscriptionRecord;
  onChangePlan: () => void;
  onCancel: () => void;
  onUndoScheduled: () => void;
};

const CurrentSubscription = ({
  subscription,
  onChangePlan,
  onCancel,
  onUndoScheduled,
}: CurrentSubscriptionProps) => {
  const plan = getPlan(subscription.plan);
  const premium = subscription.type === "Premium";
  const scheduled = subscription.scheduledChange;
  const scheduledLabel = scheduled
    ? scheduled.kind === "cancel"
      ? `Cancellation scheduled for ${formatDate(scheduled.effectiveDate)}`
      : `Downgrade to ${scheduled.planName} scheduled for ${formatDate(scheduled.effectiveDate)}`
    : null;

  const facts = [
    { label: "Billing interval", value: subscription.billingInterval },
    { label: "Started", value: formatDate(subscription.startDate) },
    {
      label: "Next billing date",
      value: premium
        ? formatDate(nextBillingDate(subscription.startDate))
        : "Not applicable",
    },
  ];

  return (
    <section className="plan-summary" aria-labelledby="plans-current-title">
      <header className="plan-summary-head">
        <div>
          <span className="plan-summary-eyebrow">Current plan</span>
          <h2 id="plans-current-title">
            {subscription.plan}
            <SubscriptionStatus status={subscription.status} />
          </h2>
          <p>{plan?.summary}</p>
        </div>
        <div className="plan-summary-actions">
          <button
            className="button ghost"
            onClick={onCancel}
            disabled={!premium || scheduled?.kind === "cancel"}
            title={premium ? undefined : "The free plan has nothing to cancel"}
          >
            Cancel subscription
          </button>
          <button className="button primary" onClick={onChangePlan}>
            Change plan
          </button>
        </div>
      </header>

      <div className="plan-summary-pricing">
        <div className="plan-summary-price">
          <span className="plan-summary-label">Base subscription price</span>
          <div className="plan-summary-amount">
            <strong>
              {plan ? formatPrice(plan.monthlyPrice, plan.currency) : "—"}
            </strong>
            {plan?.monthlyPrice ? <span>/ month</span> : null}
          </div>
          <small>Fixed monthly amount</small>
        </div>
        <span className="plan-summary-plus" aria-hidden>
          +
        </span>
        <div className="plan-summary-price">
          <span className="plan-summary-label">Usage charges</span>
          <div className="plan-summary-amount variable">
            <strong>Variable</strong>
          </div>
          <small>Billed on top, based on your usage</small>
        </div>
      </div>

      <dl className="plan-summary-facts">
        {facts.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <p className="plan-summary-note">
        <Info size={14} />
        <span>
          <strong>This is not your total monthly cost.</strong> Additional usage
          charges apply on top of the base subscription price. Your final
          monthly bill is the base subscription price plus applicable usage
          charges. Usage details are in Usage &amp; bills.
        </span>
      </p>

      {scheduledLabel && (
        <div className="plan-summary-scheduled" role="status">
          <span>
            {scheduledLabel}. Your current plan stays active until then.
          </span>
          <button className="bl-link" onClick={onUndoScheduled}>
            <Undo2 size={13} /> Undo
          </button>
        </div>
      )}
    </section>
  );
};

export default CurrentSubscription;
