import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserAccountPage from "./index";
import HttpService from "../../Services/httpService";

// Mock child components so tests focus on UserAccountPage logic only
vi.mock("./components/AccountDetails", () => ({
  default: ({ userData }: { userData: { Name: string } }) => (
    <div data-testid="account-details">{userData.Name}</div>
  ),
}));

vi.mock("./components/Rentals", () => ({
  default: ({ rentals }: { rentals: unknown[] }) => (
    <div data-testid="rentals">Rentals: {rentals.length}</div>
  ),
}));

vi.mock("./components/Listings", () => ({
  default: ({ listings }: { listings: unknown[] }) => (
    <div data-testid="listings">Listings: {listings.length}</div>
  ),
}));

// Mock HttpService
vi.mock("../../Services/httpService");

const mockUser = {
  id: "user1",
  createdTime: "2024-01-01",
  fields: {
    UserId: 1,
    Name: "Jane",
    Lastname: "Doe",
    Email: "jane@example.com",
    Rentals: ["rental1"],
    Listings: ["listing1"],
  },
};

const mockRental = {
  id: "rental1",
  createdTime: "2024-01-01",
  fields: { Title: "Blue Dress", Price: 10 },
};

const mockListing = {
  id: "listing1",
  createdTime: "2024-01-01",
  fields: { Title: "Red Gown", Price: 20 },
};

describe("UserAccountPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default happy path mocks
    (HttpService as vi.Mock).mockImplementation((table: string) => ({
      fetchAllRecords: vi
        .fn()
        .mockResolvedValue(table === "Users" ? [mockUser] : []),
      fetchRecord: vi.fn().mockImplementation((id: string) => {
        if (id === "rental1") return Promise.resolve(mockRental);
        if (id === "listing1") return Promise.resolve(mockListing);
        return Promise.resolve(null);
      }),
    }));
  });

  it("shows loading state initially", () => {
    render(<UserAccountPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders account details tab by default after loading", async () => {
    render(<UserAccountPage />);
    await waitFor(() =>
      expect(screen.getByTestId("account-details")).toBeInTheDocument(),
    );
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  it("displays user name in sidebar", async () => {
    render(<UserAccountPage />);
    await waitFor(() => screen.getByTestId("account-details"));

    const sidebar = document.querySelector(".sidebar")!;
    expect(within(sidebar).getByText(/Jane/)).toBeInTheDocument();
  });

  it("switches to RENTALS tab on click", async () => {
    render(<UserAccountPage />);
    await waitFor(() => screen.getByTestId("account-details"));

    fireEvent.click(screen.getByText("RENTALS"));

    expect(screen.getByTestId("rentals")).toBeInTheDocument();
    expect(screen.queryByTestId("account-details")).not.toBeInTheDocument();
  });

  it("switches to LISTINGS tab on click", async () => {
    render(<UserAccountPage />);
    await waitFor(() => screen.getByTestId("account-details"));

    fireEvent.click(screen.getByText("LISTINGS"));

    expect(screen.getByTestId("listings")).toBeInTheDocument();
    expect(screen.queryByTestId("account-details")).not.toBeInTheDocument();
  });

  it("fetches and passes rentals to Rentals component", async () => {
    render(<UserAccountPage />);

    fireEvent.click(await screen.findByText("RENTALS"));

    await waitFor(() =>
      expect(screen.getByText("Rentals: 1")).toBeInTheDocument(),
    );
  });

  it("fetches and passes listings to Listings component", async () => {
    render(<UserAccountPage />);

    fireEvent.click(await screen.findByText("LISTINGS"));

    await waitFor(() =>
      expect(screen.getByText("Listings: 1")).toBeInTheDocument(),
    );
  });

  it("shows error message when user is not found", async () => {
    (HttpService as vi.Mock).mockImplementation(() => ({
      fetchAllRecords: vi.fn().mockResolvedValue([]), // no users returned
      fetchRecord: vi.fn(),
    }));

    render(<UserAccountPage />);

    await waitFor(() =>
      expect(screen.getByText(/User not found/)).toBeInTheDocument(),
    );
  });

  it("shows error message when fetch fails", async () => {
    (HttpService as vi.Mock).mockImplementation(() => ({
      fetchAllRecords: vi.fn().mockRejectedValue(new Error("Network error")),
      fetchRecord: vi.fn(),
    }));

    render(<UserAccountPage />);

    await waitFor(() =>
      expect(screen.getByText(/Network error/)).toBeInTheDocument(),
    );
  });

  it("toggles mobile menu open and closed", async () => {
    render(<UserAccountPage />);
    await waitFor(() => screen.getByTestId("account-details"));

    const mobileHeader = document.querySelector(".mobile-header")!; // ← target the div directly
    fireEvent.click(mobileHeader);

    expect(document.querySelector(".sidebar.open")).toBeInTheDocument();

    fireEvent.click(mobileHeader);
    expect(document.querySelector(".sidebar.open")).not.toBeInTheDocument();
  });

  it("closes mobile menu when a nav item is clicked", async () => {
    render(<UserAccountPage />);
    await waitFor(() => screen.getByTestId("account-details"));

    const mobileHeader = document.querySelector(".mobile-header")!; // ← same fix
    fireEvent.click(mobileHeader);
    fireEvent.click(screen.getByText("RENTALS"));

    expect(document.querySelector(".sidebar.open")).not.toBeInTheDocument();
  });
});
