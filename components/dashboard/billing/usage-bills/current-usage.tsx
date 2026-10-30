import { Activity } from "lucide-react";
import type { BillingPeriod, PeriodBreakdown } from "@/lib/usage-bills/types";
import BillingSection from "../shared/billing-section";
import UsageBreakdown from "./usage-breakdown";

type CurrentUsageProps = {
  period: BillingPeriod;
  breakdown: PeriodBreakdown;
};

const CurrentUsage = ({ period, breakdown }: CurrentUsageProps) => (
  <BillingSection
    id="ub-usage-title"
    icon={Activity}
    title={
      <>
        Current usage <em className="bl-tag">Estimate</em>
      </>
    }
    description="Accumulated so far this billing period. Costs are estimates and may change before the period is finalised."
  >
    <UsageBreakdown
      breakdown={breakdown}
      currency={period.currency}
      idPrefix="ub-current"
    />
  </BillingSection>
);

export default CurrentUsage;
