import { useState } from "react";
import { Layers, Plus } from "lucide-react";
import type { Floor } from "@/lib/schemaAndTypes/zod/floor";
import type { SiteRecord } from "@/lib/sites/types";
import type { SitesStore } from "@/lib/sites/use-sites-store";
import { usePaged } from "@/lib/sites/use-paged";
import ConfirmDialog from "../../dialogs/confirm-dialog";
import EmptyState from "../../shared/empty-state";
import EntityTile from "../../shared/entity-tile";
import ListToolbar from "../../shared/list-toolbar";
import FloorDialog from "./floor-dialog";

type FloorsViewProps = {
  site: SiteRecord;
  store: SitesStore;
  notify: (text: string) => void;
  onOpenFloor: (floorId: string) => void;
};

type Dialog =
  | { kind: "form"; floor?: Floor }
  | { kind: "delete"; floor: Floor }
  | null;

const typeSummary = (floor: Floor) => {
  const counts = new Map<string, number>();
  floor.areas.forEach((area) =>
    counts.set(area.type, (counts.get(area.type) ?? 0) + 1),
  );
  return [...counts]
    .slice(0, 3)
    .map(([type, count]) => `${type} ×${count}`)
    .join(" · ");
};

const FloorsView = ({ site, store, notify, onOpenFloor }: FloorsViewProps) => {
  const [query, setQuery] = useState("");
  const [occupancy, setOccupancy] = useState("all");
  const [type, setType] = useState("");
  const [dialog, setDialog] = useState<Dialog>(null);

  const types = [
    ...new Set(
      site.floors.flatMap((floor) => floor.areas.map((area) => area.type)),
    ),
  ].sort();
  const filtered = site.floors.filter(
    (floor) =>
      floor.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (occupancy === "all" ||
        (occupancy === "with") === floor.areas.length > 0) &&
      (!type || floor.areas.some((area) => area.type === type)),
  );
  const { visible, remaining, showMore } = usePaged(
    filtered,
    `${query}|${occupancy}|${type}`,
  );
  const close = () => setDialog(null);

  return (
    <div className="workspace-stack">
      <div className="section-bar">
        <div>
          <h2>Floors</h2>
          <p>Select a floor to manage its areas.</p>
        </div>
        <button
          className="button primary"
          onClick={() => setDialog({ kind: "form" })}
        >
          <Plus size={16} /> Add floor
        </button>
      </div>

      {site.floors.length ? (
        <section className="panel">
          <ListToolbar
            query={query}
            onQuery={setQuery}
            placeholder="Search floors..."
            count={`${filtered.length} of ${site.floors.length} floors`}
          >
            <select
              className="filter-select"
              value={occupancy}
              onChange={(e) => setOccupancy(e.target.value)}
              aria-label="Filter by areas"
            >
              <option value="all">All floors</option>
              <option value="with">With areas</option>
              <option value="empty">No areas</option>
            </select>
            <select
              className="filter-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="Filter by area type"
            >
              <option value="">Any area type</option>
              {types.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </ListToolbar>
          {filtered.length ? (
            <>
              <div className="entity-grid">
                {visible.map((floor) => (
                  <EntityTile
                    key={floor.id}
                    icon={<Layers size={18} />}
                    title={floor.name}
                    meta={`${floor.areas.length} ${floor.areas.length === 1 ? "area" : "areas"}`}
                    footer={
                      floor.areas.length ? typeSummary(floor) : "No areas yet"
                    }
                    onOpen={() => onOpenFloor(floor.id)}
                    onEdit={() => setDialog({ kind: "form", floor })}
                    onDelete={() => setDialog({ kind: "delete", floor })}
                  />
                ))}
              </div>
              {remaining > 0 && (
                <button
                  className="button secondary show-more"
                  onClick={showMore}
                >
                  Show more ({remaining} remaining)
                </button>
              )}
            </>
          ) : (
            <EmptyState text="No floors match your search or filters." />
          )}
        </section>
      ) : (
        <section className="panel feature-page">
          <div className="feature-icon">
            <Layers size={24} />
          </div>
          <h2>No floors yet</h2>
          <p>
            Add a floor, then create the areas within it to start importing
            data.
          </p>
          <button
            className="button primary"
            onClick={() => setDialog({ kind: "form" })}
          >
            <Plus size={16} /> Add floor
          </button>
        </section>
      )}

      {dialog?.kind === "form" && (
        <FloorDialog
          floor={dialog.floor}
          onClose={close}
          onSubmit={(name) => {
            if (dialog.floor) store.updateFloor(site.id, dialog.floor.id, name);
            else store.addFloor(site.id, name);
            notify(dialog.floor ? "Floor updated." : "Floor added.");
          }}
        />
      )}
      {dialog?.kind === "delete" && (
        <ConfirmDialog
          title="Delete floor"
          message={`Delete "${dialog.floor.name}" and its ${dialog.floor.areas.length} areas? Data recorded for these areas will also be removed.`}
          confirmLabel="Delete floor"
          onClose={close}
          onConfirm={() => {
            store.deleteFloor(site.id, dialog.floor.id);
            notify("Floor deleted.");
          }}
        />
      )}
    </div>
  );
};

export default FloorsView;
