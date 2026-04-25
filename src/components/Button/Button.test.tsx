import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Button from "./Button";

describe("Button Component", () => {
  it("renders a standard button by default", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("button--primary");
  });

  it("renders as a link when isLink and to are provided", () => {
    render(
      <MemoryRouter>
        <Button isLink to="/dashboard">Go to Dashboard</Button>
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /go to dashboard/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("applies the secondary variant class", () => {
    render(<Button variant="secondary">Secondary Action</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("button--secondary");
  });

  it("is disabled when the disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("calls the onClick handler when clicked", async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);
  
  const button = screen.getByRole("button");
  fireEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
});