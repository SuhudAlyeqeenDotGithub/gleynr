import type {
  BillingDetails,
  FieldErrors,
  PaymentMethod,
  PaymentMethodInput,
} from "./types";

export const COUNTRIES = [
  "United Kingdom",
  "Ireland",
  "United States",
  "Germany",
  "France",
  "Netherlands",
  "Australia",
  "Singapore",
];

export type DetailsField = keyof BillingDetails;
export type MethodField = "last4" | "holderName" | "expiry";

export const validateDetails = (
  values: BillingDetails,
): FieldErrors<DetailsField> => {
  const errors: FieldErrors<DetailsField> = {};
  const required: [DetailsField, string][] = [
    ["organisationName", "Enter the organisation name."],
    ["contactName", "Enter a billing contact name."],
    ["phone", "Enter a billing phone number."],
    ["address", "Enter the billing address."],
    ["city", "Enter the town or city."],
    ["postalCode", "Enter the postcode."],
    ["country", "Select a country."],
  ];
  for (const [field, message] of required) {
    if (!String(values[field] ?? "").trim()) errors[field] = message;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  if (values.phone.trim() && !/^[+\d][\d\s()-]{6,}$/.test(values.phone.trim()))
    errors.phone = "Enter a valid phone number.";
  const vat = values.vatNumber?.replace(/\s/g, "") ?? "";
  if (vat && !/^[A-Za-z0-9]{8,14}$/.test(vat))
    errors.vatNumber = "Enter a valid VAT number or leave blank.";
  return errors;
};

export const isCardExpired = (
  method: Pick<PaymentMethod, "expiryMonth" | "expiryYear">,
  now = new Date(),
) => now >= new Date(method.expiryYear, method.expiryMonth, 1);

export const expiresSoon = (
  method: Pick<PaymentMethod, "expiryMonth" | "expiryYear">,
  now = new Date(),
) => {
  const end = new Date(method.expiryYear, method.expiryMonth, 1);
  return now < end && end.getTime() - now.getTime() < 60 * 86_400_000;
};

export const validateMethod = (
  values: Pick<
    PaymentMethodInput,
    "last4" | "holderName" | "expiryMonth" | "expiryYear"
  >,
): FieldErrors<MethodField> => {
  const errors: FieldErrors<MethodField> = {};
  if (!/^\d{4}$/.test(values.last4))
    errors.last4 = "Enter exactly four digits.";
  if (!values.holderName.trim())
    errors.holderName = "Enter the cardholder name.";
  if (
    !Number.isInteger(values.expiryMonth) ||
    values.expiryMonth < 1 ||
    values.expiryMonth > 12 ||
    !Number.isInteger(values.expiryYear)
  )
    errors.expiry = "Enter a valid expiry date.";
  else if (isCardExpired(values)) errors.expiry = "This card has expired.";
  return errors;
};

export const formatExpiry = (
  method: Pick<PaymentMethod, "expiryMonth" | "expiryYear">,
) => `${String(method.expiryMonth).padStart(2, "0")}/${method.expiryYear}`;
