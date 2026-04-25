import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PageHeader from "./PageHeader";

describe("PageHeader Component", () => {
  it("renders the header text correctly", () => {
    const text = "Add New Expense";
    render(<PageHeader headerText={text} onBack={vi.fn()} />);
    
    expect(screen.getByText(text)).toBeDefined();
  });

  it("calls onBack when the back button is clicked", () => {
    const mockOnBack = vi.fn();
    render(<PageHeader headerText="Test" onBack={mockOnBack} />);
    
    const backButton = screen.getByLabelText("Go back");
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("renders the back button as type='button' to prevent form submission", () => {
    render(<PageHeader headerText="Test" onBack={vi.fn()} />);
    
    const backButton = screen.getByLabelText("Go back") as HTMLButtonElement;
    expect(backButton.type).toBe("button");
  });
});