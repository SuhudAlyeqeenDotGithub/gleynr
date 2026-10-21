import { useMemo, useState } from "react";
import { Layers } from "lucide-react";
import { IMPORT_LEVELS } from "@/lib/sites/constants";
import { buildTemplate } from "@/lib/sites/import/templates";
import { validateImport } from "@/lib/sites/import/validate-import";
import type {
  ImportContext,
  ImportFormat,
  ImportLevel,
  SiteRecord,
} from "@/lib/sites/types";
import type { SitesStore } from "@/lib/sites/use-sites-store";
import ImportConfig from "./import-config";
import ImportIssues from "./import-issues";
import ImportPreview from "./import-preview";
import ImportTemplateCard from "./import-template-card";
import ImportUpload from "./import-upload";

type ImportDataTabProps = {
  site: SiteRecord;
  store: SitesStore;
  notify: (text: string) => void;
};

type Source = { name: string; text: string; error?: string };

const ImportDataTab = ({ site, store, notify }: ImportDataTabProps) => {
  const firstFloor = site.floors[0];
  const [level, setLevel] = useState<ImportLevel>("site");
  const [format, setFormat] = useState<ImportFormat>("csv");
  const [floorId, setFloorId] = useState<string | undefined>(firstFloor?.id);
  const [areaId, setAreaId] = useState<string | undefined>(
    firstFloor?.areas[0]?.id,
  );
  const [source, setSource] = useState<Source | null>(null);

  // Floors can be deleted elsewhere, so fall back to a floor and area that still exist.
  const floor = site.floors.find((item) => item.id === floorId) ?? firstFloor;
  const area =
    floor?.areas.find((item) => item.id === areaId) ?? floor?.areas[0];
  const context: ImportContext = {
    siteId: site.id,
    floorId: floor?.id,
    areaId: area?.id,
  };
  const template = useMemo(
    () => buildTemplate(level, format, context, site),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [level, format, floor?.id, area?.id, site],
  );

  const outcome = useMemo(() => {
    if (!source) return null;
    if (source.error)
      return {
        ok: false as const,
        issues: [{ row: null, message: source.error }],
      };
    return validateImport({ text: source.text, format, level, context, site });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, format, level, floor?.id, area?.id, site]);

  const target =
    level === "site"
      ? site.name
      : level === "floor"
        ? `${site.name} / ${floor?.name}`
        : `${site.name} / ${floor?.name} / ${area?.name}`;
  const spec = IMPORT_LEVELS.find((item) => item.value === level)!;

  const changeFloor = (id: string) => {
    setFloorId(id);
    setAreaId(site.floors.find((item) => item.id === id)?.areas[0]?.id);
    setSource(null);
  };

  const confirm = () => {
    if (!source || !outcome?.ok) return;
    store.importEvents(site.id, outcome.events, {
      level,
      format,
      fileName: source.name,
      target,
    });
    notify(`${outcome.events.length} events imported into ${target}.`);
    setSource(null);
  };

  if (!firstFloor)
    return (
      <section className="panel feature-page">
        <div className="feature-icon">
          <Layers size={24} />
        </div>
        <h2>Add floors and areas first</h2>
        <p>
          Events are reported against areas. Create at least one floor with an
          area in the Floors &amp; Areas tab to import data.
        </p>
      </section>
    );

  return (
    <div className="workspace-stack">
      <section className="panel import-step">
        <h2>
          <span className="step-badge">1</span> Choose what to import
        </h2>
        <ImportConfig
          site={site}
          level={level}
          format={format}
          context={context}
          onLevel={(value) => {
            setLevel(value);
            setSource(null);
          }}
          onFormat={(value) => {
            setFormat(value);
            setSource(null);
          }}
          onFloor={changeFloor}
          onArea={(id) => {
            setAreaId(id);
            setSource(null);
          }}
        />
        <p className="muted-copy">
          {level === "site"
            ? "Each row names its own floor and area."
            : level === "floor"
              ? `Site and floor come from the selection. Rows must include ${spec.required.slice(2).join(", ")}.`
              : "Site, floor and area come from the selection."}
        </p>
      </section>

      <section className="panel import-step">
        <h2>
          <span className="step-badge">2</span> Get a template and upload
        </h2>
        {level === "area" && !area ? (
          <p className="muted-copy">
            This floor has no areas. Add an area in Floors &amp; Areas, or
            choose another floor.
          </p>
        ) : (
          <>
            <ImportTemplateCard
              site={site}
              level={level}
              format={format}
              template={template}
              onUseSample={() =>
                setSource({ name: `sample-${level}.${format}`, text: template })
              }
            />
            <ImportUpload
              format={format}
              fileName={source?.name}
              onFile={(name, text, error) => setSource({ name, text, error })}
            />
            <p className="muted-copy">
              Row numbers refer to data rows, not counting the CSV header.
            </p>
          </>
        )}
      </section>

      {outcome && (
        <section className="panel import-step">
          <h2>
            <span className="step-badge">3</span> Review and confirm
          </h2>
          {outcome.ok ? (
            <ImportPreview
              site={site}
              events={outcome.events}
              target={target}
              onConfirm={confirm}
              onDiscard={() => setSource(null)}
            />
          ) : (
            <ImportIssues issues={outcome.issues} />
          )}
        </section>
      )}
    </div>
  );
};

export default ImportDataTab;
