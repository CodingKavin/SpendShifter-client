import { Link, type To } from "react-router-dom";
import {type FC, type MouseEventHandler} from "react";
import Iconography from "../Iconography/Iconography";
import "./TableCard.scss";

interface TableCardActionsProps {
  editTo: To;
  onDelete: MouseEventHandler<HTMLButtonElement>;
  className?: String;
}

const TableCardActions: FC<TableCardActionsProps> = ({ editTo, onDelete, className = "" }) => {
  return (
    <div className={`card__actions ${className}`}>
      <button
        type="button"
        className="card__icon-action card__delete-button"
        aria-label="Delete"
        onClick={onDelete}
      >
        <Iconography name="delete" />
      </button>

      <Link to={editTo} className="card__icon-action" aria-label="Edit">
        <Iconography name="edit" />
      </Link>
    </div>
  );
};

export default TableCardActions;
