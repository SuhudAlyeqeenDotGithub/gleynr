import type { BillingInfo } from "@/lib/schemaAndTypes/zod/billingInfo";

// Extends the stored billing info with the contact fields the page edits.
export type BillingDetails = Pick<
  BillingInfo,
  "email" | "address" | "city" | "postalCode"
> & {
  organisationName: string;
  contactName: string;
  phone: string;
  country: string;
  vatNumber?: string;
};

export type CardBrand = "Visa" | "Mastercard" | "American Express";

export const CARD_BRANDS: CardBrand[] = [
  "Visa",
  "Mastercard",
  "American Express",
];

// Only the last four digits are ever held; full card numbers are never collected.
export type PaymentMethod = {
  id: string;
  brand: CardBrand;
  last4: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
};

export type PaymentMethodInput = Omit<PaymentMethod, "id" | "isDefault"> & {
  makeDefault: boolean;
};

export type FieldErrors<T extends string> = Partial<Record<T, string>>;
