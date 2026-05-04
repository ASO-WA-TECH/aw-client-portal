import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import UserAccountPage from "./index";
import HttpService from "../../Services/httpService";

// ─── Mocks ────────────────────────────────────────────────────────────────────
vi.mock("../../Services/httpService");
vi.mock("./LoadingAccount", () => ({
  default: () => <div data-testid="loading-account">Loading...</div>,
}));
vi.mock("../../Services/Auth/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { uid: "firebase-uid-123", email: "jane@example.com" },
  }),
}));
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
vi.mock("./components/AddListing", () => ({
  default: () => <div data-testid="add-listing">Add Listing</div>,
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockUser = {
  id: "recUser1",
  createdTime: "2026-01-01T00:00:00.000Z",
  fields: {
    auth_uid: "firebase-uid-123",
    Name: "Jane",
    Lastname: "Doe",
    Email: "jane@example.com",
    Rentals: ["rental1"],
    Listings: ["listing1"],
  },
};

const mockRental = {
  id: "recRental1",
  createdTime: "2026-04-27T15:17:47.000Z",
  fields: {
    Listing: ["recListing1"],
    Rentee: ["recUser1"],
    Status: "Pending",
  },
};

const mockListing = {
  id: "recListing1",
  createdTime: "2026-01-01T00:00:00.000Z",
  fields: {
    Title: "Yellow Asoebi",
    Price: 10,
    Status: "available",
    Images: [{ url: "https://example.com/image.jpg" }],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderWithRouter = (initialUrl = "/account") =>
  render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <UserAccountPage />
    </MemoryRouter>,
  );

const setupDefaultMocks = () => {
  (HttpService as unknown as vi.Mock).mockImplementation((table: string) => ({
    fetchAllRecords: vi
      .fn()
      .mockResolvedValue(table === "Users" ? [mockUser] : []),
    fetchRecord: vi.fn().mockImplementation((id: string) => {
      if (id === "rental1") return Promise.resolve(mockRental);
      if (id === "listing1") return Promise.resolve(mockListing);
      return Promise.resolve(null);
    }),
    createRecords: vi.fn(),
    updateRecord: vi.fn(),
    deleteRecord: vi.fn(),
  }));
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("UserAccountPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();
  });

  it("shows loading state initially", () => {
    renderWithRouter();
    expect(screen.getByTestId("loading-account")).toBeInTheDocument();
  });

  it("renders account details tab by default", async () => {
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByTestId("account-details")).toBeInTheDocument(),
    );
    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  it("respects tab from URL query params", async () => {
    renderWithRouter("/account?tab=rentals");

    await waitFor(() =>
      expect(screen.getByTestId("rentals")).toBeInTheDocument(),
    );
  });

  it("displays user name in sidebar", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByTestId("account-details"));

    expect(screen.getByText(/Jane D\./i)).toBeInTheDocument();
  });

  it("switches to RENTALS tab on click", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByTestId("account-details"));

    fireEvent.click(screen.getByText("RENTALS"));

    expect(await screen.findByTestId("rentals")).toBeInTheDocument();
    expect(screen.queryByTestId("account-details")).not.toBeInTheDocument();
  });

    renderPage();

    await waitFor(() => screen.getByTestId("account-details"));

    fireEvent.click(screen.getByText("LISTINGS"));

    expect(await screen.findByTestId("listings")).toBeInTheDocument();
    expect(screen.queryByTestId("account-details")).not.toBeInTheDocument();
  });

  it("switches to ADD LISTING tab on click", async () => {
    renderWithRouter();

    await waitFor(() => screen.getByTestId("account-details"));

    fireEvent.click(screen.getByText("ADD LISTING"));

    expect(await screen.findByTestId("add-listing")).toBeInTheDocument();
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
    (HttpService as unknown as vi.Mock).mockImplementation(() => ({
      fetchAllRecords: vi.fn().mockResolvedValue([]),
      fetchRecord: vi.fn(),
      createRecords: vi.fn(),
      updateRecord: vi.fn(),
      deleteRecord: vi.fn(),
    }));

    renderWithRouter();

    expect(await screen.findByText(/User not found/i)).toBeInTheDocument();
  });

  it("shows error when fetch fails", async () => {
    (HttpService as unknown as vi.Mock).mockImplementation(() => ({
      fetchAllRecords: vi.fn().mockRejectedValue(new Error("Network error")),
      fetchRecord: vi.fn(),
      createRecords: vi.fn(),
      updateRecord: vi.fn(),
      deleteRecord: vi.fn(),
    }));

    renderWithRouter();

    expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
  });

  it("handles failed rental fetch gracefully", async () => {
    (HttpService as unknown as vi.Mock).mockImplementation((table: string) => ({
      fetchAllRecords: vi
        .fn()
        .mockResolvedValue(table === "Users" ? [mockUser] : []),
      fetchRecord: vi.fn().mockResolvedValue(null),
      createRecords: vi.fn(),
      updateRecord: vi.fn(),
      deleteRecord: vi.fn(),
    }));

    renderWithRouter();

    fireEvent.click(await screen.findByText("RENTALS"));

    expect(screen.getByText("Rentals: 0")).toBeInTheDocument();
  });

  it("toggles mobile menu open and closed", async () => {
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

    expect(document.querySelector(".sidebar.open")).toBeInTheDocument();

    fireEvent.click(screen.getByText("RENTALS"));

    expect(document.querySelector(".sidebar.open")).not.toBeInTheDocument();
  });
});
