import { ArrowRight, TriangleAlert } from "lucide-react";
import ModalShell from "@/components/dashboard/dialogs/modal-shell";
import { ENTITLEMENT_ITEMS } from "@/lib/plans/catalog";
import {
  describeEntitlementChange,
  formatDate,
  getChangeKind,
  getEffectiveDate,
  getEntitlementValue,
  getPlan,
} from "@/lib/plans/selectors";
import type { SubscriptionRecord } from "@/lib/plans/types";
import BasePrice from "./base-price";

type ChangePlanDialogProps = {
  subscription: SubscriptionRecord;
  targetName: string;
  onConfirm: () => void;
  onClose: () => void;
};

const ChangePlanDialog = ({
  subscription,
  targetName,
  onConfirm,
  onClose,
}: ChangePlanDialogProps) => {
  const current = getPlan(subscription.plan);
  const target = getPlan(targetName);
  if (!current || !target) return null;

  const kind = getChangeKind(current.name, target.name);
  const effective = getEffectiveDate(subscription, kind);
  const immediate = effective.toDateString() === new Date().toDateString();
  const changes = ENTITLEMENT_ITEMS.map((item) =>
    describeEntitlementChange(
      item,
      getEntitlementValue(current, item),
      getEntitlementValue(target, item),
    ),
  ).filter((line): line is string => line !== null);

  return (
    <ModalShell
      title={kind === "upgrade" ? "Confirm upgrade" : "Confirm downgrade"}
      onClose={onClose}
      wide
    >
      <div className="form-stack">
        <div className="plans-change-summary">
          <div>
            <span>Current plan</span>
            <strong>{current.name}</strong>
            <small>
              Base price:{" "}
              <BasePrice
                price={current.monthlyPrice}
                currency={current.currency}
              />
            </small>
          </div>
          <ArrowRight size={18} aria-hidden />
          <div className="proposed">
            <span>Proposed plan</span>
            <strong>{target.name}</strong>
            <small>
              Base price:{" "}
              <BasePrice
                price={target.monthlyPrice}
                currency={target.currency}
              />
            </small>
          </div>
        </div>
        <dl className="plans-change-meta">
          <div>
            <dt>Effective date</dt>
            <dd>
              {immediate ? "Today, " : ""}
              {formatDate(effective)}
            </dd>
          </div>
          <div>
            <dt>Billing</dt>
            <dd>Monthly</dd>
          </div>
        </dl>
        <p className="dialog-copy">
          Prices are base subscription prices per month. Usage charges still
          apply on top.
        </p>
        {kind === "downgrade" && (
          <div className="plans-warning" role="alert">
            <TriangleAlert size={16} />
            <div>
              <strong>Entitlements and limits will change</strong>
              {changes.length > 0 ? (
                <ul>
                  {changes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  Limits for {target.name} are not yet defined, so specific
                  changes cannot be listed. Review the plan comparison first.
                </p>
              )}
              <p>
                You keep {current.name} until the effective date. After that,
                the new plan's allowances apply.
              </p>
            </div>
          </div>
        )}
        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>
            Keep current plan
          </button>
          <button
            className={`button ${kind === "upgrade" ? "primary" : "danger"}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm {kind}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default ChangePlanDialog;
