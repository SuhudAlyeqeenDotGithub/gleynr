import { ArrowUpRight, Layers, MapPin } from "lucide-react";
import { countAreas } from "@/lib/sites/selectors";
import type { SiteRecord } from "@/lib/sites/types";
import SiteStatus from "../../shared/site-status";

type SiteCardProps = {
  site: SiteRecord;
  highlighted: boolean;
  onOpen: (siteId: string) => void;
  onHover: (siteId: string | null) => void;
};

const SiteCard = ({ site, highlighted, onOpen, onHover }: SiteCardProps) => (
  <button
    className={`site-card ${highlighted ? "highlighted" : ""}`}
    onClick={() => onOpen(site.id)}
    onMouseEnter={() => onHover(site.id)}
    onMouseLeave={() => onHover(null)}
    onFocus={() => onHover(site.id)}
    onBlur={() => onHover(null)}
  >
    <span className="site-card-icon">{site.name.charAt(0)}</span>
    <span className="site-card-body">
      <strong>{site.name}</strong>
      <small>
        <MapPin size={12} /> {site.location}
      </small>
      <small>
        <Layers size={12} /> {site.floors.length} floors &middot;{" "}
        {countAreas(site)} areas
      </small>
    </span>
    <span className="site-card-side">
      <SiteStatus status={site.status} />
      <ArrowUpRight size={15} />
    </span>
  </button>
);

export default SiteCard;
