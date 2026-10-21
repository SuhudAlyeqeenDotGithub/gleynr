import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { label: string; onClick?: () => void };

const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav className="breadcrumb" aria-label="Breadcrumb">
    {items.map((item, index) => (
      <span key={item.label} className="breadcrumb-item">
        {index > 0 && <ChevronRight size={13} />}
        {item.onClick ? (
          <button onClick={item.onClick}>{item.label}</button>
        ) : (
          <span aria-current="page">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
