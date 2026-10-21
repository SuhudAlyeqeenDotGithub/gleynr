import { useEffect, useId } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalShellProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
};

const ModalShell = ({ title, children, onClose, wide }: ModalShellProps) => {
  const titleId = useId();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id={titleId}>{title}</h2>
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
};

export default ModalShell;
