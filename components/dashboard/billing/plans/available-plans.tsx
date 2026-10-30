import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { ENTITLEMENT_ITEMS } from "@/lib/plans/catalog";
import { MOCK_PLANS } from "@/lib/plans/mock/plans";
import {
  formatEntitlementValue,
  getChangeKind,
  getEntitlementValue,
} from "@/lib/plans/selectors";
import BasePrice from "./base-price";
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
    <section
      className="panel plans-section"
      aria-labelledby="plans-available-title"
    >
      <div className="panel-head">
        <div>
          <h2 id="plans-available-title">Available plans</h2>
          <p>Compare plans and change at any time.</p>
        </div>
        <button
          className="button secondary"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? "Hide full comparison" : "Compare all features"}
        </button>
      </div>
      <div className="plans-cards">
        {MOCK_PLANS.map((plan) => {
          const isCurrent = plan.name === currentPlan;
          const kind = getChangeKind(currentPlan, plan.name);
          return (
            <article
              key={plan.id}
              className={`plans-card ${isCurrent ? "current" : ""}`}
              aria-current={isCurrent ? "true" : undefined}
            >
              <div className="plans-card-head">
                <h3>{plan.name}</h3>
                {isCurrent && <span className="plans-badge">Current plan</span>}
              </div>
              <p>{plan.summary}</p>
              <div className="plans-price">
                <span className="plans-price-label">Base price</span>
                <BasePrice price={plan.monthlyPrice} currency={plan.currency} />
              </div>
              <ul>
                {KEY_ITEMS.map((item) => {
                  const value = getEntitlementValue(plan, item);
                  return (
                    <li key={item.key}>
                      <span>{item.label}</span>
                      <strong
                        className={value.state === "tbc" ? "tbc" : undefined}
                      >
                        {formatEntitlementValue(value)}
                      </strong>
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
      <p className="plans-footnote">
        <Info size={13} /> Prices shown are base subscription prices, not total
        monthly costs. Usage charges apply on top and are billed monthly.
      </p>
      {expanded && <PlanComparison currentPlan={currentPlan} />}
    </section>
  );
};

export default AvailablePlans;
