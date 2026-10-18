import { Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type PageIntroProps = {
  icon: LucideIcon;
  title: string;
  sub: string;
  action: string;
  onAction: () => void;
};

const PageIntro = ({
  icon: Icon,
  title,
  sub,
  action,
  onAction,
}: PageIntroProps) => (
  <div className="page-intro">
    <div>
      <div className="eyebrow">
        <Icon size={14} /> Workspace
      </div>
      <h1>{title}</h1>
      <p>{sub}</p>
    </div>
    <button className="button primary" onClick={onAction}>
      <Plus size={16} /> {action}
    </button>
  </div>
);

export default PageIntro;
