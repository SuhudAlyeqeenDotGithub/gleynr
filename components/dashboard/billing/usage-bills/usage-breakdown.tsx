"use client";

import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronDown,
  Database,
  HardDrive,
  Server,
  Sigma,
  Timer,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

const GROUP_ICONS: Record<string, LucideIcon> = {
  database: Database,
  backend: Server,
};

const METRIC_ICONS: Record<string, LucideIcon> = {
  "database.operations": Zap,
  "database.aggregations": Sigma,
  "database.storageBytes": HardDrive,
  "database.requestBytes": ArrowUpFromLine,
  "database.responseBytes": ArrowDownToLine,
  "backend.requestDuration": Timer,
  "backend.requestBytes": ArrowUpFromLine,
  "backend.responseBytes": ArrowDownToLine,
};

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
  const total = breakdown.usageTotal;
  const share = (amount: number | null) =>
    total && amount !== null ? (amount / total) * 100 : null;

  return (
    <div className={`ub-breakdown ${isEstimate ? "is-estimate" : ""}`}>
      {total !== null && total > 0 && (
        <div className="ub-share">
          <div
            className="ub-share-bar"
            role="img"
            aria-label="Share of usage cost by group"
          >
            {breakdown.groups.map((group) => (
              <span
                key={group.id}
                className={group.id}
                style={{ width: `${share(group.subtotal) ?? 0}%` }}
              />
            ))}
          </div>
          <div className="ub-legend">
            {breakdown.groups.map((group) => (
              <span key={group.id}>
                <i className={group.id} /> {group.label}{" "}
                {Math.round(share(group.subtotal) ?? 0)}%
              </span>
            ))}
          </div>
        </div>
      )}

      {breakdown.groups.map((group) => {
        const expanded = !!open[group.id];
        const panelId = `${idPrefix}-${group.id}`;
        const GroupIcon = GROUP_ICONS[group.id];
        const maxCost = Math.max(...group.lines.map((line) => line.cost ?? 0));
        return (
          <div key={group.id} className={`ub-group ${expanded ? "open" : ""}`}>
            <button
              className="ub-group-toggle"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() =>
                setOpen((state) => ({ ...state, [group.id]: !expanded }))
              }
            >
              <span className={`ub-group-icon ${group.id}`}>
                <GroupIcon size={16} />
              </span>
              <span className="ub-group-name">
                {group.label}
                <small>{group.lines.length} metrics</small>
              </span>
              <span className="ub-group-subtotal">
                <strong>{money(group.subtotal)}</strong>
                {share(group.subtotal) !== null && (
                  <small>
                    {Math.round(share(group.subtotal) ?? 0)}% of usage
                  </small>
                )}
              </span>
              <ChevronDown size={16} className="chev" />
            </button>
            {expanded && (
              <div
                id={panelId}
                className="ub-metrics"
                role="table"
                aria-label={`${group.label} usage`}
              >
                <div className="ub-metrics-head" role="row">
                  <span role="columnheader">Metric</span>
                  <span role="columnheader">Usage</span>
                  <span role="columnheader">
                    {BASIS_LABEL[breakdown.basis]}
                  </span>
                </div>
                {group.lines.map((line) => {
                  const Icon = METRIC_ICONS[line.key] ?? Zap;
                  const width =
                    line.cost !== null && maxCost > 0
                      ? Math.max(4, (line.cost / maxCost) * 100)
                      : 0;
                  return (
                    <div key={line.key} className="ub-metric" role="row">
                      <span className="ub-metric-name" role="rowheader">
                        <Icon size={14} /> {line.label}
                      </span>
                      <span className="ub-metric-qty" role="cell">
                        {line.quantity}
                      </span>
                      <span className="ub-metric-cost" role="cell">
                        <span className="ub-cost-bar" aria-hidden>
                          <i
                            className={group.id}
                            style={{ width: `${width}%` }}
                          />
                        </span>
                        <strong>{money(line.cost)}</strong>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <div className="ub-total-row">
        <span>
          {isEstimate ? "Total estimated usage cost" : "Total usage charges"}
        </span>
        <strong>{money(breakdown.usageTotal)}</strong>
      </div>
    </div>
  );
};

export default UsageBreakdown;
