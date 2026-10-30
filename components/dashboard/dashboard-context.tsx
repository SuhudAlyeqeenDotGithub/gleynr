"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { getNavigationHref } from "@/lib/dashboard/constants";
import type { SitesStore } from "@/lib/sites/use-sites-store";
import { useSitesStore } from "@/lib/sites/use-sites-store";
import { useUsersStore } from "@/lib/users/use-users-store";
import type { UsersStore } from "@/lib/users/use-users-store";
import { useSubscriptionStore } from "@/lib/plans/use-subscription-store";
import type { SubscriptionStore } from "@/lib/plans/use-subscription-store";
import { useBillingInfoStore } from "@/lib/billing-info/use-billing-info-store";
import type { BillingInfoStore } from "@/lib/billing-info/use-billing-info-store";

export type DashboardContextValue = {
  store: SitesStore;
  usersStore: UsersStore;
  subscriptionStore: SubscriptionStore;
  billingInfoStore: BillingInfoStore;
  notify: (text: string) => void;
  navigate: (page: string) => void;
};

export const DashboardContext = createContext<DashboardContextValue | null>(
  null,
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const store = useSitesStore();
  const usersStore = useUsersStore();
  const subscriptionStore = useSubscriptionStore();
  const billingInfoStore = useBillingInfoStore();
  const [toast, setToast] = useState("");

  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2500);
  };

  const navigate = (page: string) => {
    const href = getNavigationHref(page);
    if (href) router.push(href);
  };

  return (
    <DashboardContext.Provider
      value={{
        store,
        usersStore,
        subscriptionStore,
        billingInfoStore,
        notify,
        navigate,
      }}
    >
      {children}
      {toast && (
        <div className="toast">
          <Check size={15} /> {toast}
        </div>
      )}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "Dashboard pages must be rendered inside the dashboard layout.",
    );
  }
  return context;
};
