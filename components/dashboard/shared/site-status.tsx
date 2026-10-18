import type { SiteStatus as SiteStatusType } from "@/lib/dashboard/types";

type SiteStatusProps = {
  status: SiteStatusType;
};

const SiteStatus = ({ status }: SiteStatusProps) => (
  <b className={`status-pill ${status.toLowerCase()}`}>{status}</b>
);

export default SiteStatus;
