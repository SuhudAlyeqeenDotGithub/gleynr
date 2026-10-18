import { MoreHorizontal } from "lucide-react";

const HealthPanel = () => (
  <section className="panel health-panel">
    <div className="panel-head">
      <div>
        <h2>Data health</h2>
        <p>System performance at a glance</p>
      </div>
      <button className="icon-button" aria-label="More health options">
        <MoreHorizontal size={17} />
      </button>
    </div>
    <div className="health-score">
      <div className="score-ring">
        <strong>98.6</strong>
        <span>%</span>
      </div>
      <div>
        <strong>Excellent</strong>
        <p>All systems operating normally</p>
      </div>
    </div>
    <div className="health-list">
      <div>
        <span>
          <i className="status-dot green" /> Events pipeline
        </span>
        <strong>99.8%</strong>
      </div>
      <div>
        <span>
          <i className="status-dot green" /> Data freshness
        </span>
        <strong>98.4%</strong>
      </div>
      <div>
        <span>
          <i className="status-dot amber" /> API availability
        </span>
        <strong>97.6%</strong>
      </div>
    </div>
  </section>
);

export default HealthPanel;
