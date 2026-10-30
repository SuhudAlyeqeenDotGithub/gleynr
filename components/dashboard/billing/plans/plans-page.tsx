"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { getPlan } from "@/lib/plans/selectors";
import type { SubscriptionRecord } from "@/lib/plans/types";
import type { SubscriptionStore } from "@/lib/plans/use-subscription-store";
import BillingHeader from "../shared/billing-header";
import AvailablePlans from "./available-plans";
import CancelSubscriptionDialog from "./cancel-subscription-dialog";
import ChangePlanDialog from "./change-plan-dialog";
import CurrentSubscription from "./current-subscription";
import EntitlementsPanel from "./entitlements-panel";
import SubscriptionDetailsDialog from "./subscription-details-dialog";
import SubscriptionHistory from "./subscription-history";

type PlansPageProps = {
  subscriptionStore: SubscriptionStore;
  notify: (text: string) => void;
};

const PlansPage = ({ subscriptionStore, notify }: PlansPageProps) => {
  const { subscriptions, current, changePlan, cancel, undoScheduledChange } =
    subscriptionStore;
  const [targetPlan, setTargetPlan] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [inspected, setInspected] = useState<SubscriptionRecord | null>(null);

  const plan = current && getPlan(current.plan);

  return (
    <div className="page-content bl-page">
      <BillingHeader
        icon={Package}
        title="Plans & subscription"
        description="Manage your plan, entitlements and subscription history."
      />

      {current && plan ? (
        <>
          <CurrentSubscription
            subscription={current}
            onChangePlan={() => {
              document
                .getElementById("plans-available-title")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            onCancel={() => setCancelling(true)}
            onUndoScheduled={() => {
              undoScheduledChange();
              notify("Scheduled change undone.");
            }}
          />
          <EntitlementsPanel plan={plan} />
          <AvailablePlans currentPlan={current.plan} onSelect={setTargetPlan} />
        </>
      ) : (
        <section className="bl-section">
          <div className="bl-section-body">
            <p className="dialog-copy">
              There is no active subscription. Previous subscriptions are listed
              below.
            </p>
          </div>
        </section>
      )}

      <SubscriptionHistory
        subscriptions={subscriptions}
        onInspect={setInspected}
      />

      {current && targetPlan && (
        <ChangePlanDialog
          subscription={current}
          targetName={targetPlan}
          onClose={() => setTargetPlan(null)}
          onConfirm={() => {
            changePlan(targetPlan);
            notify(`Plan change to ${targetPlan} confirmed.`);
          }}
        />
      )}
      {current && cancelling && (
        <CancelSubscriptionDialog
          subscription={current}
          onClose={() => setCancelling(false)}
          onConfirm={() => {
            cancel();
            notify("Cancellation scheduled.");
          }}
        />
      )}
      {inspected && (
        <SubscriptionDetailsDialog
          subscription={inspected}
          onClose={() => setInspected(null)}
        />
      )}
    </div>
  );
};

export default PlansPage;
