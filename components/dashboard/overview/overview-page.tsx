import {
  Activity,
  Building2,
  ChevronDown,
  Plus,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { Site } from "@/lib/dashboard/types";
import HealthPanel from "./health-panel";
import MetricCard from "./metric-card";
import SitePerformanceTable from "../sites/site-performance-table";
import VisitsChart from "./visits-chart";

type OverviewPageProps = {
  sites: Site[];
  onNavigate: (page: string) => void;
  onAddSite: () => void;
};

const OverviewPage = ({ sites, onNavigate, onAddSite }: OverviewPageProps) => {
  const total = sites.reduce((sum, site) => sum + site.visits, 0);

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <div className="eyebrow">
            <span className="live-dot" /> Live overview
          </div>
          <h1>Good morning, Alex</h1>
          <p>
            Here&apos;s what&apos;s happening across your organisation today.
          </p>
        </div>
        <div className="intro-actions">
          <button className="button secondary">
            <span className="dot-indicator" /> 01 Nov &ndash; 30 Nov 2024{" "}
            <ChevronDown size={15} />
          </button>
          <button className="button primary" onClick={onAddSite}>
            <Plus size={16} /> Add site
          </button>
        </div>
      </div>
      <div className="metrics-grid">
        <MetricCard
          label="Total visits"
          value={total.toLocaleString()}
          delta="12.8%"
          icon={Activity}
        />
        <MetricCard
          label="Events processed"
          value="2.4M"
          delta="8.4%"
          icon={Zap}
        />
        <MetricCard
          label="Active sites"
          value={sites.filter((site) => site.status === "Active").length}
          delta="2"
          icon={Building2}
        />
        <MetricCard
          label="Data health"
          value="98.6%"
          delta="0.4%"
          positive={false}
          icon={ShieldCheck}
        />
      </div>
      <div className="dashboard-grid">
        <VisitsChart />
        <HealthPanel />
      </div>
      <SitePerformanceTable
        sites={sites}
        onViewAll={() => onNavigate("Sites")}
      />
    </div>
  );
};

export default OverviewPage;
