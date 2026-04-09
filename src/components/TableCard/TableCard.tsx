import {type ReactNode, type FC} from "react";
import "./TableCard.scss";

interface TableCardProps {
  children: ReactNode;
  className?: string;
}

const TableCard:FC<TableCardProps>  = ({ children, className = "" }) => {
  return <article className={`card ${className}`.trim()}>{children}</article>;
};

export default TableCard;
