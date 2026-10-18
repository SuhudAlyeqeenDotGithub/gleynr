import { ChevronDown } from "lucide-react";

const VisitsChart = () => (
  <section className="panel trend-panel">
    <div className="panel-head">
      <div>
        <h2>Visits over time</h2>
        <p>Aggregated visitor traffic across all sites</p>
      </div>
      <div className="legend">
        <span>
          <i className="legend-dot teal" /> Visits
        </span>
        <button className="select-button">
          Monthly <ChevronDown size={14} />
        </button>
      </div>
    </div>
    <div className="chart-wrap">
      <div className="chart-y">
        <span>60k</span>
        <span>40k</span>
        <span>20k</span>
        <span>0</span>
      </div>
      <div className="chart-area">
        <div className="grid-lines">
          <i />
          <i />
          <i />
          <i />
        </div>
        <svg
          viewBox="0 0 700 210"
          preserveAspectRatio="none"
          role="img"
          aria-label="Monthly visits trend"
        >
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity=".2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 175 C45 165 60 145 100 155 S150 125 190 140 S235 105 270 120 S320 95 355 112 S400 72 440 88 S475 55 520 72 S560 40 600 55 S650 30 700 22 L700 210 L0 210Z"
            fill="url(#fill)"
          />
          <path
            d="M0 175 C45 165 60 145 100 155 S150 125 190 140 S235 105 270 120 S320 95 355 112 S400 72 440 88 S475 55 520 72 S560 40 600 55 S650 30 700 22"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
          />
        </svg>
        <div className="chart-x">
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
        </div>
      </div>
    </div>
  </section>
);

export default VisitsChart;
