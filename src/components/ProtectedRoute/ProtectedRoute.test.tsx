import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("ProtectedRoute", () => {
  const MockChild = () => <div>Protected Content</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state correctly", () => {
    (useAuth as any).mockReturnValue({ loading: true });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <MockChild />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeDefined();
  });

  it("redirects to login when not authenticated", () => {
    (useAuth as any).mockReturnValue({
      loading: false,
      isAuthenticated: false,
      isRecovering: false,
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MockChild />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/login page/i)).toBeDefined();
  });

  it("renders children when authenticated", () => {
    (useAuth as any).mockReturnValue({
      loading: false,
      isAuthenticated: true,
      isRecovering: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <MockChild />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/protected content/i)).toBeDefined();
  });
});