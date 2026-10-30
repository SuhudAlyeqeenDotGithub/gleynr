import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type BillingHeaderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
};

const BillingHeader = ({
  icon: Icon,
  title,
  description,
  children,
}: BillingHeaderProps) => (
  <header className="bl-header">
    <div className="bl-header-text">
      <span className="bl-crumb">Billing</span>
      <h1>
        <Icon size={22} aria-hidden />
        {title}
      </h1>
      <p>{description}</p>
    </div>
    {children && <div className="bl-header-actions">{children}</div>}
  </header>
);

export default BillingHeader;
