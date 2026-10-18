import { Building2, X } from "lucide-react";
import type { Site } from "@/lib/dashboard/types";

type SiteDetailPanelProps = {
  site: Site;
  onClose: () => void;
};

const SiteDetailPanel = ({ site, onClose }: SiteDetailPanelProps) => (
  <div className="detail-panel">
    <button
      className="icon-button close-detail"
      onClick={onClose}
      aria-label="Close details"
    >
      <X size={17} />
    </button>
    <div className="eyebrow">
      <Building2 size={14} /> Site detail
    </div>
    <h2>{site.name}</h2>
    <p>{site.location}</p>
    <div className="detail-stats">
      <div>
        <strong>{site.visits.toLocaleString()}</strong>
        <span>Visits this month</span>
      </div>
      <div>
        <strong>{site.floors}</strong>
        <span>Floors mapped</span>
      </div>
    </div>
    <button className="button secondary" onClick={onClose}>
      Close
    </button>
  </div>
);

export default SiteDetailPanel;
