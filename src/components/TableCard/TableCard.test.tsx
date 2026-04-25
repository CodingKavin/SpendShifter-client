import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import TableCard from "./TableCard";
import TableCardField from "./TableCardField";
import TableCardActions from "./TableCardActions";

describe("TableCard Component Family", () => {
  
  describe("TableCard (Main Container)", () => {
    it("renders children and applies custom className correctly", () => {
      render(<TableCard className="custom-card">Test Content</TableCard>);
      
      const article = screen.getByRole("article");
      expect(article).toHaveClass("card", "custom-card");
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
  });

  describe("TableCardField", () => {
    it("renders the label and the value (children) correctly", () => {
      render(
        <TableCardField label="Category">
          <span>Groceries</span>
        </TableCardField>
      );

      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Groceries")).toBeInTheDocument();
    });
  });

  describe("TableCardActions", () => {
    const mockOnDelete = vi.fn();
    const editPath = "/edit/123";

    const renderActions = () =>
      render(
        <MemoryRouter>
          <TableCardActions editTo={editPath} onDelete={mockOnDelete} />
        </MemoryRouter>
      );

    it("triggers the onDelete function when the delete button is clicked", () => {
      renderActions();
      
      const deleteBtn = screen.getByLabelText("Delete");
      fireEvent.click(deleteBtn);
      
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it("has the correct edit path in the link", () => {
      renderActions();
      
      const editLink = screen.getByLabelText("Edit");
      expect(editLink).toHaveAttribute("href", editPath);
    });
  });

  describe("Integrated Structure", () => {
    it("renders the full card assembly without crashing", () => {
      render(
        <MemoryRouter>
          <TableCard>
            <TableCardField label="Amount">$50.00</TableCardField>
            <TableCardActions editTo="/edit" onDelete={() => {}} />
          </TableCard>
        </MemoryRouter>
      );

      expect(screen.getByText("Amount")).toBeInTheDocument();
      expect(screen.getByText("$50.00")).toBeInTheDocument();
      expect(screen.getByLabelText("Delete")).toBeInTheDocument();
    });
  });
});