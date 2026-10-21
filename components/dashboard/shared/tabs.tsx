import type { LucideIcon } from "lucide-react";

export type TabItem<T extends string> = {
  value: T;
  label: string;
  icon: LucideIcon;
};

type TabsProps<T extends string> = {
  tabs: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
};

const Tabs = <T extends string>({
  tabs,
  value,
  onChange,
  label,
}: TabsProps<T>) => (
  <div className="tabs" role="tablist" aria-label={label}>
    {tabs.map(({ value: tab, label: text, icon: Icon }) => (
      <button
        key={tab}
        role="tab"
        aria-selected={tab === value}
        className={`tab ${tab === value ? "active" : ""}`}
        onClick={() => onChange(tab)}
      >
        <Icon size={15} /> {text}
      </button>
    ))}
  </div>
);

export default Tabs;
