import { Check, Minus } from "lucide-react";
import { ENTITLEMENT_GROUPS } from "@/lib/plans/catalog";
import { MOCK_PLANS } from "@/lib/plans/mock/plans";
import {
  formatEntitlementValue,
  getEntitlementValue,
} from "@/lib/plans/selectors";

const PlanComparison = ({ currentPlan }: { currentPlan: string }) => (
  <div className="cmp-wrap" tabIndex={0} aria-label="Full plan comparison">
    <table className="cmp">
      <thead>
        <tr>
          <th scope="col">Entitlement</th>
          {MOCK_PLANS.map((plan) => (
            <th
              key={plan.id}
              scope="col"
              className={plan.name === currentPlan ? "current" : undefined}
            >
              {plan.name}
              {plan.name === currentPlan && <small>Current</small>}
            </th>
          ))}
        </tr>
      </thead>
      {ENTITLEMENT_GROUPS.map(({ id, label, items }) => (
        <tbody key={id}>
          <tr className="group">
            <th colSpan={MOCK_PLANS.length + 1} scope="colgroup">
              {label}
            </th>
          </tr>
          {items.map((item) => (
            <tr key={item.key}>
              <th scope="row">{item.label}</th>
              {MOCK_PLANS.map((plan) => {
                const value = getEntitlementValue(plan, item);
                return (
                  <td
                    key={plan.id}
                    className={
                      plan.name === currentPlan ? "current" : undefined
                    }
                  >
                    {value.state === "included" && (
                      <span className="ent-check on" aria-label="Included">
                        <Check size={12} />
                      </span>
                    )}
                    {value.state === "excluded" && (
                      <span className="ent-check off" aria-label="Not included">
                        <Minus size={12} />
                      </span>
                    )}
                    {(value.state === "limit" || value.state === "tbc") && (
                      <span>
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
