import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginPage from "./LoginPage";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("LoginPage", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      login: mockLogin,
    });
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("calls login and navigates on success", async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays error message on login failure", async () => {
    const errorMessage = "Invalid email or password.";
    mockLogin.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes(errorMessage))).toBeInTheDocument();
    });
  });

  it("disables button while submitting", async () => {
    let resolveLogin: (value: unknown) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    mockLogin.mockReturnValueOnce(loginPromise);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /Login/i });
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password" } });
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    resolveLogin!(undefined);

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});