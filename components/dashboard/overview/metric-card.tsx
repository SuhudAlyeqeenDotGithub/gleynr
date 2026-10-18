import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string | number;
  delta: string;
  positive?: boolean;
  icon: LucideIcon;
};

const MetricCard = ({
  label,
  value,
  delta,
  positive = true,
  icon: Icon,
}: MetricCardProps) => (
  <div className="metric-card">
    <div className="metric-head">
      <span>{label}</span>
      <div className="metric-icon">
        <Icon size={16} />
      </div>
    </div>
    <div className="metric-value">{value}</div>
    <div className={`metric-delta ${positive ? "positive" : "negative"}`}>
      {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{" "}
      {delta}
      <span>vs last month</span>
    </div>
  </div>
);

export default MetricCard;
