import { useState } from "react";
import { floorFormSchema } from "@/lib/schemaAndTypes/zod/floor";
import type { Floor } from "@/lib/schemaAndTypes/zod/floor";
import { validateForm } from "@/lib/sites/forms";
import ModalShell from "../../dialogs/modal-shell";
import FormField from "../../shared/form-field";

type FloorDialogProps = {
  floor?: Floor;
  onSubmit: (name: string) => void;
  onClose: () => void;
};

const FloorDialog = ({ floor, onSubmit, onClose }: FloorDialogProps) => {
  const [name, setName] = useState(floor?.name ?? "");
  const [error, setError] = useState<string>();

  const submit = () => {
    const result = validateForm(floorFormSchema, { name });
    if (!result.ok) return setError(result.errors.name);
    onSubmit(result.values.name);
    onClose();
  };

  return (
    <ModalShell title={floor ? "Edit floor" : "Add a floor"} onClose={onClose}>
      <form
        className="form-stack"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <FormField label="Floor name" error={error}>
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Level 4"
          />
        </FormField>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button primary">
            {floor ? "Save floor" : "Add floor"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default FloorDialog;
