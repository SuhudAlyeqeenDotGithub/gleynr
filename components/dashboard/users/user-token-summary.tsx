"use client";

import { useState } from "react";
import { Coins, Plus, UsersRound } from "lucide-react";
import type { UserType } from "@/lib/schemaAndTypes/zod/user";
import type { UserTokenSummary } from "@/lib/users/use-users-store";
import ModalShell from "@/components/dashboard/dialogs/modal-shell";

type UserTokenSummaryProps = {
  summaries: UserTokenSummary[];
  onPurchase: (type: UserType) => void;
};

const UserTokenSummaryPanel = ({
  summaries,
  onPurchase,
}: UserTokenSummaryProps) => {
  const [choosingType, setChoosingType] = useState(false);
  const chooseType = (type: UserType) => {
    setChoosingType(false);
    onPurchase(type);
  };

  return (
    <>
      <section className="panel user-token-panel" id="user-tokens">
        <div className="panel-head">
          <div>
            <div className="eyebrow">
              <Coins size={14} /> Token management
            </div>
            <h2>User Tokens</h2>
            <p>Dummy monthly allowances and additional account capacity.</p>
          </div>
          <div className="user-token-panel-actions">
            <span className="simulation-label">Simulated</span>
            <button
              className="button secondary"
              onClick={() => setChoosingType(true)}
            >
              <Plus size={14} /> Purchase User Tokens
            </button>
          </div>
        </div>
        <div className="user-token-grid">
          {summaries.map((summary) => (
            <article className="user-token-card" key={summary.type}>
              <div className="user-token-card-head">
                <span
                  className={`user-token-icon ${summary.type === "External User" ? "external" : "internal"}`}
                >
                  <UsersRound size={17} />
                </span>
                <div>
                  <h3>{summary.type}s</h3>
                  <span>
                    £{summary.monthlyPrice.toFixed(2)} / token / month
                  </span>
                </div>
                <button
                  className="button secondary"
                  onClick={() => chooseType(summary.type)}
                >
                  <Plus size={14} /> Purchase
                </button>
              </div>
              <div className="user-token-stats">
                <div>
                  <span>Included</span>
                  <strong>{summary.included}</strong>
                </div>
                <div>
                  <span>Purchased</span>
                  <strong>{summary.purchased}</strong>
                </div>
                <div>
                  <span>Total capacity</span>
                  <strong>{summary.capacity}</strong>
                </div>
                <div>
                  <span>In use</span>
                  <strong>{summary.used}</strong>
                </div>
                <div className={summary.remaining ? "remaining" : "exhausted"}>
                  <span>Remaining</span>
                  <strong>{summary.remaining}</strong>
                </div>
              </div>
              {summary.remaining === 0 && (
                <p className="user-token-warning">
                  Capacity reached. Purchase tokens to add another account.
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
      {choosingType && (
        <ModalShell
          title="Purchase User Tokens"
          onClose={() => setChoosingType(false)}
        >
          <div className="form-stack user-token-type-chooser">
            <p className="dialog-copy">
              Choose which user capacity to increase. Purchases are simulated
              and billed monthly in this prototype.
            </p>
            {summaries.map((summary) => (
              <button
                className="user-token-type-choice"
                key={summary.type}
                onClick={() => chooseType(summary.type)}
              >
                <span>
                  <strong>{summary.type}</strong>
                  <small>
                    £{summary.monthlyPrice.toFixed(2)} per token / month
                  </small>
                </span>
                <span>{summary.remaining} remaining</span>
              </button>
            ))}
            <div className="modal-actions">
              <button
                className="button secondary"
                onClick={() => setChoosingType(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </>
  );
};

export default UserTokenSummaryPanel;
