import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import LogoutLink from "./index";
import { useAuth } from "../../Services/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../Routes";

// Mock the dependencies
vi.mock("../../Services/Auth/AuthContext");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("LogoutLink", () => {
  const mockLogout = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mocks
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      logout: mockLogout,
      currentUser: { uid: "test-user" },
      signup: vi.fn(),
      login: vi.fn(),
    });

    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);

    // Mock console methods
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders the logout link", () => {
    render(<LogoutLink />);

    const link = screen.getByText("Log out");
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass("link");
  });

  it("calls logout and navigates to initial route on successful logout", async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValue(undefined);

    render(<LogoutLink />);

    const link = screen.getByText("Log out");
    await user.click(link);

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("logged out");
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(Routes.INITIAL);
    });
  });

  it("handles logout errors gracefully", async () => {
    const user = userEvent.setup();
    const error = new Error("Logout failed");
    mockLogout.mockRejectedValue(error);

    render(<LogoutLink />);

    const link = screen.getByText("Log out");
    await user.click(link);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith("Failed to log out:", error);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("can be clicked multiple times", async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValue(undefined);

    render(<LogoutLink />);

    const link = screen.getByText("Log out");

    await user.click(link);
    await user.click(link);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });

  it("applies the correct CSS class", () => {
    render(<LogoutLink />);

    const link = screen.getByText("Log out");
    expect(link.tagName).toBe("A");
    expect(link).toHaveClass("link");
  });
});
