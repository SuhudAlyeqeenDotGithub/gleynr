"use client";

import { useState } from "react";
import {
  MOCK_BILLING_DETAILS,
  createMockPaymentMethods,
} from "./mock/billing-info";
import type {
  BillingDetails,
  PaymentMethod,
  PaymentMethodInput,
} from "./types";

export type RemoveResult = "removed" | "blocked";

// Local simulation only; independent of subscriptions and invoices.
export const useBillingInfoStore = () => {
  const [details, setDetails] = useState<BillingDetails>(MOCK_BILLING_DETAILS);
  const [methods, setMethods] = useState<PaymentMethod[]>(
    createMockPaymentMethods,
  );

  const saveDetails = (next: BillingDetails) =>
    setDetails({
      ...next,
      vatNumber: next.vatNumber?.trim() ? next.vatNumber.trim() : undefined,
    });

  const addMethod = (input: PaymentMethodInput) => {
    const { makeDefault, ...fields } = input;
    const method: PaymentMethod = {
      ...fields,
      id: `pm-${Date.now()}`,
      isDefault: false,
    };
    setMethods((items) => {
      const asDefault = makeDefault || items.length === 0;
      return [
        ...items.map((item) =>
          asDefault ? { ...item, isDefault: false } : item,
        ),
        { ...method, isDefault: asDefault },
      ];
    });
  };

  const updateMethod = (id: string, input: PaymentMethodInput) => {
    const { makeDefault, ...fields } = input;
    setMethods((items) =>
      items.map((item) => {
        if (item.id === id)
          return {
            ...item,
            ...fields,
            isDefault: item.isDefault || makeDefault,
          };
        return makeDefault ? { ...item, isDefault: false } : item;
      }),
    );
  };

  const setDefault = (id: string) =>
    setMethods((items) =>
      items.map((item) => ({ ...item, isDefault: item.id === id })),
    );

  // The default can only be removed when it is the last method on file.
  const removeMethod = (id: string): RemoveResult => {
    const target = methods.find((item) => item.id === id);
    if (!target || (target.isDefault && methods.length > 1)) return "blocked";
    setMethods((items) => items.filter((item) => item.id !== id));
    return "removed";
  };

  return {
    details,
    methods,
    saveDetails,
    addMethod,
    updateMethod,
    setDefault,
    removeMethod,
  };
};

export type BillingInfoStore = ReturnType<typeof useBillingInfoStore>;
