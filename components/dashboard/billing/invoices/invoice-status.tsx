import StatusBadge from "../shared/status-badge";
import { INVOICE_STATUS } from "../shared/status-presets";

const InvoiceStatusLabel = ({ status }: { status: string }) => (
  <StatusBadge label={status} preset={INVOICE_STATUS[status]} />
);

export default InvoiceStatusLabel;
