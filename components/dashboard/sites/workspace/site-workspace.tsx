import { useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import type { SitesStore } from "@/lib/sites/use-sites-store";
import type { SiteRecord } from "@/lib/sites/types";
import SiteStatus from "../../shared/site-status";
import Tabs from "../../shared/tabs";
import FloorsAreasTab from "./floors-areas-tab";
import ImportDataTab from "../import/import-data-tab";
import SettingsTab from "./settings-tab";
import SiteOverviewTab from "./site-overview-tab";
import { WORKSPACE_TABS } from "./workspace-tabs";
import type { WorkspaceTab } from "./workspace-tabs";

type SiteWorkspaceProps = {
  site: SiteRecord;
  store: SitesStore;
  onBack: () => void;
  notify: (text: string) => void;
};

const SiteWorkspace = ({ site, store, onBack, notify }: SiteWorkspaceProps) => {
  const [tab, setTab] = useState<WorkspaceTab>("overview");

  return (
    <>
      <div className="workspace-head">
        <button className="button secondary" onClick={onBack}>
          <ArrowLeft size={15} /> All sites
        </button>
        <div>
          <div className="eyebrow">Site workspace</div>
          <h1>
            {site.name} <SiteStatus status={site.status} />
          </h1>
          <p>
            <MapPin size={13} /> {site.location}
          </p>
        </div>
      </div>
      <Tabs
        label="Site workspace sections"
        tabs={WORKSPACE_TABS}
        value={tab}
        onChange={setTab}
      />
      <div className="workspace-body" role="tabpanel">
        {tab === "overview" && (
          <SiteOverviewTab
            site={site}
            imports={store.imports.filter((item) => item.siteId === site.id)}
            onNavigate={setTab}
          />
        )}
        {tab === "floors" && (
          <FloorsAreasTab site={site} store={store} notify={notify} />
        )}
        {tab === "import" && (
          <ImportDataTab site={site} store={store} notify={notify} />
        )}
        {tab === "settings" && (
          <SettingsTab site={site} store={store} notify={notify} />
        )}
      </div>
    </>
  );
};

export default SiteWorkspace;
