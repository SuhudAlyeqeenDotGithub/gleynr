import StatusBadge from "../shared/status-badge";
import { BILLING_STATUS } from "../shared/status-presets";

const BillingStatusLabel = ({ status }: { status: string }) => (
  <StatusBadge label={status} preset={BILLING_STATUS[status]} />
);

export default BillingStatusLabel;
