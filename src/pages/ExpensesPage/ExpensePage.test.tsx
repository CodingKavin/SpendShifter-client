import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ExpensesPage from "./ExpensesPage";
import api from "../../utils/axios";
import { useDeleteModal } from "../../hooks/useDeleteModal";

vi.mock("../../utils/axios");

vi.mock("../../hooks/useSearch", () => ({
  useSearch: (data: any) => ({
    searchString: "",
    setSearchString: vi.fn(),
    filteredArray: data,
  }),
}));

vi.mock("../../hooks/useDeleteModal", () => ({
  useDeleteModal: vi.fn(() => ({
    modalOpen: false,
    deleteItem: null,
    openDeleteModal: vi.fn(),
    closeDeleteModal: vi.fn(),
    confirmDelete: vi.fn(),
  })),
}));

const mockExpenses = [
  {
    id: "1",
    description: "Grocery",
    amount: 50.0,
    category: "Food",
    date: "2026-01-01T00:00:00.000Z",
    recurrence: "none",
  },
];

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <ExpensesPage />
    </BrowserRouter>
  );
};

describe("ExpensesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    (api.get as any).mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("renders expenses after successful fetch", async () => {
    (api.get as any).mockResolvedValue({ data: mockExpenses });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Grocery")).toBeInTheDocument();
      expect(screen.getByText("$50.00")).toBeInTheDocument();
    });
  });

  it("renders error message on fetch failure", async () => {
    (api.get as any).mockRejectedValue(new Error("Failed to load expenses"));
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Failed to load expenses")).toBeInTheDocument();
    });
  });

  it("renders empty state when no expenses exist", async () => {
    (api.get as any).mockResolvedValue({ data: [] });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/no expenses available/i)).toBeInTheDocument();
    });
  });

  it("navigates to add expense form when button clicked", async () => {
    (api.get as any).mockResolvedValue({ data: mockExpenses });
    renderComponent();

    const addBtn = await screen.findByText("+ Add Expense");
    fireEvent.click(addBtn);
    expect(window.location.pathname).toBe("/expenses/form/add");
  });

  it("calls openDeleteModal when delete action is triggered", async () => {
    const mockOpen = vi.fn();
    vi.mocked(useDeleteModal).mockReturnValue({
      modalOpen: false,
      deleteItem: null,
      openDeleteModal: mockOpen,
      closeDeleteModal: vi.fn(),
      confirmDelete: vi.fn(),
    });

    (api.get as any).mockResolvedValue({ data: mockExpenses });
    renderComponent();

    const groceryItem = await screen.findByText("Grocery");
    const card = groceryItem.closest(".expense-table__card") as HTMLElement;

    const deleteBtn = within(card).getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(mockOpen).toHaveBeenCalledWith(expect.objectContaining({
      description: "Grocery"
    }));
  });

  it("renders DeleteModal when modalOpen is true", async () => {
    vi.mocked(useDeleteModal).mockReturnValue({
      modalOpen: true,
      deleteItem: mockExpenses[0] as any,
      openDeleteModal: vi.fn(),
      closeDeleteModal: vi.fn(),
      confirmDelete: vi.fn(),
    });

    (api.get as any).mockResolvedValue({ data: mockExpenses });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/please confirm/i)).toBeInTheDocument();
      
      const modalContainer = screen.getByText(/please confirm/i).closest(".delete-modal__content") as HTMLElement;
      const confirmButton = within(modalContainer).getByRole("button", { name: /^delete$/i });
      
      expect(confirmButton).toBeInTheDocument();
      expect(confirmButton).toHaveClass("button--delete");
    });
  });
});