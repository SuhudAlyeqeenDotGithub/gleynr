import { useState } from "react";
import { areaFormSchema } from "@/lib/schemaAndTypes/zod/area";
import type {
  Area,
  AreaFormValues,
  GenderGroup,
} from "@/lib/schemaAndTypes/zod/area";
import { AREA_TYPES, GENDER_GROUPS } from "@/lib/sites/constants";
import { validateForm } from "@/lib/sites/forms";
import type { FieldErrors } from "@/lib/sites/forms";
import ModalShell from "../../dialogs/modal-shell";
import FormField from "../../shared/form-field";

type AreaDialogProps = {
  area?: Area;
  onSubmit: (values: AreaFormValues) => void;
  onClose: () => void;
};

const AreaDialog = ({ area, onSubmit, onClose }: AreaDialogProps) => {
  const [name, setName] = useState(area?.name ?? "");
  const [type, setType] = useState(area?.type ?? "");
  const [genderGroup, setGenderGroup] = useState<GenderGroup>(
    area?.genderGroup ?? "Unisex",
  );
  const [errors, setErrors] = useState<FieldErrors<AreaFormValues>>({});
  // Keep a type that is no longer in the preset list selectable when editing.
  const typeOptions =
    type && !AREA_TYPES.includes(type) ? [...AREA_TYPES, type] : AREA_TYPES;

  const submit = () => {
    const result = validateForm(areaFormSchema, { name, type, genderGroup });
    if (!result.ok) return setErrors(result.errors);
    onSubmit(result.values);
    onClose();
  };

  return (
    <ModalShell title={area ? "Edit area" : "Add an area"} onClose={onClose}>
      <form
        className="form-stack"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <FormField label="Area name" error={errors.name}>
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Ladies washroom"
          />
        </FormField>
        <FormField label="Area type" error={errors.type}>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="">Select a type</option>
            {typeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Gender group" error={errors.genderGroup}>
          <select
            value={genderGroup}
            onChange={(event) =>
              setGenderGroup(event.target.value as GenderGroup)
            }
          >
            {GENDER_GROUPS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </FormField>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button primary">
            {area ? "Save area" : "Add area"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default AreaDialog;
