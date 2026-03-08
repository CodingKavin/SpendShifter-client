import { forwardRef } from "react";
import "./Typography.scss";

const Typography = forwardRef(
  ({ variant = "p1", as, className = "", children, ...props }, ref) => {
    const typographyVariant = {
      h1: "h1",
      h2: "h2",
      h3: "h3",
      h4: "h4",
      p1: "p",
      p2: "p",
      p3: "p",
    };

    const Tag = as || typographyVariant[variant] || "p";
    const baseClass = "typography";
    const variantClass = `${baseClass}--${variant}`;
    const combinedClassName = `${baseClass} ${variantClass}${
      className ? " " + className : ""
    }`.trim();

    return (
      <Tag ref={ref} className={combinedClassName} {...props}>
        {children}
      </Tag>
    );
  },
);

Typography.displayName = "Typography";

export default Typography;
