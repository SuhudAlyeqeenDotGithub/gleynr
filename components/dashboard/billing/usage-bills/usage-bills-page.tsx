"use client";

import { useMemo, useState } from "react";
import { Gauge, Receipt } from "lucide-react";
import { createMockBillingPeriods } from "@/lib/usage-bills/mock/periods";
import { buildBreakdown, getPeriodTotal } from "@/lib/usage-bills/calculations";
import BillingHeader from "../shared/billing-header";
import BillingSection from "../shared/billing-section";
import BillingHistoryTable from "./billing-history-table";
import CurrentPeriodSummary from "./current-period-summary";
import CurrentUsage from "./current-usage";
import PeriodDetail from "./period-detail";

const UsageBillsPage = () => {
  const periods = useMemo(createMockBillingPeriods, []);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const current = periods.find((period) => period.status === "In Progress");
  const currentBreakdown = useMemo(
    () => (current ? buildBreakdown(current) : null),
    [current],
  );
  const selected = periods.find((period) => period.id === selectedId);

  return (
    <div className="page-content bl-page">
      <BillingHeader
        icon={Gauge}
        title="Usage & bills"
        description="Monitor current usage, understand estimated costs and review previous bills."
      />

      {current && currentBreakdown && (
        <>
          <CurrentPeriodSummary
            period={current}
            breakdown={currentBreakdown}
            total={getPeriodTotal(current, currentBreakdown)}
          />
          <CurrentUsage period={current} breakdown={currentBreakdown} />
        </>
      )}

      <BillingSection
        id="ub-history-title"
        icon={Receipt}
        title="Previous billing periods"
        description="Finalised bills do not change. Select a period to see its usage breakdown."
        flush
      >
        <BillingHistoryTable
          periods={periods}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </BillingSection>

      {selected && (
        <PeriodDetail
          period={selected}
          breakdown={buildBreakdown(selected)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

export default UsageBillsPage;
