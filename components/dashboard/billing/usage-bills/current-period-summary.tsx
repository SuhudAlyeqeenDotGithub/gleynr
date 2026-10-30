import { CalendarRange, CircleDashed } from "lucide-react";
import { formatMoney, formatPeriodRange } from "@/lib/usage-bills/calculations";
import type { BillingPeriod, PeriodBreakdown } from "@/lib/usage-bills/types";
import Receipt from "../shared/receipt";
import BillingStatusLabel from "./billing-status";

type CurrentPeriodSummaryProps = {
  period: BillingPeriod;
  breakdown: PeriodBreakdown;
  total: number | null;
};

const CurrentPeriodSummary = ({
  period,
  breakdown,
  total,
}: CurrentPeriodSummaryProps) => {
  const usage = breakdown.usageTotal ?? 0;
  const sum = period.baseSubscriptionPrice + usage;
  const baseShare = sum > 0 ? (period.baseSubscriptionPrice / sum) * 100 : 100;
  const money = (amount: number) => formatMoney(amount, period.currency);

  return (
    <section className="ub-hero" aria-labelledby="ub-current-title">
      <header className="ub-hero-head">
        <div>
          <span className="ub-eyebrow">Current billing period</span>
          <h2 id="ub-current-title">{period.label}</h2>
          <p>
            <CalendarRange size={14} /> {formatPeriodRange(period)}
          </p>
        </div>
        <div className="ub-hero-badges">
          <BillingStatusLabel status={period.status} />
          <span className="ub-estimate-pill">
            <CircleDashed size={13} /> Estimates, not final
          </span>
        </div>
      </header>

      <div className="ub-hero-body">
        <div className="ub-hero-total">
          <span className="ub-eyebrow">Estimated total</span>
          <strong>{money(total ?? 0)}</strong>
          <span className="ub-hero-sub">
            Base subscription plus usage so far
          </span>
          <div
            className="ub-split"
            role="img"
            aria-label={`Base subscription ${Math.round(baseShare)} percent, estimated usage ${Math.round(100 - baseShare)} percent`}
          >
            <span className="base" style={{ width: `${baseShare}%` }} />
            <span className="usage" style={{ width: `${100 - baseShare}%` }} />
          </div>
          <div className="ub-legend">
            <span>
              <i className="base" /> Base subscription
            </span>
            <span>
              <i className="usage" /> Estimated usage
            </span>
          </div>
        </div>

        <Receipt
          lines={[
            {
              label: "Base subscription price",
              hint: `${period.planName} · fixed monthly`,
              amount: money(period.baseSubscriptionPrice),
            },
            {
              label: "Estimated usage charges",
              hint: "Usage accumulated so far",
              tag: "Estimate",
              amount: money(usage),
              muted: true,
            },
          ]}
          total={{
            label: "Estimated total",
            amount: money(total ?? 0),
            muted: true,
          }}
        />
      </div>

      <p className="ub-hero-note">
        These figures are estimates based on usage so far and may change before
        the billing period closes. Your final bill is the base subscription
        price plus final usage charges.
      </p>
    </section>
  );
};

export default CurrentPeriodSummary;
