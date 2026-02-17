import "./Button.scss";

import "./Button.scss";
import { Link } from "react-router-dom";

const Button = ({
    type = "button",
    variant = "primary", //primary, secondary, delete
    disabled = false,
    isLink = false,
    to,
    className = "",
    children,
    ...props
}) => {
    let combinedClassName = "button button--" + variant;
    if (className) combinedClassName += " " + className;

    if (isLink) {
        return (
            <Link to={to} className={combinedClassName} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={combinedClassName}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
