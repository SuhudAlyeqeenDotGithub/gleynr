"use client";

import { useRef, useState } from "react";
import { createMockInvoices } from "./mock/invoices";
import type { InvoiceRecord } from "./types";

const RETRY_DELAY_MS = 1800;

// Frontend-only simulation: no requests are made and no payment is processed.
export const useInvoicesStore = () => {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(createMockInvoices);
  const sequence = useRef(0);

  const update = (
    id: string,
    change: (invoice: InvoiceRecord) => InvoiceRecord,
  ) =>
    setInvoices((items) =>
      items.map((item) => (item.id === id ? change(item) : item)),
    );

  const updatePaymentMethod = (id: string) =>
    update(id, (invoice) => ({ ...invoice, paymentMethodUpdated: true }));

  const retryPayment = (invoice: InvoiceRecord, onSettled: () => void) => {
    const id = invoice.id;
    const attemptId = `${id}-retry-${++sequence.current}`;
    update(id, (invoice) => ({
      ...invoice,
      status: "Pending",
      attempts: [
        ...invoice.attempts,
        {
          id: attemptId,
          date: new Date(),
          amount: invoice.amount,
          outcome: "Processing",
          note: "Retry submitted (simulated).",
        },
      ],
    }));
    window.setTimeout(() => {
      update(id, (invoice) => ({
        ...invoice,
        status: "Paid",
        successfulDate: new Date(),
        attempts: invoice.attempts.map((attempt) =>
          attempt.id === attemptId
            ? { ...attempt, outcome: "Succeeded", note: undefined }
            : attempt,
        ),
      }));
      onSettled();
    }, RETRY_DELAY_MS);
  };

  return { invoices, retryPayment, updatePaymentMethod };
};
