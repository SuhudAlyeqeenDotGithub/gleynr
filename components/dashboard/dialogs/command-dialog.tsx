import { ArrowUpRight } from "lucide-react";
import { COMMAND_ITEMS } from "@/lib/dashboard/constants";
import ModalShell from "./modal-shell";

type CommandDialogProps = {
  onClose: () => void;
  onNavigate: (page: string) => void;
};

const CommandDialog = ({ onClose, onNavigate }: CommandDialogProps) => (
  <ModalShell title="Search workspace" onClose={onClose}>
    <div className="command-list">
      {COMMAND_ITEMS.map((item) => (
        <button
          key={item}
          onClick={() => {
            onNavigate(item);
            onClose();
          }}
        >
          {item}
          <ArrowUpRight size={15} />
        </button>
      ))}
    </div>
  </ModalShell>
);

export default CommandDialog;
