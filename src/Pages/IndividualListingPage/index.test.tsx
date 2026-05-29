import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, test, beforeEach, expect } from "vitest";
import IndividualListingPage from ".";

// --- Mocks ---

const { mockFetchRecord, mockFetchAllRecords } = vi.hoisted(() => ({
  mockFetchRecord: vi.fn(),
  mockFetchAllRecords: vi.fn(),
}));

vi.mock("./index.scss", () => ({}));

vi.mock("../../Services/httpService", () => ({
  default: vi.fn().mockImplementation(() => ({
    fetchRecord: mockFetchRecord,
    fetchAllRecords: mockFetchAllRecords,
  })),
}));

vi.mock("./Image", () => ({
  default: ({ images, title }: { images: { url: string }[]; title: string }) =>
    images.length > 0 ? <img src={images[0].url} alt={title} /> : null,
}));

vi.mock("./LoadingListing", () => ({
  default: () => <div data-testid="loading-listing">Loading...</div>,
}));

vi.mock("../../Services/Auth/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { uid: "test-uid" },
  }),
}));

vi.stubEnv("VITE_ASO_WA_EMAIL", "aso.wa.uk@gmail.com");

// --- Test data ---

const mockListingData = {
  Title: "Test Product",
  Price: 49.99,
  Description: "This is a test description.",
  Images: [{ url: "https://example.com/test.jpg" }],
  Owner: ["owner-record-id"],
  Gender: "Man",
  Status: "available",
};

const mockOwnerFields = {
  Email: "owner@example.com",
  Name: "Test Owner",
};

const airtableRecord = <T,>(fields: T, id = "rec123") => ({
  id,
  createdTime: "2026-01-01T00:00:00.000Z",
  fields,
});

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/listing/123"]}>
      <Routes>
        <Route path="/listing/:id" element={<IndividualListingPage />} />
      </Routes>
    </MemoryRouter>,
  );

// --- Tests ---

describe("IndividualListingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchAllRecords.mockResolvedValue([]);
  });

  test("shows loading state while fetching", () => {
    mockFetchRecord.mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(screen.getByTestId("loading-listing")).toBeInTheDocument();
  });

  test("renders listing title, price and description after fetch", async () => {
    mockFetchRecord
      .mockResolvedValueOnce(airtableRecord(mockListingData))
      .mockResolvedValueOnce(airtableRecord(mockOwnerFields));

    renderPage();

    expect(await screen.findByText("TEST PRODUCT")).toBeInTheDocument();
    expect(screen.getByText(/Rent from £49.99 per day/i)).toBeInTheDocument();
    expect(screen.getByText(mockListingData.Description)).toBeInTheDocument();
  });

  test("shows error message when listing fetch fails", async () => {
    mockFetchRecord.mockRejectedValueOnce(new Error("Network error"));

    renderPage();

    expect(
      await screen.findByText(/unable to load listing/i),
    ).toBeInTheDocument();
  });

  test("shows error message when listing has no fields", async () => {
    mockFetchRecord.mockResolvedValueOnce(airtableRecord(null));

    renderPage();

    expect(
      await screen.findByText(/unable to load listing/i),
    ).toBeInTheDocument();
  });

  test("shows error when owner has no email", async () => {
    mockFetchRecord
      .mockResolvedValueOnce(airtableRecord(mockListingData))
      .mockResolvedValueOnce(airtableRecord({ Name: "No Email Owner" }));

    renderPage();

    expect(
      await screen.findByText(/unable to load listing/i),
    ).toBeInTheDocument();
  });

  test("renders ENQUIRE NOW button when status is available", async () => {
    mockFetchRecord
      .mockResolvedValueOnce(airtableRecord(mockListingData))
      .mockResolvedValueOnce(airtableRecord(mockOwnerFields));

    renderPage();

    expect(
      await screen.findByRole("button", { name: /enquire now/i }),
    ).toBeInTheDocument();
  });

  test("shows pending message when status is pending", async () => {
    mockFetchRecord
      .mockResolvedValueOnce(
        airtableRecord({ ...mockListingData, Status: "pending" }),
      )
      .mockResolvedValueOnce(airtableRecord(mockOwnerFields));

    renderPage();

    expect(
      await screen.findByText(/this item is currently being rented./i),
    ).toBeInTheDocument();
  });

  test("shows unavailable message when status is unavailable", async () => {
    mockFetchRecord
      .mockResolvedValueOnce(
        airtableRecord({ ...mockListingData, Status: "unavailable" }),
      )
      .mockResolvedValueOnce(airtableRecord(mockOwnerFields));

    renderPage();

    expect(
      await screen.findByText(/this item is currently being rented./i),
    ).toBeInTheDocument();
  });

  test("falls back to ASO_WA_EMAIL when listing has no owner", async () => {
    const noOwnerListing = { ...mockListingData, Owner: [] };

    mockFetchRecord.mockResolvedValueOnce(airtableRecord(noOwnerListing));

    renderPage();

    expect(
      await screen.findByRole("button", { name: /enquire now/i }),
    ).toBeInTheDocument();
  });

  test("renders listing image when image url is present", async () => {
    mockFetchRecord
      .mockResolvedValueOnce(airtableRecord(mockListingData))
      .mockResolvedValueOnce(airtableRecord(mockOwnerFields));

    renderPage();

    await waitFor(() => {
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "https://example.com/test.jpg");
    });
  });

  test("does not render image when no image url", async () => {
    const noImageListing = { ...mockListingData, Images: [] };

    mockFetchRecord
      .mockResolvedValueOnce(airtableRecord(noImageListing))
      .mockResolvedValueOnce(airtableRecord(mockOwnerFields));

    renderPage();

    await screen.findByText("TEST PRODUCT");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
