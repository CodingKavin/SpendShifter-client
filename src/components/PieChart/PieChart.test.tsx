import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExpensePieChart from "./PieChart";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ data }: any) => (
    <div data-testid="pie-slices">
      {data?.map((entry: any, i: number) => (
        <span key={i}>{entry.category}: {entry.amount}</span>
      ))}
    </div>
  ),
  Cell: () => <div />,
  Legend: ({ payload }: any) => (
    <div data-testid="legend">
      {payload?.map((entry: any, i: number) => <span key={i}>{entry.value}</span>)}
    </div>
  ),
  Tooltip: () => <div />,
}));

describe("ExpensePieChart Component", () => {
  const mockData = [
    { category: "Food", amount: 100 },
    { category: "Rent", amount: 500 },
  ];

  it("renders the data points correctly", () => {
    render(<ExpensePieChart data={mockData} />);
    expect(screen.getByText(/Food: 100/i)).toBeDefined();
    expect(screen.getByText(/Rent: 500/i)).toBeDefined();
  });

  it("renders a 'No Expenses' fallback when data is empty", () => {
    render(<ExpensePieChart data={[]} />);
    const fallbacks = screen.getAllByText(/No Expenses/i);
    expect(fallbacks.length).toBeGreaterThan(0);
  });

  it("handles null or undefined data gracefully", () => {
    render(<ExpensePieChart data={null} />);
    const fallbacks = screen.getAllByText(/No Expenses/i);
    expect(fallbacks.length).toBeGreaterThan(0);
  });

  it("successfully triggers the resize logic without crashing", async () => {
    render(<ExpensePieChart data={mockData} />);
    
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    await act(async () => {
      window.dispatchEvent(new Event("resize"));
    });
    
    expect(screen.getByText(/Food: 100/i)).toBeDefined();
  });
});