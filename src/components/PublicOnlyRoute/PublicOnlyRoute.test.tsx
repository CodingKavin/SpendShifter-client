import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PublicOnlyRoute from "./PublicOnlyRoute";
import { useAuth } from "../../context/AuthContext";

vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("PublicOnlyRoute", () => {
  const MockGuestContent = () => <div>Login Form</div>;
  const MockDashboard = () => <div>User Dashboard</div>;
  const MockRecovery = () => <div>Update Password Page</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state correctly", () => {
    (useAuth as any).mockReturnValue({ loading: true });

    render(
      <MemoryRouter>
        <PublicOnlyRoute>
          <MockGuestContent />
        </PublicOnlyRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeDefined();
  });

  it("redirects to dashboard when user is already authenticated", () => {
    (useAuth as any).mockReturnValue({
      loading: false,
      isAuthenticated: true,
      isRecovering: false,
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <MockGuestContent />
              </PublicOnlyRoute>
            }
          />
          <Route path="/dashboard" element={<MockDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText(/login form/i)).toBeNull();
    expect(screen.getByText(/user dashboard/i)).toBeDefined();
  });

  it("redirects to update-password when isRecovering is true", () => {
    (useAuth as any).mockReturnValue({
      loading: false,
      isAuthenticated: false,
      isRecovering: true,
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <MockGuestContent />
              </PublicOnlyRoute>
            }
          />
          <Route path="/update-password" element={<MockRecovery />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/update password page/i)).toBeDefined();
  });

  it("renders children (Login Form) when user is a guest", () => {
    (useAuth as any).mockReturnValue({
      loading: false,
      isAuthenticated: false,
      isRecovering: false,
    });

    render(
      <MemoryRouter>
        <PublicOnlyRoute>
          <MockGuestContent />
        </PublicOnlyRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/login form/i)).toBeDefined();
  });
});