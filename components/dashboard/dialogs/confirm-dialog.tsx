import ModalShell from "./modal-shell";

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmDialog = ({
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => (
  <ModalShell title={title} onClose={onClose}>
    <div className="form-stack">
      <p className="dialog-copy">{message}</p>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          className="button danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </ModalShell>
);

export default ConfirmDialog;
