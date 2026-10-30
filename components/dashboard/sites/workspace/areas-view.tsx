import { useState } from "react";
import { ArrowLeft, DoorOpen, Plus } from "lucide-react";
import type { Area } from "@/lib/schemaAndTypes/zod/area";
import type { Floor } from "@/lib/schemaAndTypes/zod/floor";
import { GENDER_GROUPS } from "@/lib/sites/constants";
import type { SiteRecord } from "@/lib/sites/types";
import type { SitesStore } from "@/lib/sites/use-sites-store";
import { useLocalPage } from "@/lib/pagination/use-local-page";
import ConfirmDialog from "../../dialogs/confirm-dialog";
import Breadcrumb from "../../shared/breadcrumb";
import EmptyState from "../../shared/empty-state";
import EntityTile from "../../shared/entity-tile";
import ListToolbar from "../../shared/list-toolbar";
import Pagination from "../../shared/pagination";
import AreaDialog from "./area-dialog";

type AreasViewProps = {
  site: SiteRecord;
  floor: Floor;
  store: SitesStore;
  notify: (text: string) => void;
  onBack: () => void;
};

type Dialog =
  | { kind: "form"; area?: Area }
  | { kind: "delete"; area: Area }
  | null;

const AreasView = ({ site, floor, store, notify, onBack }: AreasViewProps) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [dialog, setDialog] = useState<Dialog>(null);

  const types = [...new Set(floor.areas.map((area) => area.type))].sort();
  const filtered = floor.areas.filter(
    (area) =>
      area.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (!type || area.type === type) &&
      (!gender || area.genderGroup === gender),
  );
  const { rows: visible, pagination } = useLocalPage(
    filtered,
    `${floor.id}|${query}|${type}|${gender}`,
  );
  const close = () => setDialog(null);

  return (
    <div className="workspace-stack">
      <Breadcrumb
        items={[
          { label: site.name },
          { label: "Floors", onClick: onBack },
          { label: floor.name },
        ]}
      />
      <div className="section-bar">
        <div>
          <h2>{floor.name}</h2>
          <p>
            {floor.areas.length} {floor.areas.length === 1 ? "area" : "areas"}{" "}
            on this floor.
          </p>
        </div>
        <div className="intro-actions">
          <button className="button secondary" onClick={onBack}>
            <ArrowLeft size={15} /> All floors
          </button>
          <button
            className="button primary"
            onClick={() => setDialog({ kind: "form" })}
          >
            <Plus size={16} /> Add area
          </button>
        </div>
      </div>

      {floor.areas.length ? (
        <section className="panel">
          <ListToolbar
            query={query}
            onQuery={setQuery}
            placeholder="Search areas..."
            count={`${filtered.length} of ${floor.areas.length} areas`}
          >
            <select
              className="filter-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              aria-label="Filter by type"
            >
              <option value="">All types</option>
              {types.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              className="filter-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              aria-label="Filter by gender group"
            >
              <option value="">All gender groups</option>
              {GENDER_GROUPS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </ListToolbar>
          {filtered.length ? (
            <>
              <div className="entity-grid">
                {visible.map((area) => (
                  <EntityTile
                    key={area.id}
                    icon={<DoorOpen size={18} />}
                    title={area.name}
                    meta={area.type}
                    footer={<b className="tag">{area.genderGroup}</b>}
                    onEdit={() => setDialog({ kind: "form", area })}
                    onDelete={() => setDialog({ kind: "delete", area })}
                  />
                ))}
              </div>
              <Pagination controls={pagination} label="areas" />
            </>
          ) : (
            <EmptyState text="No areas match your search or filters." />
          )}
        </section>
      ) : (
        <section className="panel feature-page">
          <div className="feature-icon">
            <DoorOpen size={24} />
          </div>
          <h2>No areas on {floor.name}</h2>
          <p>
            Add areas such as washrooms or meeting rooms to start importing
            data.
          </p>
          <button
            className="button primary"
            onClick={() => setDialog({ kind: "form" })}
          >
            <Plus size={16} /> Add area
          </button>
        </section>
      )}

      {dialog?.kind === "form" && (
        <AreaDialog
          area={dialog.area}
          onClose={close}
          onSubmit={(values) => {
            if (dialog.area)
              store.updateArea(site.id, floor.id, dialog.area.id, values);
            else store.addArea(site.id, floor.id, values);
            notify(dialog.area ? "Area updated." : "Area added.");
          }}
        />
      )}
      {dialog?.kind === "delete" && (
        <ConfirmDialog
          title="Delete area"
          message={`Delete "${dialog.area.name}"? Data recorded for this area will also be removed.`}
          confirmLabel="Delete area"
          onClose={close}
          onConfirm={() => {
            store.deleteArea(site.id, floor.id, dialog.area.id);
            notify("Area deleted.");
          }}
        />
      )}
    </div>
  );
};

export default AreasView;
