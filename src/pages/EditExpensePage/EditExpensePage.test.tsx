import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditExpensePage from "./EditExpensePage";
import api from "../../utils/axios";
import type { Mock } from "vitest";

vi.mock("../../utils/axios", () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockExpense = {
  id: "123",
  user_id: "user_1",
  category: "Food",
  amount: 50.5,
  date: "2026-04-23T00:00:00Z",
  description: "Dinner",
  recurrence: "none"
};

describe("EditExpensePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays expense data correctly", async () => {
    (api.get as Mock).mockResolvedValueOnce({ data: mockExpense });

    render(
      <MemoryRouter initialEntries={["/expenses/123/edit"]}>
        <Routes>
          <Route path="/expenses/:id/edit" element={<EditExpensePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/expenses/123");
    });

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.getByText("Edit Expense")).toBeInTheDocument();
  });

  it("handles api errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (api.get as Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter initialEntries={["/expenses/123/edit"]}>
        <Routes>
          <Route path="/expenses/:id/edit" element={<EditExpensePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching expense:", expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
});