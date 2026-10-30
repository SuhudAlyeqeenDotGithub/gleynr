"use client";

import { useMemo, useState } from "react";
import { Gauge, Receipt } from "lucide-react";
import { createMockBillingPeriods } from "@/lib/usage-bills/mock/periods";
import { buildBreakdown, getPeriodTotal } from "@/lib/usage-bills/calculations";
import BillingHeader from "../shared/billing-header";
import BillingSection from "../shared/billing-section";
import BillingTabs, { tabPanelId } from "../shared/billing-tabs";
import type { BillingTabItem } from "../shared/billing-tabs";
import { useBillingTab } from "../shared/use-billing-tab";
import BillingHistoryTable from "./billing-history-table";
import CurrentPeriodSummary from "./current-period-summary";
import CurrentUsage from "./current-usage";
import PeriodDetail from "./period-detail";

type UsageTab = "usage" | "bills";

const TABS: BillingTabItem<UsageTab>[] = [
  { value: "usage", label: "Current usage" },
  { value: "bills", label: "Bill history" },
];
const TAB_VALUES = TABS.map((tab) => tab.value);

const UsageBillsPage = () => {
  const periods = useMemo(createMockBillingPeriods, []);
  const [tab, setTab] = useBillingTab<UsageTab>(TAB_VALUES, "usage");
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
      <BillingTabs
        tabs={TABS}
        value={tab}
        onChange={setTab}
        label="Usage and bills sections"
        idPrefix="usage"
      />

      <div
        className="bl-page"
        role="tabpanel"
        id={tabPanelId("usage", tab)}
        aria-labelledby={`usage-tab-${tab}`}
      >
        {tab === "usage" && current && currentBreakdown && (
          <>
            <CurrentPeriodSummary
              period={current}
              breakdown={currentBreakdown}
              total={getPeriodTotal(current, currentBreakdown)}
            />
            <CurrentUsage period={current} breakdown={currentBreakdown} />
          </>
        )}
        {tab === "bills" && (
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
        )}
      </div>

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
