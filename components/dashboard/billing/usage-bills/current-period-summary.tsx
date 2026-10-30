import { formatMoney, formatPeriodRange } from "@/lib/usage-bills/calculations";
import type { BillingPeriod, PeriodBreakdown } from "@/lib/usage-bills/types";

type CurrentPeriodSummaryProps = {
  period: BillingPeriod;
  breakdown: PeriodBreakdown;
  total: number | null;
};

const CurrentPeriodSummary = ({
  period,
  breakdown,
  total,
}: CurrentPeriodSummaryProps) => (
  <section className="panel ub-section" aria-labelledby="ub-current-title">
    <header className="ub-section-head">
      <div>
        <h2 id="ub-current-title">Current billing period</h2>
        <p>
          {period.label} &middot; {formatPeriodRange(period)}
        </p>
      </div>
    </header>
    <div className="ub-equation">
      <div>
        <span className="ub-figure-label">Base subscription price</span>
        <strong>{formatMoney(period.baseSubscriptionPrice, period.currency)}</strong>
        <small>{period.planName} &middot; fixed monthly</small>
      </div>
      <span className="ub-operator" aria-hidden>
        +
      </span>
      <div>
        <span className="ub-figure-label">
          Estimated usage charges <em className="ub-tag">Estimate</em>
        </span>
        <strong className="estimate">
          {formatMoney(breakdown.usageTotal ?? 0, period.currency)}
        </strong>
        <small>Usage accumulated so far</small>
      </div>
      <span className="ub-operator" aria-hidden>
        =
      </span>
      <div>
        <span className="ub-figure-label">
          Estimated total <em className="ub-tag">Estimate</em>
        </span>
        <strong className="estimate total">
          {formatMoney(total ?? 0, period.currency)}
        </strong>
        <small>Not a final charge</small>
      </div>
    </div>
    <p className="ub-note">
      These figures are estimates based on usage so far and may change before
      the billing period closes. Your final bill is the base subscription price
      plus final usage charges.
    </p>
  </section>
);

export default CurrentPeriodSummary;
