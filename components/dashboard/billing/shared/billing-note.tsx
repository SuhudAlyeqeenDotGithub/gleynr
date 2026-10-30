import { Info } from "lucide-react";
import type { ReactNode } from "react";

const BillingNote = ({ children }: { children: ReactNode }) => (
  <p className="bl-note">
    <Info size={14} aria-hidden />
    <span>{children}</span>
  </p>
);

export default BillingNote;
