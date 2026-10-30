import { Check, Info, Minus } from "lucide-react";
import { ENTITLEMENT_GROUPS } from "@/lib/plans/catalog";
import {
  formatEntitlementValue,
  getEntitlementValue,
} from "@/lib/plans/selectors";
import type { PlanDefinition } from "@/lib/plans/types";

const EntitlementsPanel = ({ plan }: { plan: PlanDefinition }) => (
  <section className="panel plans-section" aria-labelledby="plans-entitlements-title">
    <div className="panel-head">
      <div>
        <h2 id="plans-entitlements-title">Plan entitlements</h2>
        <p>What {plan.name} entitles your organisation to.</p>
      </div>
    </div>
    <div className="plans-entitlement-grid">
      {ENTITLEMENT_GROUPS.map(({ id, label, icon: Icon, items }) => (
        <div key={id} className="plans-entitlement-group">
          <h3>
            <Icon size={15} /> {label}
          </h3>
          <ul>
            {items.map((item) => {
              const value = getEntitlementValue(plan, item);
              const unit = item.unit ? ` ${item.unit}` : "";
              return (
                <li key={item.key}>
                  <div className="plans-entitlement-row">
                    <span>{item.label}</span>
                    <strong>
                      {value.state === "included" && <Check size={14} />}
                      {value.state === "excluded" && <Minus size={14} />}
                      {formatEntitlementValue(value)}
                      {value.state === "limit" && value.limit !== "unlimited"
                        ? unit
                        : ""}
                    </strong>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
    <p className="plans-footnote">
      <Info size={13} /> Allowances are shown as plan limits. Track consumption
      in Usage &amp; entitlements. Demo data is illustrative.
    </p>
  </section>
);

export default EntitlementsPanel;
