import { CreditCard, Plus, Star } from "lucide-react";
import type { PaymentMethod } from "@/lib/billing-info/types";
import Pagination from "@/components/dashboard/shared/pagination";
import { useLocalPage } from "@/lib/pagination/use-local-page";
import {
  expiresSoon,
  formatExpiry,
  isCardExpired,
} from "@/lib/billing-info/validation";
import BillingNote from "../shared/billing-note";
import BillingSection from "../shared/billing-section";
import StatusBadge from "../shared/status-badge";

type PaymentMethodsSectionProps = {
  methods: PaymentMethod[];
  onAdd: () => void;
  onEdit: (method: PaymentMethod) => void;
  onSetDefault: (method: PaymentMethod) => void;
  onRemove: (method: PaymentMethod) => void;
};

const PaymentMethodsSection = ({
  methods,
  onAdd,
  onEdit,
  onSetDefault,
  onRemove,
}: PaymentMethodsSectionProps) => {
  const { rows, pagination } = useLocalPage(methods, "methods");
  return (
  <BillingSection
    id="bi-methods-title"
    icon={CreditCard}
    title="Payment methods"
    description="Cards available for paying your invoices. The default is used first."
    action={
      <button className="button primary" onClick={onAdd}>
        <Plus size={14} /> Add payment method
      </button>
    }
    flush
  >
    {methods.length === 0 ? (
      <p className="bi-empty">
        No payment methods on file. Add one so invoices can be paid.
      </p>
    ) : (
      <div className="bl-table-wrap">
        <table className="bl-table bi-table">
          <thead>
            <tr>
              <th scope="col">Payment method</th>
              <th scope="col">Cardholder</th>
              <th scope="col">Expires</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((method) => {
              const expired = isCardExpired(method);
              const soon = expiresSoon(method);
              const blocked = method.isDefault && methods.length > 1;
              return (
                <tr
                  key={method.id}
                  className={method.isDefault ? "is-current" : undefined}
                >
                  <th scope="row">
                    <div className="bl-cell-id">
                      <span className="bl-mini-icon">
                        <CreditCard size={16} />
                      </span>
                      <div>
                        <strong>{method.brand}</strong>
                        <small>•••• •••• •••• {method.last4}</small>
                      </div>
                    </div>
                  </th>
                  <td>{method.holderName}</td>
                  <td>
                    {formatExpiry(method)}
                    {expired && <small className="bi-expired">Expired</small>}
                    {soon && <small className="bi-soon">Expires soon</small>}
                  </td>
                  <td>
                    {method.isDefault ? (
                      <StatusBadge
                        label="Default"
                        preset={{ tone: "brand", icon: Star }}
                      />
                    ) : (
                      <span className="bi-muted">Backup</span>
                    )}
                  </td>
                  <td className="bl-cell-end">
                    <div className="bi-actions">
                      {!method.isDefault && (
                        <button
                          className="bl-link"
                          onClick={() => onSetDefault(method)}
                        >
                          Set as default
                        </button>
                      )}
                      <button
                        className="bl-link"
                        onClick={() => onEdit(method)}
                      >
                        Edit
                      </button>
                      <button
                        className="bl-link bi-remove"
                        onClick={() => onRemove(method)}
                        disabled={blocked}
                        title={
                          blocked
                            ? "Set another payment method as default before removing this one"
                            : undefined
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
    <Pagination controls={pagination} label="payment methods" flush />
    <div className="bi-section-foot">
      <BillingNote>
        The default payment method cannot be removed while other methods are on
        file. Demo only: no real payments are processed.
      </BillingNote>
    </div>
  </BillingSection>
  );
};

export default PaymentMethodsSection;
