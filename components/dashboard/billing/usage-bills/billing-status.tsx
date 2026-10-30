import type { BillingStatus } from "@/lib/usage-bills/types";

const slug = (status: BillingStatus) => status.toLowerCase().replaceAll(" ", "-");

const BillingStatusLabel = ({ status }: { status: BillingStatus }) => (
  <span className={`ub-status ${slug(status)}`}>{status}</span>
);

export default BillingStatusLabel;
