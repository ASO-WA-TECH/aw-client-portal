import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import UserAccountPage from "./index";
import HttpServiceModule from "../../Services/httpService";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("../../Services/httpService");
vi.mock("../../Services/Auth/AuthContext", () => ({
  useAuth: () => ({ currentUser: { uid: "test-uid-123" } }),
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

const MockedHttpService = vi.mocked(HttpServiceModule);

function createMockHttpService(
  overrides: Partial<InstanceType<typeof HttpServiceModule>> = {},
): InstanceType<typeof HttpServiceModule> {
  return {
    tableName: "mock",

    fetchAllRecords: vi.fn(),
    fetchRecord: vi.fn(),
    createRecords: vi.fn(),
    updateRecord: vi.fn(),
    deleteRecord: vi.fn(),

    ...overrides,
  } as unknown as InstanceType<typeof HttpServiceModule>;
}

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockUser = {
  id: "recUser1",
  createdTime: "2026-01-01T00:00:00.000Z",
  fields: {
    auth_uid: "test-uid-123",
    Name: "Aso",
    Lastname: "Wasilewski",
    Email: "aso@example.com",
    Rentals: ["recRental1", "recRental2"],
    Listings: ["recListing1"],
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

const mockRental2 = {
  id: "recRental2",
  createdTime: "2026-04-27T15:21:26.000Z",
  fields: {
    Listing: ["recListing2"],
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

// ─── Helper ───────────────────────────────────────────────────────────────────

function setupHttpServiceMock() {
  const fetchAllRecords = vi.fn().mockResolvedValue([mockUser]);

  const fetchRecord = vi.fn().mockImplementation((id: string) => {
    if (id === "recRental1") return Promise.resolve(mockRental);
    if (id === "recRental2") return Promise.resolve(mockRental2);
    if (id === "recListing1") return Promise.resolve(mockListing);
    return Promise.resolve(null);
  });

  MockedHttpService.mockImplementation(() =>
    createMockHttpService({
      fetchAllRecords,
      fetchRecord,
    }),
  );

  return { fetchAllRecords, fetchRecord };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("UserAccountPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Loading ────────────────────────────────────────────────────────────────

  it("shows loading indicator while fetching data", () => {
    MockedHttpService.mockImplementation(() =>
      createMockHttpService({
        fetchAllRecords: () => new Promise(() => {}),
      }),
    );

    render(<UserAccountPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // ── Error ──────────────────────────────────────────────────────────────────

  it("shows error when user not found", async () => {
    MockedHttpService.mockImplementation(() =>
      createMockHttpService({
        fetchAllRecords: vi.fn().mockResolvedValue([]),
      }),
    );

    render(<UserAccountPage />);
    await waitFor(() =>
      expect(screen.getByText(/User not found/i)).toBeInTheDocument(),
    );
  });

  it("shows error on network failure", async () => {
    MockedHttpService.mockImplementation(() =>
      createMockHttpService({
        fetchAllRecords: vi.fn().mockRejectedValue(new Error("Network error")),
      }),
    );

    render(<UserAccountPage />);
    await waitFor(() =>
      expect(screen.getByText(/Network error/i)).toBeInTheDocument(),
    );
  });

  // ── Success ────────────────────────────────────────────────────────────────

  it("renders user name", async () => {
    setupHttpServiceMock();
    render(<UserAccountPage />);

    await waitFor(() =>
      expect(screen.getByText(/Aso W\./i)).toBeInTheDocument(),
    );
  });

  it("switches tabs correctly", async () => {
    setupHttpServiceMock();
    render(<UserAccountPage />);

    await waitFor(() => screen.getByText("RENTALS"));
    fireEvent.click(screen.getByText("RENTALS"));

    expect(screen.getByTestId("rentals")).toBeInTheDocument();
  });

  // ── Data ───────────────────────────────────────────────────────────────────

  it("fetches rental + listing data", async () => {
    const { fetchRecord } = setupHttpServiceMock();
    render(<UserAccountPage />);

    await waitFor(() => screen.getByTestId("account-details"));

    expect(fetchRecord).toHaveBeenCalledWith("recRental1");
    expect(fetchRecord).toHaveBeenCalledWith("recListing1");
  });

  it("handles empty rentals", async () => {
    const userNoRentals = {
      ...mockUser,
      fields: { ...mockUser.fields, Rentals: [], Listings: [] },
    };

    MockedHttpService.mockImplementation(() =>
      createMockHttpService({
        fetchAllRecords: vi.fn().mockResolvedValue([userNoRentals]),
      }),
    );

    render(<UserAccountPage />);

    await waitFor(() => screen.getByText("RENTALS"));
    fireEvent.click(screen.getByText("RENTALS"));

    expect(screen.getByText("Rentals: 0")).toBeInTheDocument();
  });

  it("handles failed rental fetch gracefully", async () => {
    MockedHttpService.mockImplementation(() =>
      createMockHttpService({
        fetchAllRecords: vi.fn().mockResolvedValue([mockUser]),
        fetchRecord: vi.fn().mockResolvedValue(null),
      }),
    );

    render(<UserAccountPage />);

    await waitFor(() => screen.getByTestId("account-details"));
    fireEvent.click(screen.getByText("RENTALS"));

    expect(screen.getByText("Rentals: 0")).toBeInTheDocument();
  });

  // ── Mobile ────────────────────────────────────────────────────────────────

  it("toggles mobile menu", async () => {
    setupHttpServiceMock();
    render(<UserAccountPage />);

    await waitFor(() => screen.getByTestId("account-details"));

    const header = document.querySelector(".mobile-header")!;
    fireEvent.click(header);

    expect(document.querySelector(".sidebar.open")).toBeInTheDocument();
  });
});
