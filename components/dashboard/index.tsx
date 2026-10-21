"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import CommandDialog from "@/components/dashboard/dialogs/command-dialog";
import FormModal from "@/components/dashboard/dialogs/form-modal";
import GenericPage from "@/components/dashboard/pages/generic-page";
import Header from "@/components/dashboard/navigation/header";
import Sidebar from "@/components/dashboard/navigation/sidebar";
import OverviewPage from "@/components/dashboard/overview/overview-page";
import SitesPage from "@/components/dashboard/sites/sites-page";
import UsersPage from "@/components/dashboard/users/users-page";
import CreateSiteDialog from "@/components/dashboard/sites/dialogs/create-site-dialog";
import PurchaseTokensDialog from "@/components/dashboard/sites/dialogs/purchase-tokens-dialog";
import { toDashboardSites } from "@/lib/sites/selectors";
import { useSitesStore } from "@/lib/sites/use-sites-store";
import type { ModalType } from "@/lib/dashboard/types";

const GleynrDashboard = () => {
  const [active, setActive] = useState("Overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [command, setCommand] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [siteDialog, setSiteDialog] = useState<"purchase" | "create" | null>(
    null,
  );
  const [openSiteId, setOpenSiteId] = useState<string | null>(null);
  const store = useSitesStore();
  const [toast, setToast] = useState("");

  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2500);
  };

  const navigate = (page: string) => {
    setActive(page);
    setMobileNavOpen(false);
    if (page === "Sites") setOpenSiteId(null);
  };

  const submit = () => {
    notify("Demo action completed successfully.");
    setModal(null);
  };

  return (
    <div className={`app-shell ${dark ? "dark" : ""}`}>
      <Sidebar
        active={active}
        setActive={navigate}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        dark={dark}
        mobileOpen={mobileNavOpen}
      />
      {mobileNavOpen && <button className="mobile-nav-backdrop" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}
      <main className="main">
        <Header
          active={active}
          dark={dark}
          setDark={setDark}
          onCommand={() => setCommand(true)}
          onToggleNavigation={() => setMobileNavOpen((open) => !open)}
        />
        {active === "Overview" ? (
          <OverviewPage
            sites={toDashboardSites(store.sites)}
            onNavigate={navigate}
            onAddSite={() => {
              navigate("Sites");
              setSiteDialog("create");
            }}
          />
        ) : active === "Sites" ? (
          <SitesPage
            store={store}
            openSiteId={openSiteId}
            onOpenSite={setOpenSiteId}
            onPurchase={() => setSiteDialog("purchase")}
            onCreate={() => setSiteDialog("create")}
            notify={notify}
          />
        ) : active === "Users & permissions" ? (
          <UsersPage sites={store.sites} notify={notify} />
        ) : (
          <GenericPage active={active} onOpenModal={setModal} />
        )}
      </main>
      {command && (
        <CommandDialog
          onClose={() => setCommand(false)}
          onNavigate={navigate}
        />
      )}
      {siteDialog === "purchase" && (
        <PurchaseTokensDialog
          tokens={store.tokens}
          onClose={() => setSiteDialog(null)}
          onConfirm={(quantity) => {
            store.purchaseTokens(quantity);
            notify(
              `${quantity} site ${quantity === 1 ? "token" : "tokens"} added to your balance.`,
            );
          }}
        />
      )}
      {siteDialog === "create" && (
        <CreateSiteDialog
          tokens={store.tokens}
          sites={store.sites}
          onCreate={store.createSite}
          onPurchase={() => setSiteDialog("purchase")}
          onClose={() => setSiteDialog(null)}
          onCreated={(site) => {
            setActive("Sites");
            setOpenSiteId(site.id);
            notify(`${site.name} was created using 1 token.`);
          }}
        />
      )}
      {modal && (
        <FormModal
          type={modal}
          onClose={() => setModal(null)}
          onSubmit={submit}
        />
      )}
      {toast && (
        <div className="toast">
          <Check size={15} /> {toast}
        </div>
      )}
    </div>
  );
};

export default GleynrDashboard;
