import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import type { MockInstance } from "vitest";
import DashboardPage from "./DashboardPage";
import api from "../../utils/axios";

vi.mock("../../utils/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApi = api as any;

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { user_metadata: { full_name: "Kavin Paul" }, email: "kavin@rbc.com" },
  }),
}));

vi.mock("../../components/PieChart/PieChart", () => ({
  default: () => <div data-testid="mock-pie-chart" />,
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders initial dashboard data correctly", async () => {
    mockedApi.get.mockImplementation((url: string) => {
      if (url.includes("/expenses/summary")) {
        return Promise.resolve({ data: { total: 500, byCategory: [] } });
      }
      if (url.includes("/budgets")) {
        return Promise.resolve({ data: { budget: { amount: 1000 } } });
      }
      return Promise.resolve({ data: {} });
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Welcome Kavin Paul/i)).toBeDefined();
      expect(screen.getByText(/\$500\.00/i)).toBeDefined();
      expect(screen.getByText(/\$1000\.00/i)).toBeDefined();
    });
  });

  it("displays warning status when spending is high relative to budget", async () => {
    mockedApi.get.mockImplementation((url: string) => {
      if (url.includes("/expenses/summary")) {
        return Promise.resolve({ data: { total: 850, byCategory: [] } });
      }
      if (url.includes("/budgets")) {
        return Promise.resolve({ data: { budget: { amount: 1000 } } });
      }
      return Promise.resolve({ data: { total: 0 } });
    });

    const { container } = render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      const progressFill = container.querySelector(".dashboard__budget-progress-fill--warn");
      expect(progressFill).not.toBeNull();
    });
  });

  it("handles budget update submissions", async () => {
    mockedApi.get.mockResolvedValue({ 
      data: { total: 100, byCategory: [], budget: { amount: 1000 } } 
    });
    mockedApi.post.mockResolvedValue({ 
      data: { budget: { amount: 1500 } } 
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByPlaceholderText(/Enter Amount/i));

    const input = screen.getByPlaceholderText(/Enter Amount/i);
    const form = screen.getByRole("form");

    fireEvent.change(input, { target: { value: "1500" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith("/budgets", expect.objectContaining({
        amount: 1500
      }));
    });
  });

  it("renders error message on failed data fetch", async () => {
    mockedApi.get.mockRejectedValue(new Error("API Error"));

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/API Error/i)).toBeDefined();
    });
  });
});