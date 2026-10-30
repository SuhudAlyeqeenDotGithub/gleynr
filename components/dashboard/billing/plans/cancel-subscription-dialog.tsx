import ModalShell from "@/components/dashboard/dialogs/modal-shell";
import { formatDate, getEffectiveDate } from "@/lib/plans/selectors";
import type { SubscriptionRecord } from "@/lib/plans/types";

type CancelSubscriptionDialogProps = {
  subscription: SubscriptionRecord;
  onConfirm: () => void;
  onClose: () => void;
};

const CancelSubscriptionDialog = ({
  subscription,
  onConfirm,
  onClose,
}: CancelSubscriptionDialogProps) => {
  const effective = formatDate(getEffectiveDate(subscription, "cancel"));

  return (
    <ModalShell title="Cancel subscription" onClose={onClose}>
      <div className="form-stack">
        <p className="dialog-copy">
          Your {subscription.plan} subscription will be cancelled effective{" "}
          <strong>{effective}</strong>, the end of the current billing period.
          You keep full access until then.
        </p>
        <p className="dialog-copy">
          Your subscription history and billing records are preserved. You can
          undo the cancellation before the effective date.
        </p>
        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>
            Keep subscription
          </button>
          <button
            className="button danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm cancellation
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default CancelSubscriptionDialog;
