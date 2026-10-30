import { CalendarClock, Crown, Info, Undo2 } from "lucide-react";
import { formatDate, getPlan, nextBillingDate } from "@/lib/plans/selectors";
import type { SubscriptionRecord } from "@/lib/plans/types";
import BasePrice from "./base-price";
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

  const details = [
    {
      label: "Base subscription price",
      value: plan ? (
        <BasePrice price={plan.monthlyPrice} currency={plan.currency} />
      ) : (
        "—"
      ),
    },
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
    <section
      className="panel plans-current"
      aria-labelledby="plans-current-title"
    >
      <div className="plans-current-main">
        <span className="plans-current-icon">
          <Crown size={20} />
        </span>
        <div>
          <div className="plans-eyebrow">Current plan</div>
          <h2 id="plans-current-title">
            {subscription.plan}{" "}
            <SubscriptionStatus status={subscription.status} />
          </h2>
          <p>{plan?.summary}</p>
        </div>
        <div className="plans-current-actions">
          <button className="button primary" onClick={onChangePlan}>
            Change plan
          </button>
          <button
            className="button secondary"
            onClick={onCancel}
            disabled={!premium || scheduled?.kind === "cancel"}
            title={premium ? undefined : "The free plan has nothing to cancel"}
          >
            Cancel subscription
          </button>
        </div>
      </div>
      <dl className="plans-current-details">
        {details.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="plans-pricing-note">
        <Info size={15} />
        <p>
          <strong>This is not your total monthly cost.</strong> Additional usage
          charges apply on top of the base subscription price. Your final
          monthly bill is the base subscription price plus applicable usage
          charges. Usage details are in Usage &amp; entitlements.
        </p>
      </div>
      {scheduledLabel && (
        <div className="plans-notice" role="status">
          <CalendarClock size={15} />
          <span>
            {scheduledLabel}. Your current plan stays active until then.
          </span>
          <button className="plans-link" onClick={onUndoScheduled}>
            <Undo2 size={13} /> Undo
          </button>
        </div>
      )}
    </section>
  );
};

export default CurrentSubscription;
