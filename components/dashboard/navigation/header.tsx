import { useState } from "react";
import { Bell, Command, Menu, Moon, Search, Sun } from "lucide-react";
import type { StateSetter } from "@/lib/dashboard/types";
import CommandDialog from "@/components/dashboard/dialogs/command-dialog";
import { useDashboardContext } from "@/components/dashboard/dashboard-context";

type HeaderProps = {
  active: string;
  dark: boolean;
  setDark: StateSetter<boolean>;
  onToggleNavigation: () => void;
};

const Header = ({
  active,
  dark,
  setDark,
  onToggleNavigation,
}: HeaderProps) => {
  const [commandOpen, setCommandOpen] = useState(false);
  const { navigate } = useDashboardContext();

  return (
    <>
      <header className="topbar">
        <div className="crumb">
          <span>Workspace</span>
          <span className="slash">/</span>
          <strong>{active}</strong>
        </div>
        <div className="header-actions">
          <button
            className="icon-button mobile-nav-trigger"
            onClick={onToggleNavigation}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <button
            className="command-trigger"
            onClick={() => setCommandOpen(true)}
          >
            <Search size={15} />
            <span>Search</span>
            <kbd>
              <Command size={12} /> K
            </kbd>
          </button>
          <button
            className="icon-button"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="icon-button notification" aria-label="Notifications">
            <Bell size={17} />
            <i />
          </button>
          <div className="header-avatar">AL</div>
        </div>
      </header>
      {commandOpen && (
        <CommandDialog
          onClose={() => setCommandOpen(false)}
          onNavigate={navigate}
        />
      )}
    </>
  );
};

export default Header;
