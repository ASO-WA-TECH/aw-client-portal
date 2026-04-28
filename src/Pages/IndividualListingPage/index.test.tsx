import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, test, beforeEach, expect } from "vitest";
import IndividualListingPage from ".";
import HttpService from "../../Services/httpService";

// Mock SCSS
vi.mock("./index.scss", () => ({}));

// Mock child components that aren't under test
vi.mock("./Image", () => ({
  default: ({ imageUrl, title }: { imageUrl: string; title: string }) => (
    <img src={imageUrl} alt={title} />
  ),
}));

vi.mock("./LoadingListing", () => ({
  default: () => <div data-testid="loading-listing">Loading...</div>,
}));

// Mock Auth
vi.mock("../../Services/Auth/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { uid: "test-uid" },
  }),
}));

// Mock import.meta.env
vi.stubEnv("VITE_ASO_WA_EMAIL", "aso.wa.uk@gmail.com");

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

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/listing/123"]}>
      <Routes>
        <Route path="/listing/:id" element={<IndividualListingPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe("IndividualListingPage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  test("shows loading state while fetching", () => {
    vi.spyOn(HttpService.prototype, "fetchRecord").mockReturnValue(
      new Promise(() => {}),
    );

    renderPage();

    expect(screen.getByTestId("loading-listing")).toBeInTheDocument();
  });

  test("renders listing title, price and description after fetch", async () => {
    vi.spyOn(HttpService.prototype, "fetchRecord")
      .mockResolvedValueOnce({ fields: mockListingData })
      .mockResolvedValueOnce({ fields: mockOwnerFields });

    renderPage();

    expect(await screen.findByText("TEST PRODUCT")).toBeInTheDocument();
    expect(screen.getByText(/Rent from £49.99 per day/i)).toBeInTheDocument();
    expect(screen.getByText(mockListingData.Description)).toBeInTheDocument();
  });

  test("shows error message when listing fetch fails", async () => {
    vi.spyOn(HttpService.prototype, "fetchRecord").mockRejectedValueOnce(
      new Error("Network error"),
    );

    renderPage();

    expect(
      await screen.findByText(/unable to load listing/i),
    ).toBeInTheDocument();
  });

  test("shows error message when listing has no fields", async () => {
    vi.spyOn(HttpService.prototype, "fetchRecord").mockResolvedValueOnce({
      fields: null,
    });

    renderPage();

    expect(
      await screen.findByText(/unable to load listing/i),
    ).toBeInTheDocument();
  });

  test("shows error when owner has no email", async () => {
    vi.spyOn(HttpService.prototype, "fetchRecord")
      .mockResolvedValueOnce({ fields: mockListingData })
      .mockResolvedValueOnce({ fields: { Name: "No Email Owner" } });

    renderPage();

    expect(
      await screen.findByText(/unable to load listing/i),
    ).toBeInTheDocument();
  });

  test("renders RENT NOW button when status is available", async () => {
    vi.spyOn(HttpService.prototype, "fetchRecord")
      .mockResolvedValueOnce({ fields: mockListingData })
      .mockResolvedValueOnce({ fields: mockOwnerFields });

    renderPage();

    expect(
      await screen.findByRole("button", { name: /rent now/i }),
    ).toBeInTheDocument();
  });

  test("shows pending message when status is pending", async () => {
    vi.spyOn(HttpService.prototype, "fetchRecord")
      .mockResolvedValueOnce({
        fields: { ...mockListingData, Status: "pending" },
      })
      .mockResolvedValueOnce({ fields: mockOwnerFields });

    renderPage();

    expect(
      await screen.findByText(/this item is currently pending/i),
    ).toBeInTheDocument();
  });

  test("shows unavailable message when status is unavailable", async () => {
    vi.spyOn(HttpService.prototype, "fetchRecord")
      .mockResolvedValueOnce({
        fields: { ...mockListingData, Status: "unavailable" },
      })
      .mockResolvedValueOnce({ fields: mockOwnerFields });

    renderPage();

    expect(
      await screen.findByText(/this item is currently unavailable/i),
    ).toBeInTheDocument();
  });

  test("clicking RENT NOW triggers rental flow and sets window.location.href", async () => {
    vi.spyOn(HttpService.prototype, "fetchRecord")
      .mockResolvedValueOnce({ fields: mockListingData })
      .mockResolvedValueOnce({ fields: mockOwnerFields });

    vi.spyOn(HttpService.prototype, "fetchAllRecords").mockResolvedValueOnce([
      { id: "airtable-user-id", fields: { auth_uid: "test-uid" } },
    ]);

    vi.spyOn(HttpService.prototype, "createRecords").mockResolvedValueOnce({});
    vi.spyOn(HttpService.prototype, "updateRecord").mockResolvedValueOnce();

    // Mock window.location.href setter
    const locationSpy = vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      href: "",
    } as Location);
    let capturedHref = "";
    Object.defineProperty(window, "location", {
      value: {
        ...window.location,
        set href(url: string) {
          capturedHref = url;
        },
        get href() {
          return capturedHref;
        },
      },
      writable: true,
    });

    renderPage();

    const rentButton = await screen.findByRole("button", { name: /rent now/i });
    await userEvent.click(rentButton);

    await waitFor(() => {
      expect(capturedHref).toContain(`mailto:${mockOwnerFields.Email}`);
      expect(capturedHref).toContain("Rental Request");
    });

    locationSpy.mockRestore();
  });

  test("falls back to ASO_WA_EMAIL when listing has no owner", async () => {
    const noOwnerListing = { ...mockListingData, Owner: [] };

    vi.spyOn(HttpService.prototype, "fetchRecord").mockResolvedValueOnce({
      fields: noOwnerListing,
    });

    renderPage();

    // RENT NOW button should still render (no owner fetch, no error)
    expect(
      await screen.findByRole("button", { name: /rent now/i }),
    ).toBeInTheDocument();
  });

  test("renders listing image when image url is present", async () => {
    vi.spyOn(HttpService.prototype, "fetchRecord")
      .mockResolvedValueOnce({ fields: mockListingData })
      .mockResolvedValueOnce({ fields: mockOwnerFields });

    renderPage();

    await waitFor(() => {
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", mockListingData.Images[0].url);
    });
  });

  test("does not render image when no image url", async () => {
    const noImageListing = { ...mockListingData, Images: [] };

    vi.spyOn(HttpService.prototype, "fetchRecord")
      .mockResolvedValueOnce({ fields: noImageListing })
      .mockResolvedValueOnce({ fields: mockOwnerFields });

    renderPage();

    await screen.findByText("TEST PRODUCT");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
