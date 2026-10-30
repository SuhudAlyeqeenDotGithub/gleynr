import { ChevronRight, History } from "lucide-react";
import { formatDate } from "@/lib/plans/selectors";
import type { SubscriptionRecord } from "@/lib/plans/types";
import BillingSection from "../shared/billing-section";
import { getPlanIcon } from "./plan-icons";
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
  <BillingSection
    id="plans-history-title"
    icon={History}
    title="Subscription history"
    description="Previous and current subscriptions are always retained."
    flush
  >
    <div className="bl-table-wrap">
      <table className="bl-table">
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
          {subscriptions.map((subscription) => {
            const Icon = getPlanIcon(subscription.plan);
            return (
              <tr
                key={subscription.id}
                className={
                  subscription.status === "Active" ? "is-current" : undefined
                }
                onClick={() => onInspect(subscription)}
              >
                <th scope="row">
                  <div className="bl-cell-id">
                    <span className="bl-mini-icon">
                      <Icon size={15} />
                    </span>
                    <div>
                      <strong>{subscription.plan}</strong>
                      <small>{subscription.type}</small>
                    </div>
                  </div>
                </th>
                <td>{subscriptionPeriod(subscription)}</td>
                <td>
                  <SubscriptionStatus status={subscription.status} />
                </td>
                <td className="bl-cell-end">
                  <button
                    className="bl-link"
                    onClick={(event) => {
                      event.stopPropagation();
                      onInspect(subscription);
                    }}
                    aria-label={`View details for ${subscription.plan} subscription`}
                  >
                    Details <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </BillingSection>
);

export default SubscriptionHistory;
