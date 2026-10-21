import { useState } from "react";
import { Coins, Plus, Search } from "lucide-react";
import type { SitesStore } from "@/lib/sites/use-sites-store";
import EmptyState from "../../shared/empty-state";
import SiteCard from "./site-card";
import SitesMap from "./sites-map";
import TokenHistory from "./token-history";
import TokenSummaryGrid from "./token-summary";

type SitesOverviewProps = {
  store: SitesStore;
  onOpenSite: (siteId: string) => void;
  onPurchase: () => void;
  onCreate: () => void;
};

const SitesOverview = ({
  store,
  onOpenSite,
  onPurchase,
  onCreate,
}: SitesOverviewProps) => {
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const { sites, tokens, transactions } = store;
  const filtered = sites.filter((site) =>
    `${site.name} ${site.location}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="sites-stack">
      <div className="page-intro">
        <div>
          <div className="eyebrow">Workspace</div>
          <h1>Sites</h1>
          <p>Manage your organisation&apos;s buildings, floors, and areas.</p>
        </div>
        <div className="intro-actions">
          <button className="button secondary" onClick={onPurchase}>
            <Coins size={15} /> Purchase tokens
          </button>
          <button className="button primary" onClick={onCreate}>
            <Plus size={16} /> Create site
          </button>
        </div>
      </div>
      <TokenSummaryGrid siteCount={sites.length} tokens={tokens} />
      {tokens.available < 1 && (
        <div className="callout warning">
          <Coins size={16} />
          <span>
            You have no available tokens. Purchase tokens to create another
            site.
          </span>
          <button className="button secondary" onClick={onPurchase}>
            Purchase tokens
          </button>
        </div>
      )}
      <div className="sites-layout">
        <section className="panel sites-list-panel">
          <div className="toolbar">
            <div className="search-input">
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sites..."
                aria-label="Search sites"
              />
            </div>
          </div>
          <div className="site-card-list">
            {filtered.length ? (
              filtered.map((site) => (
                <SiteCard
                  key={site.id}
                  site={site}
                  highlighted={hovered === site.id}
                  onOpen={onOpenSite}
                  onHover={setHovered}
                />
              ))
            ) : (
              <EmptyState text="No sites match your search." />
            )}
          </div>
        </section>
        <section className="panel map-panel">
          <SitesMap
            sites={filtered}
            highlightedId={hovered}
            onOpen={onOpenSite}
            onHover={setHovered}
          />
        </section>
      </div>
      <TokenHistory transactions={transactions} />
    </div>
  );
};

export default SitesOverview;
