"use client";

import { useState } from "react";
import ModalShell from "@/components/dashboard/dialogs/modal-shell";
import FormField from "@/components/dashboard/shared/form-field";
import type { BillingDetails } from "@/lib/billing-info/types";
import { COUNTRIES, validateDetails } from "@/lib/billing-info/validation";
import type { DetailsField } from "@/lib/billing-info/validation";
import type { FieldErrors } from "@/lib/billing-info/types";

type BillingDetailsDialogProps = {
  details: BillingDetails;
  onSave: (details: BillingDetails) => void;
  onClose: () => void;
};

const BillingDetailsDialog = ({
  details,
  onSave,
  onClose,
}: BillingDetailsDialogProps) => {
  const [values, setValues] = useState<BillingDetails>(details);
  const [errors, setErrors] = useState<FieldErrors<DetailsField>>({});

  const set = (field: DetailsField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const countries = COUNTRIES.includes(values.country)
    ? COUNTRIES
    : [values.country, ...COUNTRIES];

  const submit = () => {
    const found = validateDetails(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave(values);
    onClose();
  };

  const text = (field: DetailsField, props: { type?: string } = {}) => (
    <input
      type={props.type ?? "text"}
      value={values[field] ?? ""}
      onChange={(event) => set(field, event.target.value)}
    />
  );

  return (
    <ModalShell title="Edit billing details" onClose={onClose} wide>
      <form
        className="form-stack"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        noValidate
      >
        <div className="bi-form-grid">
          <FormField label="Company name" error={errors.organisationName}>
            {text("organisationName")}
          </FormField>
          <FormField label="VAT number (optional)" error={errors.vatNumber}>
            {text("vatNumber")}
          </FormField>
          <FormField label="Billing contact name" error={errors.contactName}>
            {text("contactName")}
          </FormField>
          <FormField label="Billing email" error={errors.email}>
            {text("email", { type: "email" })}
          </FormField>
          <FormField label="Billing phone" error={errors.phone}>
            {text("phone", { type: "tel" })}
          </FormField>
          <FormField label="Country" error={errors.country}>
            <select
              value={values.country}
              onChange={(event) => set("country", event.target.value)}
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </FormField>
          <div className="bi-span">
            <FormField label="Address" error={errors.address}>
              {text("address")}
            </FormField>
          </div>
          <FormField label="Town / city" error={errors.city}>
            {text("city")}
          </FormField>
          <FormField label="Postcode" error={errors.postalCode}>
            {text("postalCode")}
          </FormField>
        </div>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button primary">
            Save changes
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default BillingDetailsDialog;
