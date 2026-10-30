import type { ReactNode } from "react";
import ModalShell from "@/components/dashboard/dialogs/modal-shell";
import { formatDate, getPlan } from "@/lib/plans/selectors";
import type { SubscriptionRecord } from "@/lib/plans/types";
import BasePrice from "./base-price";
import { subscriptionPeriod } from "./subscription-history";
import SubscriptionStatus from "./subscription-status";

type SubscriptionDetailsDialogProps = {
  subscription: SubscriptionRecord;
  onClose: () => void;
};

const SubscriptionDetailsDialog = ({
  subscription,
  onClose,
}: SubscriptionDetailsDialogProps) => {
  const plan = getPlan(subscription.plan);
  const rows: [string, ReactNode][] = [
    ["Subscription ID", subscription.id],
    ["Plan", subscription.plan],
    ["Plan type", subscription.type],
    ["Status", <SubscriptionStatus key="s" status={subscription.status} />],
    ["Period", subscriptionPeriod(subscription)],
    ["Billing interval", subscription.billingInterval],
    [
      "Base subscription price",
      plan ? (
        <BasePrice price={plan.monthlyPrice} currency={plan.currency} />
      ) : (
        "—"
      ),
    ],
  ];
  if (subscription.cancellationDate)
    rows.push([
      "Cancellation requested",
      formatDate(subscription.cancellationDate),
    ]);

  return (
    <ModalShell title="Subscription details" onClose={onClose}>
      <dl className="plans-details">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </ModalShell>
  );
};

export default SubscriptionDetailsDialog;
