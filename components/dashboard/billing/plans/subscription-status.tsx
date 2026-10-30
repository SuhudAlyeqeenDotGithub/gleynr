import type { SubscriptionRecord } from "@/lib/plans/types";

const SubscriptionStatus = ({
  status,
}: {
  status: SubscriptionRecord["status"];
}) => <span className={`plans-status ${status.toLowerCase()}`}>{status}</span>;

export default SubscriptionStatus;
