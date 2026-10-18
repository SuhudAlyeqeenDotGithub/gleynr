import { useState } from "react";
import { Building2 } from "lucide-react";
import type { Site, StateSetter } from "@/lib/dashboard/types";
import PageIntro from "../shared/page-intro";
import SiteDetailPanel from "./site-detail-panel";
import SitesTable from "./sites-table";

type SitesPageProps = {
  sites: Site[];
  setSites: StateSetter<Site[]>;
  onOpenModal: (modal: "site") => void;
};

const SitesPage = ({ sites, setSites, onOpenModal }: SitesPageProps) => {
  const [selected, setSelected] = useState<Site | null>(null);

  return (
    <div className="page-content">
      <PageIntro
        icon={Building2}
        title="Sites"
        sub="Manage your organisation's buildings, floors, and areas."
        action="Add site"
        onAction={() => onOpenModal("site")}
      />
      <SitesTable
        sites={sites}
        onDelete={(siteId) =>
          setSites(sites.filter((site) => site.id !== siteId))
        }
        onView={setSelected}
      />
      {selected && (
        <SiteDetailPanel site={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default SitesPage;
