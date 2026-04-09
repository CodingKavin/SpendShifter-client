import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TablesHeader from "./TablesHeader";

describe("TablesHeader", () => {
  const mockSetSearchString = vi.fn();
  const mockOnButtonClick = vi.fn();

  const defaultProps = {
    headerText: "Warehouses",
    buttonText: "Add New Warehouse",
    onButtonClick: mockOnButtonClick,
    searchString: "",
    setSearchString: mockSetSearchString,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the title and button text correctly", () => {
    render(<TablesHeader {...defaultProps} />);
    
    expect(screen.getByText("Warehouses")).toBeInTheDocument();
    expect(screen.getByText("Add New Warehouse")).toBeInTheDocument();
  });

  it("buffers the search input and only calls setSearchString on 'Enter'", () => {
    render(<TablesHeader {...defaultProps} />);
    const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Toronto Hub" } });
    
    expect(input.value).toBe("Toronto Hub");
    expect(mockSetSearchString).not.toHaveBeenCalled();

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockSetSearchString).toHaveBeenCalledWith("Toronto Hub");
  });

  it("calls setSearchString when the search icon button is clicked", () => {
    render(<TablesHeader {...defaultProps} />);
    const input = screen.getByPlaceholderText("Search...");
    
    const searchBtn = screen.getByLabelText("Submit search");

    fireEvent.change(input, { target: { value: "Vancouver Depot" } });
    fireEvent.click(searchBtn);

    expect(mockSetSearchString).toHaveBeenCalledWith("Vancouver Depot");
  });

  it("triggers onButtonClick when the main action button is clicked", () => {
    render(<TablesHeader {...defaultProps} />);
    const actionBtn = screen.getByText("Add New Warehouse");

    fireEvent.click(actionBtn);
    expect(mockOnButtonClick).toHaveBeenCalledTimes(1);
  });

  it("respects the disabled prop for the main action button", () => {
    render(<TablesHeader {...defaultProps} disabled={true} />);
    const actionBtn = screen.getByText("Add New Warehouse");
    
    expect(actionBtn).toBeDisabled();
  });
});