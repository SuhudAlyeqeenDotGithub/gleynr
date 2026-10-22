import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronsUpDown,
  CircleHelp,
  Menu,
  MoreHorizontal,
} from "lucide-react";
import {
  BILLING_NAVIGATION,
  SETTINGS_NAVIGATION,
  WORKSPACE_NAVIGATION,
} from "@/lib/dashboard/constants";
import type { NavigationItem, StateSetter } from "@/lib/dashboard/types";
import { Logo } from "@/components/general/Logo";

const NAVIGATION_GROUPS = [
  { id: "workspace", label: "Workspace", shortLabel: "Wksp", items: WORKSPACE_NAVIGATION },
  { id: "configure", label: "Configure", shortLabel: "Cfg", items: SETTINGS_NAVIGATION },
  { id: "billing", label: "Billing", shortLabel: "Bill", items: BILLING_NAVIGATION },
] as const;

type NavigationGroupId = (typeof NAVIGATION_GROUPS)[number]["id"];

type SidebarProps = {
  activeHref: string;
  onNavigate: (href: string) => void;
  collapsed: boolean;
  setCollapsed: StateSetter<boolean>;
  dark: boolean;
  mobileOpen: boolean;
};

type NavItemProps = {
  item: NavigationItem;
  activeHref: string;
  onNavigate: (href: string) => void;
  collapsed: boolean;
};

const NavItem = ({ item, activeHref, onNavigate, collapsed }: NavItemProps) => {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`nav-item ${activeHref === item.href ? "active" : ""}`}
      onClick={() => onNavigate(item.href)}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="size-4 shrink-0" />
      <span>{!collapsed && item.label}</span>
      {/* {!collapsed && item.label === "Data imports" && (
        <span className="nav-badge">2</span>
      )} */}
    </Link>
  );
};

const Sidebar = ({
  activeHref,
  onNavigate,
  collapsed,
  setCollapsed,
  dark,
  mobileOpen,
}: SidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<NavigationGroupId, boolean>>({
    workspace: true,
    configure: true,
    billing: true,
  });
  const activeGroup =
    NAVIGATION_GROUPS.find((group) => group.items.some((item) => item.href === activeHref))?.id ??
    null;
  const allExpanded = NAVIGATION_GROUPS.every(
    (group) => expandedGroups[group.id] || group.id === activeGroup,
  );

  useEffect(() => {
    if (!activeGroup) return;
    setExpandedGroups((current) =>
      current[activeGroup] ? current : { ...current, [activeGroup]: true },
    );
  }, [activeGroup]);

  const toggleAllGroups = () => {
    const expandAll = !allExpanded;
    setExpandedGroups(
      Object.fromEntries(
        NAVIGATION_GROUPS.map((group) => [
          group.id,
          expandAll || group.id === activeGroup,
        ]),
      ) as Record<NavigationGroupId, boolean>,
    );
  };

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
    >
      <div className="sidebar-top">
        <Logo collapsed={collapsed} dark={dark} />
        <button
          className="icon-button collapse-button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Collapse sidebar"
        >
          <Menu size={18} />
        </button>
      </div>
      {!collapsed && (
        <div className="org-switch">
          <div className="org-avatar">N</div>
          <div>
            <strong>Northstar Group</strong>
            <span>Enterprise workspace</span>
          </div>
          <ChevronDown size={15} />
        </div>
      )}
      <nav className="nav-list" aria-label="Primary navigation">
        <button
          type="button"
          className="nav-groups-toggle"
          onClick={toggleAllGroups}
          aria-label={allExpanded ? "Collapse all navigation groups" : "Expand all navigation groups"}
          title={activeGroup ? "The active section stays expanded" : undefined}
        >
          <ChevronsUpDown size={14} />
          {!collapsed && <span>{allExpanded ? "Collapse all" : "Expand all"}</span>}
        </button>

        {NAVIGATION_GROUPS.map((group) => {
          const isActive = group.id === activeGroup;
          const isExpanded = expandedGroups[group.id] || isActive;
          const linksId = `nav-links-${group.id}`;

          return (
            <div className="nav-section" key={group.id}>
              <button
                type="button"
                className={`nav-group-label ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (isActive) return;
                  setExpandedGroups((current) => ({
                    ...current,
                    [group.id]: !current[group.id],
                  }));
                }}
                aria-expanded={isExpanded}
                aria-controls={linksId}
                aria-disabled={isActive}
                title={collapsed ? group.label : undefined}
              >
                <span>{collapsed ? group.shortLabel : group.label}</span>
                {!collapsed && <ChevronDown size={14} aria-hidden="true" />}
              </button>
              <div id={linksId} className="nav-section-links" hidden={!isExpanded}>
                {group.items.map((item) => (
                  <NavItem
                    key={item.label}
                    item={item}
                    activeHref={activeHref}
                    onNavigate={onNavigate}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        {!collapsed && (
          <div className="help-card">
            <div className="help-icon">
              <CircleHelp size={16} />
            </div>
            <div>
              <strong>Need a hand?</strong>
              <span>Visit our help centre</span>
            </div>
          </div>
        )}
        <button className="profile-row">
          <div className="profile-avatar">AL</div>
          {!collapsed && (
            <div className="profile-copy">
              <strong>Alex Lee</strong>
              <span>Admin</span>
            </div>
          )}
          {!collapsed && <MoreHorizontal size={17} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
