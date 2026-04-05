import "./Button.scss";
import { Link } from "react-router-dom";
import { type ReactNode, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "delete";
  isLink?: boolean;
  to?: string;
  children: ReactNode;
}

const Button = ({
  type = "button",
  variant = "primary", //primary, secondary, delete
  disabled = false,
  isLink = false,
  to,
  className = "",
  children,
  ...props
}: ButtonProps) => {
  let combinedClassName = "button button--" + variant;
  if (className) combinedClassName += " " + className;

  if (isLink && to) {
    return (
      <Link to={to} className={combinedClassName} {...props as any}>
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
