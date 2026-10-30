import type { KeyboardEvent } from "react";

export type BillingTabItem<T extends string> = { value: T; label: string };

type BillingTabsProps<T extends string> = {
  tabs: BillingTabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  idPrefix: string;
};

export const tabPanelId = (prefix: string, value: string) =>
  `${prefix}-panel-${value}`;

const BillingTabs = <T extends string>({
  tabs,
  value,
  onChange,
  label,
  idPrefix,
}: BillingTabsProps<T>) => {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const index = tabs.findIndex((tab) => tab.value === value);
    const next = tabs[(index + step + tabs.length) % tabs.length];
    onChange(next.value);
    document.getElementById(`${idPrefix}-tab-${next.value}`)?.focus();
  };

  return (
    <div
      className="bl-tabs"
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          id={`${idPrefix}-tab-${tab.value}`}
          role="tab"
          aria-selected={tab.value === value}
          aria-controls={tabPanelId(idPrefix, tab.value)}
          tabIndex={tab.value === value ? 0 : -1}
          className={`bl-tab ${tab.value === value ? "active" : ""}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default BillingTabs;
