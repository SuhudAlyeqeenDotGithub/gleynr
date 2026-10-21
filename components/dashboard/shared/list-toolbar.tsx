import type { ReactNode } from "react";
import { Search } from "lucide-react";

type ListToolbarProps = {
  query: string;
  onQuery: (value: string) => void;
  placeholder: string;
  count: string;
  children?: ReactNode;
};

const ListToolbar = ({
  query,
  onQuery,
  placeholder,
  count,
  children,
}: ListToolbarProps) => (
  <div className="list-toolbar">
    <div className="search-input">
      <Search size={15} />
      <input
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
    {children}
    <span className="result-count" aria-live="polite">
      {count}
    </span>
  </div>
);

export default ListToolbar;
