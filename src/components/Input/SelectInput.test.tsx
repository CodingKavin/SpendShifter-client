import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SelectInput from "./SelectInput";

describe("SelectInput Component", () => {
  const mockOptions = [
    { value: "food", label: "Food" },
    { value: "housing", label: "Housing" },
    { value: "transport", label: "Transport" },
  ];
  const mockOnChange = vi.fn();

  it("renders with a label and links it to the select element via ID", () => {
    render(
      <SelectInput 
        label="Category" 
        options={mockOptions} 
        onChange={mockOnChange} 
        value="food" 
      />
    );
    
    const selectElement = screen.getByLabelText("Category") as HTMLSelectElement;
    expect(selectElement.id).toBe("category");
    expect(selectElement.tagName).toBe("SELECT");
  });

  it("renders the correct number of options from the props", () => {
    render(
      <SelectInput 
        label="Category" 
        options={mockOptions} 
        onChange={mockOnChange} 
        value="food" 
      />
    );
    
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    expect((options[0] as HTMLOptionElement).text).toBe("Food");
    expect((options[0] as HTMLOptionElement).value).toBe("food");
  });

  it("calls onChange when a new option is selected", () => {
    render(
      <SelectInput 
        label="Category" 
        options={mockOptions} 
        onChange={mockOnChange} 
        value="food" 
      />
    );
    
    const selectElement = screen.getByLabelText("Category");
    
    fireEvent.change(selectElement, { target: { value: "housing" } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("displays the error message and applies the error class", () => {
    const errorMsg = "Please select a valid category";
    render(
      <SelectInput 
        label="Category" 
        options={mockOptions} 
        error={errorMsg} 
        onChange={mockOnChange} 
        value="" 
      />
    );
    
    expect(screen.getByText(errorMsg)).toBeDefined();
    const selectElement = screen.getByLabelText("Category");
    expect(selectElement.className).toContain("input--error");
  });

  it("is disabled when the disabled prop is true", () => {
    render(
      <SelectInput 
        label="Category" 
        options={mockOptions} 
        disabled={true} 
        onChange={mockOnChange} 
        value="food" 
      />
    );
    
    const selectElement = screen.getByLabelText("Category") as HTMLSelectElement;
    expect(selectElement.disabled).toBe(true);
  });
});