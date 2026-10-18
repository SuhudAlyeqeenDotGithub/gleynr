import { Search } from "lucide-react";

type EmptyStateProps = {
  text: string;
};

const EmptyState = ({ text }: EmptyStateProps) => (
  <div className="empty-state">
    <Search size={22} />
    <p>{text}</p>
  </div>
);

export default EmptyState;
