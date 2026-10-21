import { Activity, DoorOpen, Layers, MapPin } from "lucide-react";
import { countAreas, countEvents, formatDate } from "@/lib/sites/selectors";
import type { ImportRecord, SiteRecord } from "@/lib/sites/types";
import SiteStatus from "../../shared/site-status";
import StatTile from "../../shared/stat-tile";
import type { WorkspaceTab } from "./workspace-tabs";

type SiteOverviewTabProps = {
  site: SiteRecord;
  imports: ImportRecord[];
  onNavigate: (tab: WorkspaceTab) => void;
};

const SiteOverviewTab = ({
  site,
  imports,
  onNavigate,
}: SiteOverviewTabProps) => (
  <div className="workspace-stack">
    <div className="metrics-grid">
      <StatTile label="Floors" value={site.floors.length} icon={Layers} />
      <StatTile label="Areas" value={countAreas(site)} icon={DoorOpen} />
      <StatTile
        label="Events recorded"
        value={countEvents(site).toLocaleString()}
        icon={Activity}
      />
      <StatTile
        label="Location"
        value={site.location.split(",")[0]}
        note={site.location}
        icon={MapPin}
      />
    </div>
    <div className="two-col">
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Floors at a glance</h2>
            <p>Structure configured for this site</p>
          </div>
          <button
            className="button secondary"
            onClick={() => onNavigate("floors")}
          >
            Manage
          </button>
        </div>
        {site.floors.length ? (
          <ul className="plain-list">
            {site.floors.map((floor) => (
              <li key={floor.id}>
                <strong>{floor.name}</strong>
                <span>{floor.areas.length} areas</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted-copy">
            No floors yet. Add your first floor to start mapping areas.
          </p>
        )}
      </section>
      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Recent imports</h2>
            <p>
              Status <SiteStatus status={site.status} />
            </p>
          </div>
          <button
            className="button secondary"
            onClick={() => onNavigate("import")}
          >
            Import data
          </button>
        </div>
        {imports.length ? (
          <ul className="plain-list">
            {imports.slice(0, 5).map((item) => (
              <li key={item.id}>
                <strong>{item.fileName}</strong>
                <span>
                  {item.rows} rows &middot; {item.target} &middot;{" "}
                  {formatDate(item.importedAt)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted-copy">No data imported in this session yet.</p>
        )}
      </section>
    </div>
  </div>
);

export default SiteOverviewTab;
