import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Input from "./Input";

describe("Input Component", () => {
  const mockOnChange = vi.fn();

  it("renders with a string label and links it to the input via generated ID", () => {
    render(<Input label="Total Amount" onChange={mockOnChange} value="" />);
    
    const labelElement = screen.getByText("Total Amount");
    expect(labelElement).toBeDefined();

    const inputElement = screen.getByLabelText("Total Amount") as HTMLInputElement;
    expect(inputElement.id).toBe("total-amount");
  });

  it("prioritizes a custom ID over a generated one", () => {
    render(<Input label="Email" id="custom-email-id" onChange={mockOnChange} value="" />);
    
    const inputElement = screen.getByLabelText("Email") as HTMLInputElement;
    expect(inputElement.id).toBe("custom-email-id");
  });

  it("renders correctly when the label is a React component", () => {
    render(
      <Input 
        label={<span>Complex Label</span>} 
        onChange={mockOnChange} 
        value="" 
      />
    );
  
    expect(screen.getByText("Complex Label")).toBeDefined();
  });

  it("updates the value correctly when the user types", () => {
    render(<Input label="Description" onChange={mockOnChange} value="Lunch" />);
    
    const inputElement = screen.getByLabelText("Description") as HTMLInputElement;
    expect(inputElement.value).toBe("Lunch");
    
    fireEvent.change(inputElement, { target: { value: "Dinner" } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("displays an error message and applies the error class", () => {
    const errorMsg = "This field is required";
    render(<Input label="Amount" error={errorMsg} onChange={mockOnChange} value="" />);
    
    expect(screen.getByText(errorMsg)).toBeDefined();
    
    const inputElement = screen.getByLabelText("Amount");
    expect(inputElement.className).toContain("input--error");
  });

  it("disables the input when the disabled prop is true", () => {
    render(<Input label="Locked Field" disabled={true} onChange={mockOnChange} value="" />);
    
    const inputElement = screen.getByLabelText("Locked Field") as HTMLInputElement;
    expect(inputElement.disabled).toBe(true);
  });

  it("spreads additional props (like placeholder) to the native input", () => {
    render(
      <Input 
        label="Search" 
        placeholder="Type to search..." 
        onChange={mockOnChange} 
        value="" 
      />
    );
    
    const inputElement = screen.getByPlaceholderText("Type to search...");
    expect(inputElement).toBeDefined();
  });
});