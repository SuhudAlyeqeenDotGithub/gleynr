import { useState } from "react";
import { Save } from "lucide-react";
import { siteFormSchema } from "@/lib/schemaAndTypes/zod/site";
import { LOCATION_PRESETS } from "@/lib/sites/constants";
import { validateForm } from "@/lib/sites/forms";
import type { SiteFormErrors, SiteRecord, SiteStatus } from "@/lib/sites/types";
import type { SitesStore } from "@/lib/sites/use-sites-store";
import FormField from "../../shared/form-field";

type SettingsTabProps = {
  site: SiteRecord;
  store: SitesStore;
  notify: (text: string) => void;
};

const SettingsTab = ({ site, store, notify }: SettingsTabProps) => {
  const [name, setName] = useState(site.name);
  const [location, setLocation] = useState(site.location);
  const [status, setStatus] = useState<SiteStatus>(site.status);
  const [errors, setErrors] = useState<SiteFormErrors>({});

  const save = () => {
    const result = validateForm(siteFormSchema, { name, location });
    if (!result.ok) return setErrors(result.errors);
    const duplicate = store.sites.some(
      (item) =>
        item.id !== site.id &&
        item.name.toLowerCase() === result.values.name.toLowerCase(),
    );
    if (duplicate)
      return setErrors({ name: "A site with this name already exists." });
    setErrors({});
    store.updateSite(site.id, { ...result.values, status });
    notify("Site settings saved.");
  };

  return (
    <section className="panel settings-panel">
      <div className="panel-head">
        <div>
          <h2>Site settings</h2>
          <p>Basic details shown across your workspace</p>
        </div>
      </div>
      <form
        className="form-stack settings-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <FormField label="Site name" error={errors.name}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FormField>
        <FormField label="Location" error={errors.location}>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          >
            {LOCATION_PRESETS.map((preset) => (
              <option key={preset.label}>{preset.label}</option>
            ))}
          </select>
        </FormField>
        <FormField
          label="Status"
          hint="Paused sites stay visible but are marked inactive."
        >
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as SiteStatus)}
          >
            <option>Active</option>
            <option>Paused</option>
          </select>
        </FormField>
        <div className="modal-actions">
          <button type="submit" className="button primary">
            <Save size={14} /> Save changes
          </button>
        </div>
      </form>
    </section>
  );
};

export default SettingsTab;
