"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import FormModal from "@/components/dashboard/dialogs/form-modal";
import GenericPage from "@/components/dashboard/pages/generic-page";
import OverviewPage from "@/components/dashboard/overview/overview-page";
import UsersPage from "@/components/dashboard/users/users-page";
import PlansPage from "@/components/dashboard/billing/plans/plans-page";
import UsageBillsPage from "@/components/dashboard/billing/usage-bills/usage-bills-page";
import InvoicesPage from "@/components/dashboard/billing/invoices/invoices-page";
import BillingInfoPage from "@/components/dashboard/billing/billing-info/billing-info-page";
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
  const { store, usersStore, subscriptionStore, billingInfoStore, notify } =
    useDashboardContext();
  const [modal, setModal] = useState<ModalType>(null);

  if (label === "Users & permissions") {
    return (
      <UsersPage sites={store.sites} userStore={usersStore} notify={notify} />
    );
  }

  if (label === "Plans & subscription") {
    return (
      <Suspense fallback={null}>
        <PlansPage subscriptionStore={subscriptionStore} notify={notify} />
      </Suspense>
    );
  }

  if (label === "Usage & bills") {
    return (
      <Suspense fallback={null}>
        <UsageBillsPage />
      </Suspense>
    );
  }

  if (label === "Invoices") return <InvoicesPage notify={notify} />;

  if (label === "Billing information")
    return <BillingInfoPage store={billingInfoStore} notify={notify} />;

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
