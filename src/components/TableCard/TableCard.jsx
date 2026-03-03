import "./TableCard.scss";

const TableCard = ({ children, className = "" }) => {
  return <article className={`card ${className}`.trim()}>{children}</article>;
};

export default TableCard;
