import { Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

type EntityTileProps = {
  icon: ReactNode;
  title: string;
  meta: ReactNode;
  footer?: ReactNode;
  onOpen?: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

// Compact card shared by floors and areas; the body is a button only when it can open a deeper view.
const EntityTile = ({
  icon,
  title,
  meta,
  footer,
  onOpen,
  onEdit,
  onDelete,
}: EntityTileProps) => {
  const body = (
    <>
      <span className="site-card-icon">{icon}</span>
      <span className="site-card-body">
        <strong>{title}</strong>
        <small>{meta}</small>
      </span>
    </>
  );

  return (
    <div className="entity-tile">
      {onOpen ? (
        <button
          className="entity-open"
          onClick={onOpen}
          aria-label={`Open ${title}`}
        >
          {body}
        </button>
      ) : (
        <div className="entity-open static">{body}</div>
      )}
      {footer && <div className="entity-footer">{footer}</div>}
      <div className="entity-actions">
        <button onClick={onEdit} aria-label={`Edit ${title}`}>
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} aria-label={`Delete ${title}`}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default EntityTile;
