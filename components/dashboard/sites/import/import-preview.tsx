import { CheckCircle2 } from "lucide-react";
import type { SiteLevelEvent } from "@/lib/schemaAndTypes/zod/event";
import { IMPORT_PREVIEW_ROWS } from "@/lib/sites/constants";
import type { SiteRecord } from "@/lib/sites/types";

type ImportPreviewProps = {
  site: SiteRecord;
  events: SiteLevelEvent[];
  target: string;
  onConfirm: () => void;
  onDiscard: () => void;
};

const ImportPreview = ({
  site,
  events,
  target,
  onConfirm,
  onDiscard,
}: ImportPreviewProps) => {
  const floorName = (id: string) =>
    site.floors.find((floor) => floor.id === id)?.name ?? id;
  const areaName = (floorId: string, id: string) =>
    site.floors
      .find((floor) => floor.id === floorId)
      ?.areas.find((area) => area.id === id)?.name ?? id;

  return (
    <div className="preview">
      <div className="preview-head">
        <CheckCircle2 size={18} />
        <div>
          <strong>
            {events.length} {events.length === 1 ? "row" : "rows"} validated
          </strong>
          <span>Preview of the normalised records for {target}.</span>
        </div>
      </div>
      <div className="preview-scroll">
        <table className="preview-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Floor</th>
              <th>Area</th>
            </tr>
          </thead>
          <tbody>
            {events.slice(0, IMPORT_PREVIEW_ROWS).map((event, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{event.timestamp.toISOString()}</td>
                <td>{event.type}</td>
                <td>{floorName(event.floorId)}</td>
                <td>{areaName(event.floorId, event.areaId)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {events.length > IMPORT_PREVIEW_ROWS && (
        <p className="muted-copy">
          Showing {IMPORT_PREVIEW_ROWS} of {events.length} rows.
        </p>
      )}
      <div className="confirm-bar">
        <span>
          Confirming adds {events.length} events to <strong>{target}</strong> in
          this session only.
        </span>
        <div className="modal-actions">
          <button className="button secondary" onClick={onDiscard}>
            Discard
          </button>
          <button className="button primary" onClick={onConfirm}>
            Confirm import
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportPreview;
