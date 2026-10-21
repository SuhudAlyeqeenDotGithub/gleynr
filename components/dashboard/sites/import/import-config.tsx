import { IMPORT_FORMATS, IMPORT_LEVELS } from "@/lib/sites/constants";
import type {
  ImportContext,
  ImportFormat,
  ImportLevel,
  SiteRecord,
} from "@/lib/sites/types";
import FormField from "../../shared/form-field";

type ImportConfigProps = {
  site: SiteRecord;
  level: ImportLevel;
  format: ImportFormat;
  context: ImportContext;
  onLevel: (level: ImportLevel) => void;
  onFormat: (format: ImportFormat) => void;
  onFloor: (floorId: string) => void;
  onArea: (areaId: string) => void;
};

const ImportConfig = ({
  site,
  level,
  format,
  context,
  onLevel,
  onFormat,
  onFloor,
  onArea,
}: ImportConfigProps) => {
  const floor = site.floors.find((item) => item.id === context.floorId);

  return (
    <div className="import-config">
      <div className="choice-grid" role="radiogroup" aria-label="Import level">
        {IMPORT_LEVELS.map((item) => (
          <button
            key={item.value}
            role="radio"
            aria-checked={level === item.value}
            className={`choice ${level === item.value ? "selected" : ""}`}
            onClick={() => onLevel(item.value)}
          >
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </button>
        ))}
      </div>
      <div className="config-row">
        {level !== "site" && (
          <FormField label="Floor">
            <select
              value={context.floorId ?? ""}
              onChange={(event) => onFloor(event.target.value)}
            >
              {site.floors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </FormField>
        )}
        {level === "area" && (
          <FormField label="Area">
            <select
              value={context.areaId ?? ""}
              onChange={(event) => onArea(event.target.value)}
            >
              {floor?.areas.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </FormField>
        )}
        <div className="format-field">
          <span>File format</span>
          <div className="segmented" role="radiogroup" aria-label="File format">
            {IMPORT_FORMATS.map((item) => (
              <button
                key={item.value}
                role="radio"
                aria-checked={format === item.value}
                className={format === item.value ? "active" : ""}
                onClick={() => onFormat(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportConfig;
