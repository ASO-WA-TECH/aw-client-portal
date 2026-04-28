import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, beforeEach, test, expect } from "vitest";
import Details from "./Details";
import type { ListingFields } from "../ListingPage/types";

// --- Mocks — declared with vi.hoisted so they're available when vi.mock runs ---

const {
  mockFetchAllUsers,
  mockFetchAllRentals,
  mockCreateRecords,
  mockUpdateRecord,
} = vi.hoisted(() => ({
  mockFetchAllUsers: vi.fn(),
  mockFetchAllRentals: vi.fn(),
  mockCreateRecords: vi.fn(),
  mockUpdateRecord: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "rec123" }),
}));

vi.mock("../../Services/Auth/AuthContext", () => ({
  useAuth: () => ({ currentUser: { uid: "firebase-uid-123" } }),
}));

vi.mock("../../Services/httpService", () => ({
  default: vi.fn().mockImplementation((resource: string) => {
    if (resource === "Users") return { fetchAllRecords: mockFetchAllUsers };
    if (resource === "Rentals")
      return {
        fetchAllRecords: mockFetchAllRentals, // ← for duplicate check
        createRecords: mockCreateRecords,
      };
    if (resource === "Listings") return { updateRecord: mockUpdateRecord };
  }),
}));

// --- Test data ---

const mockListing: ListingFields = {
  Title: "Test Jacket",
  Price: 120,
  Description: "Warm jacket",
  Images: [],
  Gender: "Man",
  "Listing ID": 0,
  Owner: [],
  Category: "",
  Size: "",
  Status: "available",
  "Creation Date": "",
  Location: "",
};

const ownerEmail = "owner@test.com";

// --- Helpers ---

const renderDetails = (overrides: Partial<ListingFields> = {}) =>
  render(
    <Details
      listing={{ ...mockListing, ...overrides }}
      ownerEmail={ownerEmail}
    />,
  );

// --- Tests ---

describe("Details", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // No existing rentals for this user+listing by default
    mockFetchAllRentals.mockResolvedValue([]);

    mockFetchAllUsers.mockResolvedValue([
      { id: "airtable-user-1", fields: { auth_uid: "firebase-uid-123" } },
    ]);
    mockCreateRecords.mockResolvedValue({ id: "rental-1" });
    mockUpdateRecord.mockResolvedValue({});

    delete (window as unknown as { location: unknown }).location;
    (window as unknown as { location: { href: string } }).location = {
      href: "",
    };
  });

  // unchanged ─────────────────────────────────────────────────────────────────

  describe("initial render", () => {
    test("displays listing title in uppercase", () => {
      renderDetails();
      expect(screen.getByText("TEST JACKET")).toBeInTheDocument();
    });

    test("displays price per day", () => {
      renderDetails();
      expect(
        screen.getByText(/Rent from £120.00 per day/i),
      ).toBeInTheDocument();
    });

    test("displays description", () => {
      renderDetails();
      expect(screen.getByText("Warm jacket")).toBeInTheDocument();
    });

    test("displays Men for Gender Man", () => {
      renderDetails({ Gender: "Man" });
      expect(screen.getByText(/ASO WA Men/i)).toBeInTheDocument();
    });

    test("displays Women for other genders", () => {
      renderDetails({ Gender: "Woman" });
      expect(screen.getByText(/ASO WA Women/i)).toBeInTheDocument();
    });
  });

  describe("status rendering", () => {
    test("shows Rent Now button when status is Available", () => {
      renderDetails({ Status: "available" });
      expect(screen.getByText(/rent now/i)).toBeInTheDocument();
    });

    test("shows pending message when status is pending", () => {
      renderDetails({ Status: "pending" });
      expect(
        screen.getByText(/this item is currently pending/i),
      ).toBeInTheDocument();
      expect(screen.queryByText(/rent now/i)).not.toBeInTheDocument();
    });

    test("shows unavailable message when status is unavailable", () => {
      renderDetails({ Status: "unavailable" });
      expect(
        screen.getByText(/this item is currently unavailable/i),
      ).toBeInTheDocument();
      expect(screen.queryByText(/rent now/i)).not.toBeInTheDocument();
    });
  });

  // updated ────────────────────────────────────────────────────────────────────

  describe("handleInterestClick — duplicate check", () => {
    test("checks for existing rentals before proceeding", async () => {
      renderDetails();
      fireEvent.click(screen.getByText(/rent now/i));
      await waitFor(() => expect(mockFetchAllRentals).toHaveBeenCalledTimes(1));
    });

    test("does not create a rental if user already expressed interest", async () => {
      // Simulate an existing rental for this user + listing
      mockFetchAllRentals.mockResolvedValue([
        {
          id: "existing-rental",
          fields: {
            Rentee: ["airtable-user-1"],
            Listing: ["rec123"],
          },
        },
      ]);
      // Match the airtable user id to the firebase uid
      mockFetchAllUsers.mockResolvedValue([
        { id: "airtable-user-1", fields: { auth_uid: "firebase-uid-123" } },
      ]);

      renderDetails();
      fireEvent.click(screen.getByText(/rent now/i));

      await waitFor(() => expect(mockFetchAllRentals).toHaveBeenCalledTimes(1));

      expect(mockCreateRecords).not.toHaveBeenCalled();
      expect(mockUpdateRecord).not.toHaveBeenCalled();
    });

    test("proceeds to create rental if no duplicate exists", async () => {
      mockFetchAllRentals.mockResolvedValue([]); // no existing rentals

      renderDetails();
      fireEvent.click(screen.getByText(/rent now/i));

      await waitFor(() => expect(mockCreateRecords).toHaveBeenCalledTimes(1));
    });
  });

  describe("handleRent — happy path", () => {
    test("calls fetchAllRecords to look up the airtable user", async () => {
      renderDetails();
      fireEvent.click(screen.getByText(/rent now/i));
      await waitFor(() => expect(mockFetchAllUsers).toHaveBeenCalledTimes(1));
    });

    test("updates listing status to pending after rental created", async () => {
      renderDetails();
      fireEvent.click(screen.getByText(/rent now/i));
      await waitFor(() =>
        expect(mockUpdateRecord).toHaveBeenCalledWith({
          id: "rec123",
          fields: { Status: "pending" },
        }),
      );
    });

    test("shows pending message after successful rental", async () => {
      renderDetails();
      fireEvent.click(screen.getByText(/rent now/i));
      await waitFor(() =>
        expect(
          screen.getByText(/this item is currently pending/i),
        ).toBeInTheDocument(),
      );
    });
  });

  describe("handleRent — error cases", () => {
    test("does not proceed if no airtable user matches the firebase uid", async () => {
      mockFetchAllUsers.mockResolvedValue([]);

      renderDetails();
      fireEvent.click(screen.getByText(/rent now/i));

      await waitFor(() => expect(mockFetchAllUsers).toHaveBeenCalled());

      expect(mockCreateRecords).not.toHaveBeenCalled();
      expect(mockUpdateRecord).not.toHaveBeenCalled();
      expect(screen.getByText(/rent now/i)).toBeInTheDocument();
    });

    test("does not update listing if rental creation fails", async () => {
      mockCreateRecords.mockRejectedValue({
        response: { status: 422, data: {} },
      });

      renderDetails();
      fireEvent.click(screen.getByText(/rent now/i));

      await waitFor(() => expect(mockCreateRecords).toHaveBeenCalled());

      expect(mockUpdateRecord).not.toHaveBeenCalled();
    });
  });
});
