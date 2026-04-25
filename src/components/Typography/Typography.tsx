import { forwardRef } from "react";
import "./Typography.scss";

type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "p1" | "p2" | "p3";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
  children: React.ReactNode;
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ variant = "p1", as, className = "", children, ...props }, ref) => {
    const typographyVariant: Record<TypographyVariant, React.ElementType> = {
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
