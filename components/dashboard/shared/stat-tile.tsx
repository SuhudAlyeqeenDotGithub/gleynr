import type { LucideIcon } from "lucide-react";

type StatTileProps = {
  label: string;
  value: string | number;
  note?: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning";
};

const StatTile = ({
  label,
  value,
  note,
  icon: Icon,
  tone = "default",
}: StatTileProps) => (
  <div className={`metric-card stat-tile ${tone}`}>
    <div className="metric-head">
      <span>{label}</span>
      <div className="metric-icon">
        <Icon size={16} />
      </div>
    </div>
    <div className="metric-value">{value}</div>
    {note && <div className="stat-note">{note}</div>}
  </div>
);

export default StatTile;
