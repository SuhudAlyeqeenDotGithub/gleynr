import { Check, Minus } from "lucide-react";
import { ENTITLEMENT_GROUPS } from "@/lib/plans/catalog";
import { MOCK_PLANS as PLAN_CATALOG } from "@/lib/plans/mock/plans";
import {
  formatEntitlementValue,
  getEntitlementValue,
} from "@/lib/plans/selectors";

const PlanComparison = ({ currentPlan }: { currentPlan: string }) => (
  <div className="plans-compare" tabIndex={0} aria-label="Full plan comparison">
    <table>
      <thead>
        <tr>
          <th scope="col">Entitlement</th>
          {PLAN_CATALOG.map((plan) => (
            <th
              key={plan.id}
              scope="col"
              className={plan.name === currentPlan ? "current" : undefined}
            >
              {plan.name}
            </th>
          ))}
        </tr>
      </thead>
      {ENTITLEMENT_GROUPS.map(({ id, label, items }) => (
        <tbody key={id}>
          <tr className="group">
            <th colSpan={PLAN_CATALOG.length + 1} scope="colgroup">
              {label}
            </th>
          </tr>
          {items.map((item) => (
            <tr key={item.key}>
              <th scope="row">{item.label}</th>
              {PLAN_CATALOG.map((plan) => {
                const value = getEntitlementValue(plan, item);
                return (
                  <td
                    key={plan.id}
                    className={
                      plan.name === currentPlan ? "current" : undefined
                    }
                  >
                    {value.state === "included" && (
                      <Check size={15} aria-label="Included" />
                    )}
                    {value.state === "excluded" && (
                      <Minus size={15} aria-label="Not included" />
                    )}
                    {(value.state === "limit" || value.state === "tbc") && (
                      <span
                        className={value.state === "tbc" ? "tbc" : undefined}
                      >
                        {value.state === "tbc"
                          ? "TBC"
                          : formatEntitlementValue(value)}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  </div>
);

export default PlanComparison;
