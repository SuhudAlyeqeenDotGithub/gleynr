import { useState } from "react";
import { UploadCloud } from "lucide-react";
import type { ModalType } from "@/lib/dashboard/types";
import ModalShell from "./modal-shell";

type FormModalProps = {
  type: Exclude<ModalType, null>;
  onClose: () => void;
  onSubmit: (value: string) => void;
};

const FormModal = ({ type, onClose, onSubmit }: FormModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const isSite = type === "site";
  const title = isSite
    ? "Add a site"
    : type === "import"
      ? "Start a data import"
      : type === "user"
        ? "Invite a user"
        : "Change subscription";
  const submit = () => {
    if (isSite && !name.trim())
      return setMessage("Enter a site name to continue.");
    if (type === "user" && !email.includes("@"))
      return setMessage("Enter a valid email address.");
    onSubmit(name || email || "Growth plan");
    setMessage("");
    onClose();
  };

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="form-stack">
        {isSite && (
          <>
            <label>
              Site name
              <input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. West End office"
              />
            </label>
            <label>
              Location
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="City, country"
              />
            </label>
          </>
        )}
        {type === "user" && (
          <>
            <label>
              Email address
              <input
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="colleague@company.com"
              />
            </label>
            <label>
              Role
              <select>
                <option>Member</option>
                <option>Viewer</option>
                <option>Admin</option>
              </select>
            </label>
          </>
        )}
        {type === "import" && (
          <>
            <div className="upload-zone">
              <UploadCloud size={24} />
              <strong>Use sample event data</strong>
              <span>
                CSV &middot; 120 rows &middot; validation preview included
              </span>
            </div>
            <label>
              Import name
              <input
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="November events"
              />
            </label>
          </>
        )}
        {type === "plan" && (
          <div className="plan-choice">
            <strong>Growth plan</strong>
            <span>
              Up to 50 sites &middot; advanced analytics &middot; $299/month
            </span>
          </div>
        )}
        {message && <div className="form-error">{message}</div>}
        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button primary" onClick={submit}>
            {type === "plan" ? "Confirm change" : "Continue"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default FormModal;
