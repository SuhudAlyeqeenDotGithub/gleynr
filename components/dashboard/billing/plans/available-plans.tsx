import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Plus,
} from "lucide-react";
import { ENTITLEMENT_ITEMS } from "@/lib/plans/catalog";
import { MOCK_PLANS } from "@/lib/plans/mock/plans";
import {
  formatEntitlementValue,
  formatPrice,
  getChangeKind,
  getEntitlementValue,
} from "@/lib/plans/selectors";
import BillingNote from "../shared/billing-note";
import BillingSection from "../shared/billing-section";
import { getPlanIcon } from "./plan-icons";
import PlanComparison from "./plan-comparison";

type AvailablePlansProps = {
  currentPlan: string;
  onSelect: (planName: string) => void;
};

const CARD_KEYS = [
  "sites",
  "internalUsers",
  "monthlyVisits",
  "retentionMonths",
];
const KEY_ITEMS = ENTITLEMENT_ITEMS.filter((item) =>
  CARD_KEYS.includes(item.key),
);

const AvailablePlans = ({ currentPlan, onSelect }: AvailablePlansProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <BillingSection
      id="plans-available-title"
      icon={Layers}
      title="Available plans"
      description="Compare plans and change at any time."
      action={
        <button
          className="button secondary"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? "Hide full comparison" : "Compare all features"}
        </button>
      }
    >
      <div className="plan-cards">
        {MOCK_PLANS.map((plan) => {
          const isCurrent = plan.name === currentPlan;
          const kind = getChangeKind(currentPlan, plan.name);
          const Icon = getPlanIcon(plan.name);
          return (
            <article
              key={plan.id}
              className={`plan-card ${isCurrent ? "current" : ""}`}
              aria-current={isCurrent ? "true" : undefined}
            >
              {isCurrent && (
                <span className="plan-card-flag">
                  <Check size={11} /> Your plan
                </span>
              )}
              <header>
                <span className="plan-card-icon">
                  <Icon size={18} />
                </span>
                <h3>{plan.name}</h3>
              </header>
              <p className="plan-card-summary">{plan.summary}</p>

              <div className="plan-card-price">
                <span className="plan-card-label">Base price</span>
                <div>
                  <strong>
                    {formatPrice(plan.monthlyPrice, plan.currency)}
                  </strong>
                  {plan.monthlyPrice ? <span>/ month</span> : null}
                </div>
                <span className="plan-card-usage">
                  <Plus size={11} /> usage charges
                </span>
              </div>

              <ul className="plan-card-limits">
                {KEY_ITEMS.map((item) => {
                  const value = getEntitlementValue(plan, item);
                  return (
                    <li key={item.key}>
                      <span>{item.label}</span>
                      <strong>{formatEntitlementValue(value)}</strong>
                    </li>
                  );
                })}
              </ul>

              {isCurrent ? (
                <button className="button secondary" disabled>
                  Current plan
                </button>
              ) : (
                <button
                  className={`button ${kind === "upgrade" ? "primary" : "secondary"}`}
                  onClick={() => onSelect(plan.name)}
                >
                  {kind === "upgrade" ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {kind === "upgrade" ? "Upgrade" : "Downgrade"}
                </button>
              )}
            </article>
          );
        })}
      </div>
      <BillingNote>
        Prices shown are base subscription prices, not total monthly costs.
        Usage charges apply on top and are billed monthly.
      </BillingNote>
      {expanded && <PlanComparison currentPlan={currentPlan} />}
    </BillingSection>
  );
};

export default AvailablePlans;
