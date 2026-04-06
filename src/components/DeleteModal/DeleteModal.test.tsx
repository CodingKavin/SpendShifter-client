import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteModal from "./DeleteModal";

describe("DeleteModal Component", () => {
  const mockOnCancel = vi.fn();
  const mockOnConfirm = vi.fn();
  const defaultProps = {
    deleteItem: "Starbucks",
    onCancel: mockOnCancel,
    onConfirm: mockOnConfirm,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "auto";
  });

  it("renders the correct text based on deleteItem prop", () => {
    render(<DeleteModal {...defaultProps} />);
    
    expect(screen.getByText(/Delete Starbucks expense?/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm that you’d like to delete the Starbucks/i)).toBeInTheDocument();
  });

  it("calls onCancel when the close button or cancel button is clicked", () => {
    const { rerender } = render(<DeleteModal {...defaultProps} />);
    
    fireEvent.click(screen.getByRole("button", { name: /close modal/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(2);
  });

  it("calls onConfirm when the delete button is clicked", () => {
    render(<DeleteModal {...defaultProps} />);
    
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("manages body overflow style for scroll locking", () => {
    const { unmount } = render(<DeleteModal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });
});