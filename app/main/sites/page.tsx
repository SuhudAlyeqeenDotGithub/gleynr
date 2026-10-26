"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateSiteDialog from "@/components/dashboard/sites/dialogs/create-site-dialog";
import PurchaseTokensDialog from "@/components/dashboard/sites/dialogs/purchase-tokens-dialog";
import SitesPage from "@/components/dashboard/sites/sites-page";
import { useDashboardContext } from "@/components/dashboard/dashboard-context";

const SitesRoute = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { store, notify } = useDashboardContext();
  const [siteDialog, setSiteDialog] = useState<"purchase" | "create" | null>(
    null,
  );
  const [openSiteId, setOpenSiteId] = useState<string | null>(null);
  const openCreateDialog = searchParams.get("dialog") === "create";

  useEffect(() => {
    if (!openCreateDialog) return;
    setSiteDialog("create");
    router.replace("/main/sites", { scroll: false });
  }, [openCreateDialog, router]);

  return (
    <>
      <SitesPage
        store={store}
        openSiteId={openSiteId}
        onOpenSite={setOpenSiteId}
        onPurchase={() => setSiteDialog("purchase")}
        onCreate={() => setSiteDialog("create")}
        notify={notify}
      />
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
            setOpenSiteId(site.id);
            notify(`${site.name} was created using 1 token.`);
          }}
        />
      )}
    </>
  );
};

const Page = () => (
  <Suspense fallback={null}>
    <SitesRoute />
  </Suspense>
);

export default Page;
