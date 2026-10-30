import type { BillingPeriod, PeriodBreakdown } from "@/lib/usage-bills/types";
import UsageBreakdown from "./usage-breakdown";

type CurrentUsageProps = {
  period: BillingPeriod;
  breakdown: PeriodBreakdown;
};

const CurrentUsage = ({ period, breakdown }: CurrentUsageProps) => (
  <section className="panel ub-section" aria-labelledby="ub-usage-title">
    <header className="ub-section-head">
      <div>
        <h2 id="ub-usage-title">
          Current usage <em className="ub-tag">Estimate</em>
        </h2>
        <p>
          Accumulated so far this billing period. Costs are estimates and may
          change before the period is finalised.
        </p>
      </div>
    </header>
    <UsageBreakdown
      breakdown={breakdown}
      currency={period.currency}
      idPrefix="ub-current"
    />
  </section>
);

export default CurrentUsage;
