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
import { SEEDED_SITES } from "@/lib/dashboard/constants";
import type { ModalType, Site } from "@/lib/dashboard/types";

const GleynrDashboard = () => {
  const [active, setActive] = useState("Overview");
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [command, setCommand] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [sites, setSites] = useState<Site[]>(SEEDED_SITES);
  const [toast, setToast] = useState("");

  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2500);
  };

  const submit = (value: string) => {
    if (modal === "site") {
      setSites([
        ...sites,
        {
          id: Date.now(),
          name: value,
          location: "New location",
          status: "Active",
          visits: 0,
          floors: 1,
        },
      ]);
    }
    notify(
      modal === "site"
        ? `${value} was added to your sites.`
        : "Demo action completed successfully.",
    );
    setModal(null);
  };

  return (
    <div className={`app-shell ${dark ? "dark" : ""}`}>
      <Sidebar
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        dark={dark}
      />
      <main className="main">
        <Header
          active={active}
          dark={dark}
          setDark={setDark}
          onCommand={() => setCommand(true)}
        />
        {active === "Overview" ? (
          <OverviewPage
            sites={sites}
            onNavigate={setActive}
            onAddSite={() => setModal("site")}
          />
        ) : active === "Sites" ? (
          <SitesPage sites={sites} setSites={setSites} onOpenModal={setModal} />
        ) : (
          <GenericPage active={active} onOpenModal={setModal} />
        )}
      </main>
      {command && (
        <CommandDialog
          onClose={() => setCommand(false)}
          onNavigate={setActive}
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
