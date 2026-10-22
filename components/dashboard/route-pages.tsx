"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormModal from "@/components/dashboard/dialogs/form-modal";
import GenericPage from "@/components/dashboard/pages/generic-page";
import OverviewPage from "@/components/dashboard/overview/overview-page";
import UsersPage from "@/components/dashboard/users/users-page";
import type { ModalType } from "@/lib/dashboard/types";
import { toDashboardSites } from "@/lib/sites/selectors";
import { useDashboardContext } from "./dashboard-context";

export const OverviewRoute = () => {
  const router = useRouter();
  const { store, navigate } = useDashboardContext();

  return (
    <OverviewPage
      sites={toDashboardSites(store.sites)}
      onNavigate={navigate}
      onAddSite={() => router.push("/main/sites?dialog=create")}
    />
  );
};

export const SectionRoute = ({ label }: { label: string }) => {
  const { store, notify } = useDashboardContext();
  const [modal, setModal] = useState<ModalType>(null);

  if (label === "Users & permissions") {
    return <UsersPage sites={store.sites} notify={notify} />;
  }

  return (
    <>
      <GenericPage active={label} onOpenModal={setModal} />
      {modal && (
        <FormModal
          type={modal}
          onClose={() => setModal(null)}
          onSubmit={() => {
            notify("Demo action completed successfully.");
            setModal(null);
          }}
        />
      )}
    </>
  );
};