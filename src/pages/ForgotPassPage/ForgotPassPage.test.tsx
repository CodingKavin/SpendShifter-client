import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ForgotPassPage from "./ForgotPassPage";

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("ForgotPassPage", () => {
  const mockResetPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      resetPassword: mockResetPassword,
    });
    
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("renders the forgot password form", () => {
    render(
      <MemoryRouter>
        <ForgotPassPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Email/i })).toBeInTheDocument();
  });

  it("calls resetPassword with trimmed email on submit", async () => {
    mockResetPassword.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <ForgotPassPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Email/i);
    const button = screen.getByRole("button", { name: /Send Email/i });

    fireEvent.change(input, { target: { value: "  test@example.com  " } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith("test@example.com");
    });

    expect(screen.getByText(/If email is in our system/i)).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("displays error message on failure", async () => {
    const errorMessage = "Invalid email";
    mockResetPassword.mockRejectedValueOnce({ message: errorMessage });

    render(
      <MemoryRouter>
        <ForgotPassPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Email/i);
    const button = screen.getByRole("button", { name: /Send Email/i });

    fireEvent.change(input, { target: { value: "error@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    expect(input).toHaveValue("error@example.com");
  });

  it("disables the submit button while submitting", async () => {
    mockResetPassword.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(
      <MemoryRouter>
        <ForgotPassPage />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /Send Email/i });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});