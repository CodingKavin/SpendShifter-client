import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TableRowHeader, { type TableHeader } from "./TableRowHeader";

describe("TableRowHeader", () => {

  const mockHeaders: TableHeader[] = [
    { label: "Name", key: "name", flex: 1 },
    { label: "Location", key: "location", flex: 1 },
  ];

  const mockData = [
    { id: 1, name: "Toronto Hub", location: "Ontario" },
    { id: 2, name: "Vancouver Depot", location: "BC" },
  ];

  const mockSetData = vi.fn();

  beforeEach(() => {
    mockSetData.mockClear();
  });

  it("renders all header labels plus the mandatory ACTIONS column", () => {
    render(
      <TableRowHeader 
        headers={mockHeaders} 
        data={mockData} 
        setData={mockSetData} 
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("ACTIONS")).toBeInTheDocument();
  });

  it("calls setData when a sort button is clicked", () => {
    render(
      <TableRowHeader 
        headers={mockHeaders} 
        data={mockData} 
        setData={mockSetData} 
      />
    );

    const sortByNameBtn = screen.getByLabelText("Sort by Name");
    fireEvent.click(sortByNameBtn);

    expect(mockSetData).toHaveBeenCalledTimes(1);
    
    expect(Array.isArray(mockSetData.mock.calls[0]![0])).toBe(true);
  });

  it("applies the correct flex styles to the header cells", () => {
    render(
      <TableRowHeader 
        headers={mockHeaders} 
        data={mockData} 
        setData={mockSetData} 
      />
    );

    const nameCell = screen.getByText("Name").closest(".table-row-header__cell");
    expect(nameCell).toHaveStyle({ flex: "1" });

    const actionsCell = screen.getByText("ACTIONS").closest(".table-row-header__cell");
    expect(actionsCell).toHaveStyle({ flex: "0.75" });
  });

  it("toggles the ascending state when clicking the same column twice", () => {
    render(
      <TableRowHeader 
        headers={mockHeaders} 
        data={mockData} 
        setData={mockSetData} 
      />
    );

    const sortBtn = screen.getByLabelText("Sort by Name");

    fireEvent.click(sortBtn);
    fireEvent.click(sortBtn);

    expect(mockSetData).toHaveBeenCalledTimes(2);
  });
});