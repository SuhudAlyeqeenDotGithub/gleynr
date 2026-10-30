// MOCK DATA: illustrative organisation billing details and payment methods. Replace with backend data.
import type { BillingDetails, PaymentMethod } from "../types";

export const MOCK_BILLING_DETAILS: BillingDetails = {
  organisationName: "Northstar Workspace Ltd",
  contactName: "Amara Okafor",
  email: "finance@northstar.example",
  phone: "+44 20 7946 0321",
  address: "14 Canal Street",
  city: "London",
  postalCode: "EC2A 4RT",
  country: "United Kingdom",
  vatNumber: "GB123456789",
};

export const createMockPaymentMethods = (): PaymentMethod[] => [
  {
    id: "pm-1",
    brand: "Visa",
    last4: "4242",
    holderName: "Amara Okafor",
    expiryMonth: 8,
    expiryYear: 2028,
    isDefault: true,
  },
  {
    id: "pm-2",
    brand: "Mastercard",
    last4: "5100",
    holderName: "Northstar Workspace Ltd",
    expiryMonth: 3,
    expiryYear: 2027,
    isDefault: false,
  },
  {
    id: "pm-3",
    brand: "American Express",
    last4: "1005",
    holderName: "Daniel Reyes",
    expiryMonth: 11,
    expiryYear: 2026,
    isDefault: false,
  },
];
