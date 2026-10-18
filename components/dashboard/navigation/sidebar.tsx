import { ChevronDown, CircleHelp, Menu, MoreHorizontal } from "lucide-react";
import {
  BILLING_NAVIGATION,
  SETTINGS_NAVIGATION,
  WORKSPACE_NAVIGATION,
} from "@/lib/dashboard/constants";
import type { NavigationItem, StateSetter } from "@/lib/dashboard/types";

type SidebarProps = {
  active: string;
  setActive: StateSetter<string>;
  collapsed: boolean;
  setCollapsed: StateSetter<boolean>;
  dark: boolean;
};

type NavItemProps = {
  item: NavigationItem;
  active: string;
  setActive: StateSetter<string>;
  collapsed: boolean;
};

const Logo = ({
  collapsed = false,
  dark,
}: {
  collapsed?: boolean;
  dark: boolean;
}) => (
  <div className="brand">
    <div
      className={`relative h-10 w-10 shrink-0 overflow-hidden rounded ${
        dark ? "bg-white" : "bg-transparent"
      }`}
    >
      <img
        src="/brand/gleynr-symbol.png"
        alt="Gleynr symbol"
        className="absolute left-0 top-0 h-10 w-auto max-w-none"
      />
    </div>

    {!collapsed && (
      <div className="relative h-10 w-[100px] shrink-0 overflow-hidden">
        <img
          src={`/brand/gleynr-wordmark${!dark ? "-dark" : "-light"}.png`}
          alt="Gleynr wordmark"
          className="absolute left-0 top-0 h-10 w-auto max-w-none"
        />
      </div>
    )}
  </div>
);

const NavItem = ({ item, active, setActive, collapsed }: NavItemProps) => {
  const Icon = item.icon;

  return (
    <button
      className={`nav-item ${active === item.label ? "active" : ""}`}
      onClick={() => setActive(item.label)}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="size-4 shrink-0" />
      <span>{!collapsed && item.label}</span>
      {!collapsed && item.label === "Data imports" && (
        <span className="nav-badge">2</span>
      )}
    </button>
  );
};

const Sidebar = ({
  active,
  setActive,
  collapsed,
  setCollapsed,
  dark,
}: SidebarProps) => (
  <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
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
      <div className="nav-label">{collapsed ? "Wksp" : "Workspace"}</div>
      {WORKSPACE_NAVIGATION.map((item) => (
        <NavItem
          key={item.label}
          item={item}
          active={active}
          setActive={setActive}
          collapsed={collapsed}
        />
      ))}
      <div className="nav-label">{collapsed ? "Cfg" : "Configure"}</div>
      {SETTINGS_NAVIGATION.map((item) => (
        <NavItem
          key={item.label}
          item={item}
          active={active}
          setActive={setActive}
          collapsed={collapsed}
        />
      ))}
      <div className="nav-label">{collapsed ? "Bill" : "Billing"}</div>
      {BILLING_NAVIGATION.map((item) => (
        <NavItem
          key={item.label}
          item={item}
          active={active}
          setActive={setActive}
          collapsed={collapsed}
        />
      ))}
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

export default Sidebar;
