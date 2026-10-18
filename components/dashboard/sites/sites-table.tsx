import { useState } from "react";
import { ChevronDown, Search, Trash2 } from "lucide-react";
import type { Site } from "@/lib/dashboard/types";
import EmptyState from "../shared/empty-state";
import SiteStatus from "../shared/site-status";

type SitesTableProps = {
  sites: Site[];
  onDelete: (siteId: number) => void;
  onView: (site: Site) => void;
};

const SitesTable = ({ sites, onDelete, onView }: SitesTableProps) => {
  const [query, setQuery] = useState("");
  const filteredSites = sites.filter((site) =>
    `${site.name} ${site.location}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="panel">
      <div className="toolbar">
        <div className="search-input">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search sites..."
          />
        </div>
        <button className="select-button">
          All statuses <ChevronDown size={14} />
        </button>
      </div>
      {filteredSites.length ? (
        <div className="table">
          <div className="table-row table-header">
            <span>Site</span>
            <span>Status</span>
            <span>Visits</span>
            <span>Actions</span>
          </div>
          {filteredSites.map((site) => (
            <div className="table-row" key={site.id}>
              <span>
                <strong>{site.name}</strong>
                <small>
                  {site.location} &middot; {site.floors} floors
                </small>
              </span>
              <span>
                <SiteStatus status={site.status} />
              </span>
              <span>{site.visits.toLocaleString()}</span>
              <span className="row-actions">
                <button onClick={() => onView(site)}>View</button>
                <button
                  onClick={() => onDelete(site.id)}
                  aria-label={`Delete ${site.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState text="No sites match your search." />
      )}
    </section>
  );
};

export default SitesTable;
