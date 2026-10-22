import Link from "next/link";
import { ChevronDown, CircleHelp, Menu, MoreHorizontal } from "lucide-react";
import {
  BILLING_NAVIGATION,
  SETTINGS_NAVIGATION,
  WORKSPACE_NAVIGATION,
} from "@/lib/dashboard/constants";
import type { NavigationItem, StateSetter } from "@/lib/dashboard/types";
import { Logo } from "@/components/general/Logo";

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
      {!collapsed && item.label === "Data imports" && (
        <span className="nav-badge">2</span>
      )}
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
}: SidebarProps) => (
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
      <div className="nav-label">{collapsed ? "Wksp" : "Workspace"}</div>
      {WORKSPACE_NAVIGATION.map((item) => (
        <NavItem
          key={item.label}
          item={item}
          activeHref={activeHref}
          onNavigate={onNavigate}
          collapsed={collapsed}
        />
      ))}
      <div className="nav-label">{collapsed ? "Cfg" : "Configure"}</div>
      {SETTINGS_NAVIGATION.map((item) => (
        <NavItem
          key={item.label}
          item={item}
          activeHref={activeHref}
          onNavigate={onNavigate}
          collapsed={collapsed}
        />
      ))}
      <div className="nav-label">{collapsed ? "Bill" : "Billing"}</div>
      {BILLING_NAVIGATION.map((item) => (
        <NavItem
          key={item.label}
          item={item}
          activeHref={activeHref}
          onNavigate={onNavigate}
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
