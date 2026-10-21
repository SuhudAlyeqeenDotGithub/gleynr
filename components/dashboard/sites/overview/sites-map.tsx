import {
  LANDMASS_PATHS,
  MAP_HEIGHT,
  MAP_WIDTH,
  project,
} from "@/lib/sites/map";
import type { SiteRecord } from "@/lib/sites/types";

type SitesMapProps = {
  sites: SiteRecord[];
  highlightedId: string | null;
  onOpen: (siteId: string) => void;
  onHover: (siteId: string | null) => void;
};

const SitesMap = ({ sites, highlightedId, onOpen, onHover }: SitesMapProps) => (
  <div className="sites-map">
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {LANDMASS_PATHS.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
    {sites.map((site) => {
      const { x, y } = project(site.coordinates);
      return (
        <button
          key={site.id}
          className={`map-marker ${site.status.toLowerCase()} ${highlightedId === site.id ? "highlighted" : ""}`}
          style={{
            left: `${(x / MAP_WIDTH) * 100}%`,
            top: `${(y / MAP_HEIGHT) * 100}%`,
          }}
          aria-label={`Open ${site.name}, ${site.location}`}
          onClick={() => onOpen(site.id)}
          onMouseEnter={() => onHover(site.id)}
          onMouseLeave={() => onHover(null)}
          onFocus={() => onHover(site.id)}
          onBlur={() => onHover(null)}
        >
          <span className="marker-pin" />
          <span className="marker-label">{site.name}</span>
        </button>
      );
    })}
  </div>
);

export default SitesMap;
