import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import Typography from "./Typography";

describe("Typography Component", () => {
  it("renders the correct default tag (p) for p1 variant", () => {
    const { container } = render(<Typography variant="p1">Hello</Typography>);
    expect(container.querySelector("p")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("typography--p1");
  });

  it("renders the correct heading tag for h1 variant", () => {
    render(<Typography variant="h1">Heading 1</Typography>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("overrides the default tag when the 'as' prop is provided", () => {
    const { container } = render(
      <Typography variant="h1" as="span">
        Span Heading
      </Typography>
    );
    // Even though it's an h1 variant, it should be a span element
    expect(container.querySelector("span")).toBeInTheDocument();
    expect(container.querySelector("h1")).not.toBeInTheDocument();
  });

  it("correctly forwards the ref to the DOM element", () => {
    const ref = React.createRef<HTMLElement>();
    render(<Typography ref={ref}>Ref Test</Typography>);
    
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.textContent).toBe("Ref Test");
  });

  it("applies custom classNames alongside the base classes", () => {
    render(<Typography className="custom-margin">Text</Typography>);
    const element = screen.getByText("Text");
    
    expect(element).toHaveClass("typography");
    expect(element).toHaveClass("typography--p1"); // Default variant
    expect(element).toHaveClass("custom-margin");
  });
});