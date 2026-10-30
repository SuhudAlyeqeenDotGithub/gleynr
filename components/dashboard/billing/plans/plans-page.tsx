"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { getPlan } from "@/lib/plans/selectors";
import type { SubscriptionRecord } from "@/lib/plans/types";
import type { SubscriptionStore } from "@/lib/plans/use-subscription-store";
import BillingHeader from "../shared/billing-header";
import BillingTabs, { tabPanelId } from "../shared/billing-tabs";
import type { BillingTabItem } from "../shared/billing-tabs";
import { useBillingTab } from "../shared/use-billing-tab";
import AvailablePlans from "./available-plans";
import CancelSubscriptionDialog from "./cancel-subscription-dialog";
import ChangePlanDialog from "./change-plan-dialog";
import CurrentSubscription from "./current-subscription";
import EntitlementsPanel from "./entitlements-panel";
import PlanSummaryStrip from "./plan-summary-strip";
import SubscriptionDetailsDialog from "./subscription-details-dialog";
import SubscriptionHistory from "./subscription-history";

type PlansTab = "current" | "entitlements" | "plans" | "history";

const TABS: BillingTabItem<PlansTab>[] = [
  { value: "current", label: "Current plan" },
  { value: "entitlements", label: "Entitlements" },
  { value: "plans", label: "Available plans" },
  { value: "history", label: "Subscription history" },
];
const TAB_VALUES = TABS.map((tab) => tab.value);

type PlansPageProps = {
  subscriptionStore: SubscriptionStore;
  notify: (text: string) => void;
};

const PlansPage = ({ subscriptionStore, notify }: PlansPageProps) => {
  const { subscriptions, current, changePlan, cancel, undoScheduledChange } =
    subscriptionStore;
  const [tab, setTab] = useBillingTab<PlansTab>(TAB_VALUES, "current");
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
      <BillingTabs
        tabs={TABS}
        value={tab}
        onChange={setTab}
        label="Plans and subscription sections"
        idPrefix="plans"
      />

      <div
        className="bl-page"
        role="tabpanel"
        id={tabPanelId("plans", tab)}
        aria-labelledby={`plans-tab-${tab}`}
      >
        {current && tab !== "current" && (
          <PlanSummaryStrip
            subscription={current}
            onView={() => setTab("current")}
          />
        )}

        {tab === "current" && current && (
          <CurrentSubscription
            subscription={current}
            onChangePlan={() => setTab("plans")}
            onCancel={() => setCancelling(true)}
            onUndoScheduled={() => {
              undoScheduledChange();
              notify("Scheduled change undone.");
            }}
          />
        )}
        {tab === "entitlements" && plan && <EntitlementsPanel plan={plan} />}
        {tab === "plans" && current && (
          <AvailablePlans currentPlan={current.plan} onSelect={setTargetPlan} />
        )}
        {tab === "history" && (
          <SubscriptionHistory
            subscriptions={subscriptions}
            onInspect={setInspected}
          />
        )}
        {!current && tab !== "history" && (
          <section className="bl-section">
            <div className="bl-section-body">
              <p className="dialog-copy">
                There is no active subscription. Previous subscriptions are
                listed under Subscription history.
              </p>
            </div>
          </section>
        )}
      </div>

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
