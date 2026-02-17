import "./Tags.scss";
import { Link } from "react-router-dom";

const Tags = ({
    status = "In Stock",
    className = "",
    ...props
}) => {
    const isInstock = status?.toLowerCase() === "in stock";
    const variant = isInstock ? "in-stock" : "out-of-stock";
    
    let combinedClassName = `tag tag--${variant}`;
    if (className) combinedClassName += ` ${className}`;

    return (
        <div className={combinedClassName} {...props}>
            {status.toUpperCase()}
        </div>
    );
};

export default Tags;