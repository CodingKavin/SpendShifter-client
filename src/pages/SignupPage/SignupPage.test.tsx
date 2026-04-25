import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SignupPage from "./SignupPage";
import * as validation from "../../utils/validation";

vi.mock("../../context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../utils/validation.js", () => ({
  validateName: vi.fn(),
  validateEmail: vi.fn(),
  validatePassword: vi.fn(),
  validateConfirmPassword: vi.fn(),
}));

describe("SignupPage", () => {
  const mockSignup = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      signup: mockSignup,
    });
    
    (validation.validateName as any).mockReturnValue("");
    (validation.validateEmail as any).mockReturnValue("");
    (validation.validatePassword as any).mockReturnValue("");
    (validation.validateConfirmPassword as any).mockReturnValue("");

    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("renders all input fields and the submit button", () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument();
  });

  it("updates state and validates on input change", async () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    expect(validation.validateName).toHaveBeenCalledWith("John Doe");
  });

  it("prevents submission if validation fails", async () => {
    (validation.validateEmail as any).mockReturnValue("Invalid email");

    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockSignup).not.toHaveBeenCalled();
    });
  });

  it("calls signup and shows success message on successful submission", async () => {
    mockSignup.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Password123!" } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: "Password123!" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
      expect(screen.getByText(/Account created!/i)).toBeInTheDocument();
    });
  });

  it("displays server error message on signup failure", async () => {
    mockSignup.mockRejectedValueOnce({ message: "User already exists" });

    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Password123!" } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: "Password123!" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
    });
  });

  it("disables the submit button while submitting", async () => {
    let resolveSignup: any;
    const pendingPromise = new Promise((resolve) => { resolveSignup = resolve; });
    mockSignup.mockReturnValueOnce(pendingPromise);

    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "Password123!" } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: "Password123!" } });

    const submitButton = screen.getByRole("button", { name: /Sign Up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    
    resolveSignup();
  });
});