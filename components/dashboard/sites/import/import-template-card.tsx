import { Download, Wand2 } from "lucide-react";
import { IMPORT_LEVELS } from "@/lib/sites/constants";
import { downloadText } from "@/lib/sites/import/templates";
import type { ImportFormat, ImportLevel, SiteRecord } from "@/lib/sites/types";

type ImportTemplateCardProps = {
  site: SiteRecord;
  level: ImportLevel;
  format: ImportFormat;
  template: string;
  onUseSample: () => void;
};

const ImportTemplateCard = ({
  site,
  level,
  format,
  template,
  onUseSample,
}: ImportTemplateCardProps) => {
  const spec = IMPORT_LEVELS.find((item) => item.value === level)!;

  return (
    <div className="template-card">
      <div className="template-head">
        <div>
          <strong>Sample template</strong>
          <p>
            Required:{" "}
            {spec.required.map((field) => (
              <code key={field}>{field}</code>
            ))}
            {spec.optional.length > 0 && (
              <>
                {" "}
                Optional:{" "}
                {spec.optional.map((field) => (
                  <code key={field}>{field}</code>
                ))}
              </>
            )}
          </p>
        </div>
        <div className="template-actions">
          <button
            className="button secondary"
            onClick={() =>
              downloadText(
                `gleynr-${level}-template.${format}`,
                template,
                format,
              )
            }
          >
            <Download size={14} /> Download
          </button>
          <button className="button secondary" onClick={onUseSample}>
            <Wand2 size={14} /> Use sample
          </button>
        </div>
      </div>
      <pre className="code-block" tabIndex={0}>
        {template}
      </pre>
      <details className="id-reference">
        <summary>Floor and area IDs for this site</summary>
        <ul>
          {site.floors.map((floor) => (
            <li key={floor.id}>
              <strong>
                {floor.name} <code>{floor.id}</code>
              </strong>
              <span>
                {floor.areas.map((area) => (
                  <span key={area.id}>
                    {area.name} <code>{area.id}</code>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
};

export default ImportTemplateCard;
