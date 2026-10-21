import { useState } from "react";
import { Coins } from "lucide-react";
import { siteFormSchema } from "@/lib/schemaAndTypes/zod/site";
import { LOCATION_PRESETS } from "@/lib/sites/constants";
import { validateForm } from "@/lib/sites/forms";
import type { CreateSiteResult } from "@/lib/sites/use-sites-store";
import type {
  SiteFormErrors,
  SiteRecord,
  TokenSummary,
} from "@/lib/sites/types";
import ModalShell from "../../dialogs/modal-shell";
import FormField from "../../shared/form-field";

type CreateSiteDialogProps = {
  tokens: TokenSummary;
  sites: SiteRecord[];
  onCreate: (values: { name: string; location: string }) => CreateSiteResult;
  onCreated: (site: SiteRecord) => void;
  onPurchase: () => void;
  onClose: () => void;
};

const CreateSiteDialog = ({
  tokens,
  sites,
  onCreate,
  onCreated,
  onPurchase,
  onClose,
}: CreateSiteDialogProps) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<SiteFormErrors>({});
  const [formError, setFormError] = useState("");

  if (tokens.available < 1)
    return (
      <ModalShell title="No site tokens available" onClose={onClose}>
        <div className="form-stack">
          <div className="empty-callout">
            <Coins size={22} />
            <strong>
              You&apos;ve used all {tokens.purchased} site tokens.
            </strong>
            <span>
              Each site needs one token. Purchase more to create another site.
            </span>
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="button primary"
              onClick={() => {
                onClose();
                onPurchase();
              }}
            >
              Purchase tokens
            </button>
          </div>
        </div>
      </ModalShell>
    );

  const submit = () => {
    const result = validateForm(siteFormSchema, { name, location });
    if (!result.ok) return setErrors(result.errors);
    const duplicate = sites.some(
      (site) => site.name.toLowerCase() === result.values.name.toLowerCase(),
    );
    if (duplicate)
      return setErrors({ name: "A site with this name already exists." });

    const created = onCreate(result.values);
    if (!created.ok)
      return setFormError("No tokens available. Purchase more to continue.");
    onCreated(created.site);
    onClose();
  };

  return (
    <ModalShell title="Create a site" onClose={onClose}>
      <form
        className="form-stack"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <FormField label="Site name" error={errors.name}>
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. West End office"
          />
        </FormField>
        <FormField label="Location" error={errors.location}>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          >
            <option value="">Select a location</option>
            {LOCATION_PRESETS.map((preset) => (
              <option key={preset.label}>{preset.label}</option>
            ))}
          </select>
        </FormField>
        <div className="token-notice">
          <Coins size={15} />
          <span>
            Creating this site uses <strong>1 token</strong>. You have{" "}
            {tokens.available} available.
          </span>
        </div>
        {formError && <div className="form-error">{formError}</div>}
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button primary">
            Create site
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default CreateSiteDialog;
