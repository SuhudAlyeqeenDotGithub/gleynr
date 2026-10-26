"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Minus,
  Plus,
  ShieldCheck,
} from "lucide-react";
import type { UserType } from "@/lib/schemaAndTypes/zod/user";
import type { UserTokenSummary } from "@/lib/users/use-users-store";
import ModalShell from "@/components/dashboard/dialogs/modal-shell";

type UserTokenPurchaseDialogProps = {
  type: UserType;
  summary: UserTokenSummary;
  onConfirm: (type: UserType, quantity: number) => boolean;
  onClose: () => void;
};

const MAX_QUANTITY = 100;

const UserTokenPurchaseDialog = ({
  type,
  summary,
  onConfirm,
  onClose,
}: UserTokenPurchaseDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<"quantity" | "review" | "success">(
    "quantity",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const confirming = useRef(false);
  const label = type === "Internal User" ? "internal user" : "external user";
  const total = quantity * summary.monthlyPrice;

  const updateQuantity = (value: number) => {
    if (!Number.isFinite(value)) return;
    setQuantity(Math.max(1, Math.min(MAX_QUANTITY, Math.round(value))));
    setError("");
  };

  const confirm = () => {
    if (confirming.current) return;
    confirming.current = true;
    setLoading(true);
    window.setTimeout(() => {
      const purchased = onConfirm(type, quantity);
      confirming.current = false;
      setLoading(false);
      if (purchased) setStep("success");
      else
        setError(
          "The purchase could not be completed. Check the quantity and try again.",
        );
    }, 450);
  };

  return (
    <ModalShell
      title={`Purchase ${label} tokens`}
      onClose={loading ? () => undefined : onClose}
    >
      <div className="form-stack user-token-purchase">
        {step === "quantity" && (
          <>
            <p className="dialog-copy">
              Each token adds capacity for one {label} account. Additional
              tokens renew monthly.
            </p>
            <div className="price-row">
              <span>
                <Coins size={15} /> Price per token / month
              </span>
              <strong>£{summary.monthlyPrice.toFixed(2)}</strong>
            </div>
            <div className="quantity-field">
              <span id="user-token-quantity-label">Quantity</span>
              <div
                className="stepper"
                role="group"
                aria-labelledby="user-token-quantity-label"
              >
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => updateQuantity(quantity - 1)}
                >
                  <Minus size={15} />
                </button>
                <input
                  type="number"
                  min={1}
                  max={MAX_QUANTITY}
                  value={quantity}
                  aria-label="Token quantity"
                  onChange={(event) =>
                    updateQuantity(Number(event.target.value))
                  }
                />
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= MAX_QUANTITY}
                  onClick={() => updateQuantity(quantity + 1)}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
            <div className="summary-box">
              <div>
                <span>Capacity after purchase</span>
                <strong>{summary.remaining + quantity} remaining</strong>
              </div>
              <div className="total">
                <span>Monthly total</span>
                <strong>£{total.toFixed(2)}</strong>
              </div>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="user-token-sim-note">
              <ShieldCheck size={14} /> Dummy purchase only. No payment or
              subscription is created.
            </div>
            <div className="modal-actions">
              <button className="button secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                className="button primary"
                disabled={quantity < 1 || quantity > MAX_QUANTITY}
                onClick={() => setStep("review")}
              >
                Review purchase <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}
        {step === "review" && (
          <>
            <div className="user-token-review-icon">
              <Coins size={19} />
            </div>
            <h3 className="user-token-review-title">
              Review simulated purchase
            </h3>
            <div className="user-token-review-list">
              <div>
                <span>Token type</span>
                <strong>{type}</strong>
              </div>
              <div>
                <span>Quantity</span>
                <strong>{quantity}</strong>
              </div>
              <div>
                <span>Unit price</span>
                <strong>£{summary.monthlyPrice.toFixed(2)} / month</strong>
              </div>
              <div className="user-token-total">
                <span>Monthly total</span>
                <strong>£{total.toFixed(2)}</strong>
              </div>
            </div>
            <div className="user-token-sim-note">
              <ShieldCheck size={14} /> This is a dummy confirmation. Balances
              update locally only.
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="modal-actions">
              <button
                className="button secondary"
                disabled={loading}
                onClick={() => setStep("quantity")}
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                className="button primary"
                disabled={loading}
                onClick={confirm}
              >
                {loading ? "Processing…" : "Confirm simulated purchase"}
              </button>
            </div>
          </>
        )}
        {step === "success" && (
          <div className="user-token-purchase-success">
            <span>
              <CheckCircle2 size={24} />
            </span>
            <h3>Tokens added</h3>
            <p>
              {quantity} {label} {quantity === 1 ? "token was" : "tokens were"}{" "}
              added. Your local capacity is now {summary.remaining} remaining.
            </p>
            <button className="button primary" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </ModalShell>
  );
};

export default UserTokenPurchaseDialog;
