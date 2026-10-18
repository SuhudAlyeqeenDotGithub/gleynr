import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalShellProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

const ModalShell = ({ title, children, onClose }: ModalShellProps) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-card" onClick={(event) => event.stopPropagation()}>
      <div className="modal-head">
        <h2>{title}</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={17} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default ModalShell;
