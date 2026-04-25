import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UpdatePassPage from "./UpdatePassPage";
import * as validation from "../../utils/validation";

vi.mock("../../context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../utils/validation.js", () => ({
  validatePassword: vi.fn(),
  validateConfirmPassword: vi.fn(),
}));

describe("UpdatePassPage", () => {
  const mockUpdatePassword = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Standard mock implementation
    (useAuth as any).mockReturnValue({
      updatePassword: mockUpdatePassword,
      logout: mockLogout,
      isRecovering: true,
      isAuthenticated: false,
      loading: false,
    });

    (validation.validatePassword as any).mockReturnValue("");
    (validation.validateConfirmPassword as any).mockReturnValue("");

    // Mock scrollIntoView to prevent errors in JSDOM
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("renders loading state correctly", () => {
    (useAuth as any).mockReturnValue({ loading: true });
    render(
      <MemoryRouter>
        <UpdatePassPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("redirects if not in recovery mode", () => {
    (useAuth as any).mockReturnValue({ isRecovering: false, isAuthenticated: true, loading: false });
    render(
      <MemoryRouter>
        <UpdatePassPage />
      </MemoryRouter>
    );
    expect(screen.queryByText(/Update Your Password/i)).not.toBeInTheDocument();
  });

  it("updates state and validates on input change", () => {
    render(
      <MemoryRouter>
        <UpdatePassPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "NewPass123!" } });

    expect(validation.validatePassword).toHaveBeenCalledWith("NewPass123!");
  });

  it("prevents submission if validation fails", async () => {
    (validation.validatePassword as any).mockReturnValue("Weak password");

    render(
      <MemoryRouter>
        <UpdatePassPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(mockUpdatePassword).not.toHaveBeenCalled();
    });
  });

  it("successfully updates password and shows success message", async () => {
    mockUpdatePassword.mockResolvedValueOnce({});
    
    render(
      <MemoryRouter>
        <UpdatePassPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "ValidPass123!" } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: "ValidPass123!" } });

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    // Wait for the text to appear before worrying about the 2s redirect timer
    await waitFor(() => {
      expect(screen.getByText(/Password updated successfully/i)).toBeInTheDocument();
    });
  });

  it("displays server error message on failure", async () => {
    mockUpdatePassword.mockRejectedValueOnce({ message: "Link expired" });

    render(
      <MemoryRouter>
        <UpdatePassPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "ValidPass123!" } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: "ValidPass123!" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Link expired")).toBeInTheDocument();
    });
  });

  it("disables the submit button while submitting", async () => {
    // Keep the promise pending so it stays in "submitting" state
    mockUpdatePassword.mockReturnValueOnce(new Promise(() => {}));

    render(
      <MemoryRouter>
        <UpdatePassPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "ValidPass123!" } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: "ValidPass123!" } });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});