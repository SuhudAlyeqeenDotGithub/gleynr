"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatMoney } from "@/lib/usage-bills/calculations";
import type { PeriodBreakdown } from "@/lib/usage-bills/types";

type UsageBreakdownProps = {
  breakdown: PeriodBreakdown;
  currency: string;
  // Unique per instance so ids stay valid when the breakdown is rendered twice.
  idPrefix: string;
  defaultExpanded?: boolean;
};

const BASIS_LABEL = {
  estimate: "Estimated cost",
  final: "Final cost",
  pending: "Cost",
} as const;

const UsageBreakdown = ({
  breakdown,
  currency,
  idPrefix,
  defaultExpanded,
}: UsageBreakdownProps) => {
  const [open, setOpen] = useState<Record<string, boolean>>(
    defaultExpanded ? { database: true, backend: true } : { database: true },
  );
  const money = (amount: number | null) =>
    amount === null ? "Pending" : formatMoney(amount, currency);
  const isEstimate = breakdown.basis === "estimate";

  return (
    <div className="ub-breakdown">
      {breakdown.groups.map((group) => {
        const expanded = !!open[group.id];
        const panelId = `${idPrefix}-${group.id}`;
        return (
          <div key={group.id} className="ub-group">
            <button
              className="ub-group-toggle"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() =>
                setOpen((state) => ({ ...state, [group.id]: !expanded }))
              }
            >
              <ChevronDown size={15} className={expanded ? "open" : ""} />
              <span className="ub-group-name">{group.label}</span>
              <span className={`ub-group-subtotal ${isEstimate ? "estimate" : ""}`}>
                {money(group.subtotal)}
              </span>
            </button>
            {expanded && (
              <table id={panelId} className="ub-metrics">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Usage</th>
                    <th scope="col">{BASIS_LABEL[breakdown.basis]}</th>
                  </tr>
                </thead>
                <tbody>
                  {group.lines.map((line) => (
                    <tr key={line.key}>
                      <th scope="row">{line.label}</th>
                      <td>{line.quantity}</td>
                      <td className={isEstimate ? "estimate" : undefined}>
                        {money(line.cost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
      <div className="ub-total-row">
        <span>
          {isEstimate ? "Total estimated usage cost" : "Total usage charges"}
        </span>
        <strong className={isEstimate ? "estimate" : undefined}>
          {money(breakdown.usageTotal)}
        </strong>
      </div>
    </div>
  );
};

export default UsageBreakdown;
