import { useState } from "react";
import type { SiteRecord } from "@/lib/sites/types";
import type { SitesStore } from "@/lib/sites/use-sites-store";
import AreasView from "./areas-view";
import FloorsView from "./floors-view";

type FloorsAreasTabProps = {
  site: SiteRecord;
  store: SitesStore;
  notify: (text: string) => void;
};

const FloorsAreasTab = ({ site, store, notify }: FloorsAreasTabProps) => {
  const [floorId, setFloorId] = useState<string | null>(null);
  // A floor deleted elsewhere simply falls back to the floor list.
  const floor = site.floors.find((item) => item.id === floorId);

  return floor ? (
    <AreasView
      key={floor.id}
      site={site}
      floor={floor}
      store={store}
      notify={notify}
      onBack={() => setFloorId(null)}
    />
  ) : (
    <FloorsView
      site={site}
      store={store}
      notify={notify}
      onOpenFloor={setFloorId}
    />
  );
};

export default FloorsAreasTab;
