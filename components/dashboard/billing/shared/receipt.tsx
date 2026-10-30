import type { ReactNode } from "react";

export type ReceiptLine = {
  label: string;
  hint?: string;
  tag?: string;
  amount: ReactNode;
  muted?: boolean;
};

type ReceiptProps = {
  lines: ReceiptLine[];
  total: { label: string; amount: ReactNode; muted?: boolean };
};

// Itemised amounts ending in an emphasised total.
const Receipt = ({ lines, total }: ReceiptProps) => (
  <dl className="bl-receipt">
    {lines.map((line) => (
      <div key={`${line.label}-${line.hint ?? ""}`}>
        <dt>
          <span>
            {line.label}
            {line.tag && <em className="bl-tag">{line.tag}</em>}
          </span>
          {line.hint && <small>{line.hint}</small>}
        </dt>
        <dd className={line.muted ? "muted" : undefined}>{line.amount}</dd>
      </div>
    ))}
    <div className="total">
      <dt>{total.label}</dt>
      <dd className={total.muted ? "muted" : undefined}>{total.amount}</dd>
    </div>
  </dl>
);

export default Receipt;
