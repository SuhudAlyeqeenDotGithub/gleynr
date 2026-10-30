import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type BillingSectionProps = {
  id: string;
  icon: LucideIcon;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  // Removes body padding so tables can run edge to edge.
  flush?: boolean;
  children: ReactNode;
};

const BillingSection = ({
  id,
  icon: Icon,
  title,
  description,
  action,
  flush,
  children,
}: BillingSectionProps) => (
  <section className="bl-section" aria-labelledby={id}>
    <header className="bl-section-head">
      <span className="bl-section-icon">
        <Icon size={17} />
      </span>
      <div className="bl-section-title">
        <h2 id={id}>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="bl-section-action">{action}</div>}
    </header>
    <div className={`bl-section-body ${flush ? "flush" : ""}`}>{children}</div>
  </section>
);

export default BillingSection;
