import { Building2, Coins, Gauge, PackageCheck } from "lucide-react";
import type { TokenSummary } from "@/lib/sites/types";
import StatTile from "../../shared/stat-tile";

type TokenSummaryProps = {
  siteCount: number;
  tokens: TokenSummary;
};

const TokenSummaryGrid = ({ siteCount, tokens }: TokenSummaryProps) => (
  <div className="metrics-grid" aria-label="Site token summary">
    <StatTile
      label="Purchased sites"
      value={siteCount}
      note="Sites created with tokens"
      icon={Building2}
    />
    <StatTile
      label="Tokens purchased"
      value={tokens.purchased}
      note="Lifetime total"
      icon={PackageCheck}
    />
    <StatTile
      label="Available tokens"
      value={tokens.available}
      note={
        tokens.available
          ? "Ready to create sites"
          : "Purchase more to add sites"
      }
      icon={Coins}
      tone={tokens.available ? "success" : "warning"}
    />
    <StatTile
      label="Tokens used"
      value={tokens.used}
      note="One per site"
      icon={Gauge}
    />
  </div>
);

export default TokenSummaryGrid;
