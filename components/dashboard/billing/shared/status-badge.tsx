import type { StatusPreset } from "./status-presets";

type StatusBadgeProps = {
  label: string;
  preset?: StatusPreset;
};

const StatusBadge = ({ label, preset }: StatusBadgeProps) => {
  const Icon = preset?.icon;
  return (
    <span className={`bl-badge tone-${preset?.tone ?? "neutral"}`}>
      {Icon && <Icon size={13} aria-hidden />}
      {label}
    </span>
  );
};

export default StatusBadge;
