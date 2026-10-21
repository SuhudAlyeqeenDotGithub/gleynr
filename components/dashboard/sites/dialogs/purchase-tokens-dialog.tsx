import { useState } from "react";
import { Coins, Minus, Plus, ShieldCheck } from "lucide-react";
import { MAX_TOKEN_QUANTITY, TOKEN_PRICE } from "@/lib/sites/constants";
import { formatCurrency } from "@/lib/sites/selectors";
import type { TokenSummary } from "@/lib/sites/types";
import ModalShell from "../../dialogs/modal-shell";

type PurchaseTokensDialogProps = {
  tokens: TokenSummary;
  onConfirm: (quantity: number) => void;
  onClose: () => void;
};

const clamp = (value: number) =>
  Math.min(
    MAX_TOKEN_QUANTITY,
    Math.max(1, Number.isFinite(value) ? Math.round(value) : 1),
  );

const PurchaseTokensDialog = ({
  tokens,
  onConfirm,
  onClose,
}: PurchaseTokensDialogProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <ModalShell title="Purchase site tokens" onClose={onClose}>
      <div className="form-stack">
        <p className="dialog-copy">
          Each token lets you create one site. Tokens are added to your balance
          immediately.
        </p>
        <div className="price-row">
          <span>
            <Coins size={15} /> Price per token
          </span>
          <strong>{formatCurrency(TOKEN_PRICE)}</strong>
        </div>
        <div className="quantity-field">
          <span id="token-quantity-label">Quantity</span>
          <div
            className="stepper"
            role="group"
            aria-labelledby="token-quantity-label"
          >
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity(clamp(quantity - 1))}
            >
              <Minus size={15} />
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_TOKEN_QUANTITY}
              value={quantity}
              aria-label="Token quantity"
              onChange={(event) =>
                setQuantity(clamp(Number(event.target.value)))
              }
            />
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= MAX_TOKEN_QUANTITY}
              onClick={() => setQuantity(clamp(quantity + 1))}
            >
              <Plus size={15} />
            </button>
          </div>
        </div>
        <div className="summary-box">
          <div>
            <span>Balance after purchase</span>
            <strong>{tokens.available + quantity} available</strong>
          </div>
          <div className="total">
            <span>Total</span>
            <strong>{formatCurrency(quantity * TOKEN_PRICE)}</strong>
          </div>
        </div>
        <p className="field-hint secure-note">
          <ShieldCheck size={13} /> Demo purchase &mdash; no payment is taken.
        </p>
        <div className="modal-actions">
          <button className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button primary"
            onClick={() => {
              onConfirm(quantity);
              onClose();
            }}
          >
            Confirm purchase
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default PurchaseTokensDialog;
