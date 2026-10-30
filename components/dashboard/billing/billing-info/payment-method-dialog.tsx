"use client";

import { useState } from "react";
import ModalShell from "@/components/dashboard/dialogs/modal-shell";
import FormField from "@/components/dashboard/shared/form-field";
import { CARD_BRANDS } from "@/lib/billing-info/types";
import type {
  CardBrand,
  FieldErrors,
  PaymentMethod,
  PaymentMethodInput,
} from "@/lib/billing-info/types";
import { formatExpiry, validateMethod } from "@/lib/billing-info/validation";
import type { MethodField } from "@/lib/billing-info/validation";
import BillingNote from "../shared/billing-note";

type PaymentMethodDialogProps = {
  // Present when editing an existing method.
  method?: PaymentMethod;
  onSave: (input: PaymentMethodInput) => void;
  onClose: () => void;
};

const parseExpiry = (value: string) => {
  const match = /^\s*(\d{1,2})\s*\/\s*(\d{2}|\d{4})\s*$/.exec(value);
  if (!match) return { month: NaN, year: NaN };
  const year = Number(match[2]);
  return { month: Number(match[1]), year: year < 100 ? 2000 + year : year };
};

const PaymentMethodDialog = ({
  method,
  onSave,
  onClose,
}: PaymentMethodDialogProps) => {
  const editing = !!method;
  const [brand, setBrand] = useState<CardBrand>(method?.brand ?? "Visa");
  const [last4, setLast4] = useState(method?.last4 ?? "");
  const [holderName, setHolderName] = useState(method?.holderName ?? "");
  const [expiry, setExpiry] = useState(method ? formatExpiry(method) : "");
  const [makeDefault, setMakeDefault] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<MethodField>>({});

  const clear = (field: MethodField) =>
    setErrors((current) => ({ ...current, [field]: undefined }));

  const submit = () => {
    const { month, year } = parseExpiry(expiry);
    const input = {
      brand,
      last4,
      holderName: holderName.trim(),
      expiryMonth: month,
      expiryYear: year,
    };
    const found = validateMethod(input);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({ ...input, makeDefault });
    onClose();
  };

  return (
    <ModalShell
      title={editing ? "Edit payment method" : "Add payment method"}
      onClose={onClose}
    >
      <form
        className="form-stack"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        noValidate
      >
        <div className="bi-form-grid">
          <FormField label="Card type">
            <select
              value={brand}
              disabled={editing}
              onChange={(event) => setBrand(event.target.value as CardBrand)}
            >
              {CARD_BRANDS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            label="Last four digits"
            error={errors.last4}
            hint={editing ? undefined : "Only the last four digits are kept."}
          >
            <input
              value={last4}
              disabled={editing}
              inputMode="numeric"
              maxLength={4}
              placeholder="0000"
              onChange={(event) => {
                setLast4(event.target.value.replace(/\D/g, ""));
                clear("last4");
              }}
            />
          </FormField>
          <FormField label="Cardholder name" error={errors.holderName}>
            <input
              value={holderName}
              onChange={(event) => {
                setHolderName(event.target.value);
                clear("holderName");
              }}
            />
          </FormField>
          <FormField label="Expiry date" error={errors.expiry}>
            <input
              value={expiry}
              placeholder="MM/YY"
              maxLength={7}
              onChange={(event) => {
                setExpiry(event.target.value);
                clear("expiry");
              }}
            />
          </FormField>
        </div>
        {!method?.isDefault && (
          <label className="bi-check">
            <input
              type="checkbox"
              checked={makeDefault}
              onChange={(event) => setMakeDefault(event.target.checked)}
            />
            Set as default payment method
          </label>
        )}
        <BillingNote>
          Demo only. Do not enter a real card number; no card details are
          collected or sent anywhere.
        </BillingNote>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button primary">
            {editing ? "Save changes" : "Add payment method"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default PaymentMethodDialog;
