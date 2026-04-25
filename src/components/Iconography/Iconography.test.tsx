import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Icon from "./Iconography";

describe("Icon Component", () => {
  it("renders a valid icon path", () => {
    const { container } = render(<Icon name="close" />);
    const svg = container.querySelector("svg");
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("icon--close");
  });

  it("returns null for a non-existent icon (Type Safety Check)", () => {
    const { container } = render(<Icon name={"invalid-name" as any} />);
    expect(container.firstChild).toBeNull();
  });

  it("spreads additional props onto the svg element", () => {
    render(<Icon name="edit" data-testid="custom-icon" aria-label="Edit Item" />);
    const svg = screen.getByTestId("custom-icon");
    
    expect(svg).toHaveAttribute("aria-label", "Edit Item");
  });
});