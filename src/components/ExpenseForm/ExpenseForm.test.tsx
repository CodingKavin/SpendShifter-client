import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExpenseForm from "./ExpenseForm";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("ExpenseForm Component", () => {
  const mockOnSubmit = vi.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    headerText: "Add New Expense",
  };

  it("renders all form fields with default values", () => {
    renderWithRouter(<ExpenseForm {...defaultProps} />);

    expect(screen.getByText("Add New Expense")).toBeDefined();
    expect(screen.getByLabelText(/Category/i)).toBeDefined();
    expect(screen.getByLabelText(/Amount/i)).toBeDefined();
    expect(screen.getByLabelText(/Date/i)).toBeDefined();
    expect(screen.getByLabelText(/Description/i)).toBeDefined();
  });

  it("shows validation error for invalid amount", async () => {
    renderWithRouter(<ExpenseForm {...defaultProps} />);
    
    const amountInput = screen.getByLabelText(/Amount/i);
    fireEvent.change(amountInput, { target: { value: "abc" } });
    
    const submitButton = screen.getByRole("button", { name: /Add Expense/i });
    expect(submitButton).toBeDisabled();
  });

  it("limits description to 36 characters", () => {
    renderWithRouter(<ExpenseForm {...defaultProps} />);
    
    const descInput = screen.getByLabelText(/Description/i) as HTMLInputElement;
    const longText = "This is a very long description that exceeds thirty six characters";
    
    fireEvent.change(descInput, { target: { value: longText } });
    
    expect(descInput.value).toHaveLength(36);
  });

  it("calls onSubmit with correct data when form is valid", async () => {
    renderWithRouter(<ExpenseForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: "50.00" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Grocery Trip" } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2026-04-10" } });
    
    const submitButton = screen.getByRole("button", { name: /Add Expense/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        amount: "50.00",
        description: "Grocery Trip",
        category: "Food"
      }));
    });
  });

  it("disables submit button if data is not dirty (Edit Mode)", () => {
    const initialData = {
      category: "Housing" as const,
      amount: "1200",
      date: "2026-04-01",
      description: "Rent",
      recurrence: "monthly" as const,
    };

    renderWithRouter(
      <ExpenseForm 
        initialData={initialData} 
        onSubmit={mockOnSubmit} 
        headerText="Edit Expense" 
      />
    );

    const submitButton = screen.getByRole("button", { name: /Update Expense/i });
    expect(submitButton).toBeDisabled();
  });
});