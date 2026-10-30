import { Eye } from "lucide-react";
import { formatDate } from "@/lib/plans/selectors";
import type { SubscriptionRecord } from "@/lib/plans/types";
import SubscriptionStatus from "./subscription-status";

export const subscriptionPeriod = (subscription: SubscriptionRecord) => {
  const end =
    subscription.endDate ?? subscription.scheduledChange?.effectiveDate;
  const finish = subscription.endDate
    ? formatDate(subscription.endDate)
    : end
      ? `${formatDate(end)} (scheduled)`
      : "Present";
  return `${formatDate(subscription.startDate)} – ${finish}`;
};

type SubscriptionHistoryProps = {
  subscriptions: SubscriptionRecord[];
  onInspect: (subscription: SubscriptionRecord) => void;
};

const SubscriptionHistory = ({
  subscriptions,
  onInspect,
}: SubscriptionHistoryProps) => (
  <section
    className="panel plans-section"
    aria-labelledby="plans-history-title"
  >
    <div className="panel-head">
      <div>
        <h2 id="plans-history-title">Subscription history</h2>
        <p>Previous and current subscriptions are always retained.</p>
      </div>
    </div>
    <div className="plans-history-wrap">
      <table className="plans-history">
        <thead>
          <tr>
            <th scope="col">Plan</th>
            <th scope="col">Period</th>
            <th scope="col">Status</th>
            <th scope="col">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription.id}>
              <td>
                <strong>{subscription.plan}</strong>
                <small>{subscription.type}</small>
              </td>
              <td>{subscriptionPeriod(subscription)}</td>
              <td>
                <SubscriptionStatus status={subscription.status} />
              </td>
              <td>
                <button
                  className="plans-link"
                  onClick={() => onInspect(subscription)}
                  aria-label={`View details for ${subscription.plan} subscription`}
                >
                  <Eye size={14} /> Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default SubscriptionHistory;
