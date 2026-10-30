"use client";

import { useMemo, useState } from "react";
import { Gauge } from "lucide-react";
import { createMockBillingPeriods } from "@/lib/usage-bills/mock/periods";
import { buildBreakdown, getPeriodTotal } from "@/lib/usage-bills/calculations";
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

  const select = (id: string) => setSelectedId(id);

  return (
    <div className="page-content ub-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow">
            <Gauge size={14} /> Billing
          </div>
          <h1>Usage &amp; bills</h1>
          <p>
            Monitor current usage, understand estimated costs and review
            previous bills.
          </p>
        </div>
      </div>

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

      <section className="panel ub-section" aria-labelledby="ub-history-title">
        <header className="ub-section-head">
          <div>
            <h2 id="ub-history-title">Previous billing periods</h2>
            <p>
              Finalised bills do not change. Select a period to see its usage
              breakdown.
            </p>
          </div>
        </header>
        <BillingHistoryTable
          periods={periods}
          selectedId={selectedId}
          onSelect={select}
        />
      </section>

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
