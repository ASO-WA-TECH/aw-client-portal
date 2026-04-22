import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import UserAccountPage from "./index";
import HttpService from "../../Services/httpService";

// Mock child components
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

const renderWithRouter = (initialUrl = "/account") => {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <UserAccountPage />
    </MemoryRouter>
  );
};

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
    renderWithRouter();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders account details tab by default", async () => {
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByTestId("account-details")).toBeInTheDocument()
    );

    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  it("respects tab from URL query params", async () => {
    renderWithRouter("/account?tab=rentals");

    await waitFor(() =>
      expect(screen.getByTestId("rentals")).toBeInTheDocument()
    );
  });

  it("displays user name in sidebar", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByTestId("account-details"));

    const sidebar = document.querySelector(".sidebar")!;
    expect(within(sidebar).getByText(/Jane/)).toBeInTheDocument();
  });

  it("switches to RENTALS tab on click", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByTestId("account-details"));

    fireEvent.click(screen.getByText("RENTALS"));

    expect(await screen.findByTestId("rentals")).toBeInTheDocument();
    expect(screen.queryByTestId("account-details")).not.toBeInTheDocument();
  });

  it("switches to LISTINGS tab on click", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByTestId("account-details"));

    fireEvent.click(screen.getByText("LISTINGS"));

    expect(await screen.findByTestId("listings")).toBeInTheDocument();
  });

  it("fetches and passes rentals correctly", async () => {
    renderWithRouter();

    fireEvent.click(await screen.findByText("RENTALS"));

    expect(await screen.findByText("Rentals: 1")).toBeInTheDocument();
  });

  it("fetches and passes listings correctly", async () => {
    renderWithRouter();

    fireEvent.click(await screen.findByText("LISTINGS"));

    expect(await screen.findByText("Listings: 1")).toBeInTheDocument();
  });

  it("shows error when user not found", async () => {
    (HttpService as vi.Mock).mockImplementation(() => ({
      fetchAllRecords: vi.fn().mockResolvedValue([]),
      fetchRecord: vi.fn(),
    }));

    renderWithRouter();

    expect(await screen.findByText(/User not found/)).toBeInTheDocument();
  });

  it("shows error when fetch fails", async () => {
    (HttpService as vi.Mock).mockImplementation(() => ({
      fetchAllRecords: vi.fn().mockRejectedValue(new Error("Network error")),
      fetchRecord: vi.fn(),
    }));

    renderWithRouter();

    expect(await screen.findByText(/Network error/)).toBeInTheDocument();
  });

  it("toggles mobile menu", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByTestId("account-details"));

    const mobileHeader = document.querySelector(".mobile-header")!;
    fireEvent.click(mobileHeader);

    expect(document.querySelector(".sidebar.open")).toBeInTheDocument();

    fireEvent.click(mobileHeader);
    expect(document.querySelector(".sidebar.open")).not.toBeInTheDocument();
  });

  it("closes mobile menu on nav click", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByTestId("account-details"));

    const mobileHeader = document.querySelector(".mobile-header")!;
    fireEvent.click(mobileHeader);

    fireEvent.click(screen.getByText("RENTALS"));

    expect(document.querySelector(".sidebar.open")).not.toBeInTheDocument();
  });
});