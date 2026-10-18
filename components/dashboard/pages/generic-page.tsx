import { ArrowUpRight } from "lucide-react";
import { GENERIC_PAGE_CONFIG } from "@/lib/dashboard/constants";
import type { ModalType } from "@/lib/dashboard/types";
import PageIntro from "../shared/page-intro";

type GenericPageProps = {
  active: string;
  onOpenModal: (modal: Exclude<ModalType, null>) => void;
};

const GenericPage = ({ active, onOpenModal }: GenericPageProps) => {
  const {
    icon: Icon,
    title,
    description,
    action,
  } = GENERIC_PAGE_CONFIG[active] ?? GENERIC_PAGE_CONFIG["Data imports"];
  const open = () => {
    if (active === "Plans & subscription") onOpenModal("plan");
    else if (active === "Data imports") onOpenModal("import");
    else if (active === "Users & permissions") onOpenModal("user");
  };

  return (
    <div className="page-content generic-page">
      <PageIntro
        icon={Icon}
        title={title}
        sub={description}
        action={action}
        onAction={open}
      />
      <section className="panel feature-page">
        <div className="feature-icon">
          <Icon size={24} />
        </div>
        <h2>
          {active === "Data imports"
            ? "Import event data"
            : `Manage ${title.toLowerCase()}`}
        </h2>
        <p>
          {active === "Data imports"
            ? "Start with a sample dataset to preview validation, mapping, and processing without uploading a real file."
            : "This demo workspace is fully interactive. Use the action above to make a simulated change and see the result reflected here."}
        </p>
        <div className="feature-cards">
          <div>
            <strong>Ready to use</strong>
            <span>
              All fields and controls are configured for this workspace.
            </span>
          </div>
          <div>
            <strong>Demo-safe</strong>
            <span>
              Changes are simulated locally and never sent to an external
              service.
            </span>
          </div>
        </div>
        <button className="button secondary" onClick={open}>
          Open {title.toLowerCase()} <ArrowUpRight size={14} />
        </button>
      </section>
    </div>
  );
};

export default GenericPage;
