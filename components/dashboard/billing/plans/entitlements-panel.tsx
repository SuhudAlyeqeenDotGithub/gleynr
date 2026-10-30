import { Check, ListChecks, Minus } from "lucide-react";
import { ENTITLEMENT_GROUPS } from "@/lib/plans/catalog";
import {
  formatEntitlementValue,
  getEntitlementValue,
} from "@/lib/plans/selectors";
import type { PlanDefinition } from "@/lib/plans/types";
import BillingNote from "../shared/billing-note";
import BillingSection from "../shared/billing-section";

const EntitlementsPanel = ({ plan }: { plan: PlanDefinition }) => (
  <BillingSection
    id="plans-entitlements-title"
    icon={ListChecks}
    title="Plan entitlements"
    description={`What ${plan.name} includes.`}
  >
    <div className="ent-list">
      {ENTITLEMENT_GROUPS.map(({ id, label, icon: Icon, items }) => (
        <div key={id} className="ent-row">
          <h3>
            <Icon size={15} aria-hidden />
            {label}
          </h3>
          <dl>
            {items.map((item) => {
              const value = getEntitlementValue(plan, item);
              const included = value.state === "included";
              const excluded = value.state === "excluded";
              return (
                <div key={item.key} className={excluded ? "off" : undefined}>
                  <dt>{item.label}</dt>
                  <dd>
                    {item.kind === "allowance" ? (
                      <>
                        <strong>{formatEntitlementValue(value)}</strong>
                        {value.state === "limit" &&
                          value.limit !== "unlimited" &&
                          item.unit && <span>{item.unit}</span>}
                      </>
                    ) : (
                      <span className={`ent-flag ${included ? "on" : "off"}`}>
                        {included ? <Check size={14} /> : <Minus size={14} />}
                        {included ? "Included" : "Not included"}
                      </span>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ))}
    </div>
    <BillingNote>
      Allowances are shown as plan limits. Track consumption in Usage &amp;
      bills. Demo data is illustrative.
    </BillingNote>
  </BillingSection>
);

export default EntitlementsPanel;
