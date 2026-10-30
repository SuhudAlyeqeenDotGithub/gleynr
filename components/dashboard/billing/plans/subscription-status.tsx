import StatusBadge from "../shared/status-badge";
import { SUBSCRIPTION_STATUS } from "../shared/status-presets";

const SubscriptionStatus = ({ status }: { status: string }) => (
  <StatusBadge label={status} preset={SUBSCRIPTION_STATUS[status]} />
);

export default SubscriptionStatus;
