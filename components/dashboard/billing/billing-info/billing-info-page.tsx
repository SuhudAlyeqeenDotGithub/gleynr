"use client";

import { useState } from "react";
import { Landmark } from "lucide-react";
import ConfirmDialog from "@/components/dashboard/dialogs/confirm-dialog";
import type { PaymentMethod } from "@/lib/billing-info/types";
import type { BillingInfoStore } from "@/lib/billing-info/use-billing-info-store";
import BillingHeader from "../shared/billing-header";
import BillingDetailsDialog from "./billing-details-dialog";
import BillingDetailsSection from "./billing-details-section";
import PaymentMethodDialog from "./payment-method-dialog";
import PaymentMethodsSection from "./payment-methods-section";

type BillingInfoPageProps = {
  store: BillingInfoStore;
  notify: (text: string) => void;
};

type MethodDialog = { mode: "add" } | { mode: "edit"; method: PaymentMethod };

const BillingInfoPage = ({ store, notify }: BillingInfoPageProps) => {
  const { details, methods } = store;
  const [editingDetails, setEditingDetails] = useState(false);
  const [methodDialog, setMethodDialog] = useState<MethodDialog | null>(null);
  const [removing, setRemoving] = useState<PaymentMethod | null>(null);

  return (
    <div className="page-content bl-page">
      <BillingHeader
        icon={Landmark}
        title="Billing information"
        description="Manage your organisation's billing details and payment methods."
      />

      <BillingDetailsSection
        details={details}
        onEdit={() => setEditingDetails(true)}
      />
      <PaymentMethodsSection
        methods={methods}
        onAdd={() => setMethodDialog({ mode: "add" })}
        onEdit={(method) => setMethodDialog({ mode: "edit", method })}
        onSetDefault={(method) => {
          store.setDefault(method.id);
          notify(`${method.brand} ending ${method.last4} is now the default.`);
        }}
        onRemove={setRemoving}
      />

      {editingDetails && (
        <BillingDetailsDialog
          details={details}
          onClose={() => setEditingDetails(false)}
          onSave={(next) => {
            store.saveDetails(next);
            notify("Billing details updated.");
          }}
        />
      )}
      {methodDialog && (
        <PaymentMethodDialog
          method={
            methodDialog.mode === "edit" ? methodDialog.method : undefined
          }
          onClose={() => setMethodDialog(null)}
          onSave={(input) => {
            if (methodDialog.mode === "edit") {
              store.updateMethod(methodDialog.method.id, input);
              notify("Payment method updated.");
            } else {
              store.addMethod(input);
              notify("Payment method added.");
            }
          }}
        />
      )}
      {removing && (
        <ConfirmDialog
          title="Remove payment method"
          message={
            methods.length === 1
              ? `Remove ${removing.brand} ending ${removing.last4}? This is your only payment method, so no card will be on file for future invoices.`
              : `Remove ${removing.brand} ending ${removing.last4}? It will no longer be available for paying invoices.`
          }
          confirmLabel="Remove"
          onClose={() => setRemoving(null)}
          onConfirm={() => {
            if (store.removeMethod(removing.id) === "removed")
              notify("Payment method removed.");
          }}
        />
      )}
    </div>
  );
};

export default BillingInfoPage;
