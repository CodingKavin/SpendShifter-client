import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import * as AuthContext from "../../context/AuthContext";
import Navigation from "./Navigation";

describe("Navigation Component", () => {
  const mockLogout = vi.fn().mockResolvedValue(undefined);

  const setupAuthMock = (isAuthenticated: boolean) => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      isAuthenticated,
      logout: mockLogout,
      user: null,
      loading: false,
      isRecovering: false,
      signup: vi.fn(),
      login: vi.fn(),
      resetPassword: vi.fn(),
      updatePassword: vi.fn(),
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );
  };

  it("renders the brand name for all users", () => {
    setupAuthMock(false);
    renderComponent();
    expect(screen.getByText(/SpendShifter/i)).toBeDefined();
  });

  it("hides protected links when user is not logged in", () => {
    setupAuthMock(false);
    renderComponent();
    expect(screen.queryByText(/Dashboard/i)).toBeNull();
    expect(screen.queryByText(/Expenses/i)).toBeNull();
  });

  it("shows protected links when user is logged in", () => {
    setupAuthMock(true);
    renderComponent();
    expect(screen.getByText(/Dashboard/i)).toBeDefined();
    expect(screen.getByText(/Expenses/i)).toBeDefined();
  });

  it("toggles the logout dropdown when the profile icon is clicked", () => {
    setupAuthMock(true);
    const { container } = renderComponent();

    const profileBtn = container.querySelector('.navbar__profile--tablet button');
    if (!profileBtn) throw new Error("Could not find the Tablet Profile Button");

    expect(screen.queryByText(/Logout/i)).toBeNull();
    fireEvent.click(profileBtn);
    expect(screen.getByText(/Logout/i)).toBeDefined();
  });

  it("executes logout and closes dropdowns on logout click", async () => {
    setupAuthMock(true);
    const { container } = renderComponent();

    const profileBtn = container.querySelector('.navbar__profile--tablet button');
    if (!profileBtn) throw new Error("Could not find the Tablet Profile Button");
    
    fireEvent.click(profileBtn);
    const logoutBtn = screen.getByText(/Logout/i);
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it("closes dropdown when the Escape key is pressed", () => {
    setupAuthMock(true);
    const { container } = renderComponent();

    const profileBtn = container.querySelector('.navbar__profile--tablet button');
    if (!profileBtn) throw new Error("Could not find the Tablet Profile Button");

    fireEvent.click(profileBtn);
    expect(screen.getByText(/Logout/i)).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText(/Logout/i)).toBeNull();
  });
});