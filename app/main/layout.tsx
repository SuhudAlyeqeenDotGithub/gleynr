"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/dashboard/navigation/header";
import Sidebar from "@/components/dashboard/navigation/sidebar";
import {
  DashboardProvider,
} from "@/components/dashboard/dashboard-context";
import { getNavigationItemByHref } from "@/lib/dashboard/constants";

const GleynrMainLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const activePath = pathname.replace(/\/$/, "") || "/";
  const activeItem = getNavigationItemByHref(activePath);
  const active = activeItem?.label ?? "Overview";

  const onSidebarNavigate = () => {
    setMobileNavOpen(false);
  };

  return (
    <DashboardProvider>
      <div className={`app-shell ${dark ? "dark" : ""}`}>
        <Sidebar
          activeHref={activePath}
          onNavigate={onSidebarNavigate}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          dark={dark}
          mobileOpen={mobileNavOpen}
        />
        {mobileNavOpen && (
          <button
            className="mobile-nav-backdrop"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />
        )}
        <main className="main">
          <Header
            active={active}
            dark={dark}
            setDark={setDark}
            onToggleNavigation={() => setMobileNavOpen((open) => !open)}
          />
          {children}
        </main>
      </div>
    </DashboardProvider>
  );
};

export default GleynrMainLayout;
