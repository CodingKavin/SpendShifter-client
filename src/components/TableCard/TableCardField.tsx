import Typography from "../Typography/Typography";
import {type ReactNode, type FC} from "react";
import "./TableCard.scss";

interface TableCardFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

const TableCardField: FC<TableCardFieldProps> = ({ label, children, className = "" }) => {
  return (
    <div className={`card__field ${className}`.trim()}>
      <Typography className="card__label" variant="h4">
        {label}
      </Typography>
      <Typography className="card__value" variant="p2">
        {children}
      </Typography>
    </div>
  );
};

export default TableCardField;
