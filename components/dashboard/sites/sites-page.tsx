import type { SitesStore } from "@/lib/sites/use-sites-store";
import SitesOverview from "./overview/sites-overview";
import SiteWorkspace from "./workspace/site-workspace";

type SitesPageProps = {
  store: SitesStore;
  openSiteId: string | null;
  onOpenSite: (siteId: string | null) => void;
  onPurchase: () => void;
  onCreate: () => void;
  notify: (text: string) => void;
};

const SitesPage = ({
  store,
  openSiteId,
  onOpenSite,
  onPurchase,
  onCreate,
  notify,
}: SitesPageProps) => {
  const site = store.sites.find((item) => item.id === openSiteId);

  return (
    <div className="page-content">
      {site ? (
        <SiteWorkspace
          key={site.id}
          site={site}
          store={store}
          notify={notify}
          onBack={() => onOpenSite(null)}
        />
      ) : (
        <SitesOverview
          store={store}
          onOpenSite={onOpenSite}
          onPurchase={onPurchase}
          onCreate={onCreate}
        />
      )}
    </div>
  );
};

export default SitesPage;
