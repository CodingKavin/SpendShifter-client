import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AddExpensePage from "./AddExpensePage";
import api from "../../utils/axios";

vi.mock("../../utils/axios");
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../components/ExpenseForm/ExpenseForm", () => ({
  default: ({ onSubmit, headerText }: any) => (
    <div>
      <h1>{headerText}</h1>
      <button 
        onClick={() => onSubmit({ 
          category: "Food", 
          amount: "50.25", 
          date: "2026-04-10", 
          description: "Grocery", 
          recurrence: "none" 
        })}
      >
        Mock Submit
      </button>
    </div>
  ),
}));

describe("AddExpensePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page with the correct header", () => {
    render(
      <MemoryRouter>
        <AddExpensePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Add Expense")).toBeInTheDocument();
  });

  it("converts string amount to number and redirects on successful submission", async () => {
    (api.post as any).mockResolvedValue({ data: { success: true } });

    render(
      <MemoryRouter>
        <AddExpensePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Mock Submit"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/expenses", {
        category: "Food",
        amount: 50.25,
        date: "2026-04-10",
        description: "Grocery",
        recurrence: "none",
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/expenses");
  });

  it("logs an error if the API call fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (api.post as any).mockRejectedValue(new Error("API Error"));

    render(
      <MemoryRouter>
        <AddExpensePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Mock Submit"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error adding expense:", expect.any(Error));
    });
    
    expect(mockNavigate).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});