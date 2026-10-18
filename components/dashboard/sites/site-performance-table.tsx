import { ArrowUpRight } from "lucide-react";
import type { Site } from "@/lib/dashboard/types";
import SiteStatus from "../shared/site-status";

type SitePerformanceTableProps = {
  sites: Site[];
  onViewAll: () => void;
};

const SitePerformanceTable = ({
  sites,
  onViewAll,
}: SitePerformanceTableProps) => (
  <section className="panel">
    <div className="panel-head">
      <div>
        <h2>Site performance</h2>
        <p>Visits by connected site</p>
      </div>
      <button className="button secondary" onClick={onViewAll}>
        View all sites <ArrowUpRight size={14} />
      </button>
    </div>
    <div className="table">
      <div className="table-row table-header">
        <span>Site</span>
        <span>Status</span>
        <span>Visits</span>
        <span>Floors</span>
      </div>
      {sites.map((site) => (
        <div className="table-row" key={site.id}>
          <span>
            <strong>{site.name}</strong>
            <small>{site.location}</small>
          </span>
          <span>
            <SiteStatus status={site.status} />
          </span>
          <span>{site.visits.toLocaleString()}</span>
          <span>{site.floors}</span>
        </div>
      ))}
    </div>
  </section>
);

export default SitePerformanceTable;
