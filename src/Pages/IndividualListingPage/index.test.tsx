import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import IndividualListingPage from ".";
import HttpService from "../../Services/httpService";

const mockListingData = {
  Title: "Test Product",
  Price: 49.99,
  Description: "This is a test description.",
  Images: [{ url: "https://example.com/test.jpg" }],
  Owner: ["owner-record-id"],
  Gender: "Man",
};

const mockOwnerFields = {
  Email: "owner@example.com",
  Name: "Test Owner",
};

describe("IndividualListingPage", () => {
  beforeEach(() => {
    // Clear storage so "hasEnquired" is always false at the start of each test
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test("shows loading while fetching", () => {
    jest
      .spyOn(HttpService.prototype, "fetchRecord")
      .mockReturnValue(new Promise(() => {})); // Never resolves

    render(
      <MemoryRouter initialEntries={["/listing/123"]}>
        <Routes>
          <Route path="/listing/:id" element={<IndividualListingPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("loading-listing") || screen.getByText(/loading/i)
    ).toBeInTheDocument();
  });

  test("renders listing data correctly", async () => {
    jest
      .spyOn(HttpService.prototype, "fetchRecord")
      .mockResolvedValueOnce({ fields: mockListingData })
      .mockResolvedValueOnce({ fields: mockOwnerFields });

    render(
      <MemoryRouter initialEntries={["/listing/123"]}>
        <Routes>
          <Route path="/listing/:id" element={<IndividualListingPage />} />
        </Routes>
      </MemoryRouter>
    );

    const title = await screen.findByText(mockListingData.Title.toUpperCase());
    expect(title).toBeInTheDocument();

    expect(screen.getByText(/Rent from £49.99 per day/i)).toBeInTheDocument();
    expect(screen.getByText(mockListingData.Description)).toBeInTheDocument();
  });

  test("shows error message on fetch failure", async () => {
    jest
      .spyOn(HttpService.prototype, "fetchRecord")
      .mockRejectedValueOnce(new Error("Failed fetch"));

    render(
      <MemoryRouter initialEntries={["/listing/123"]}>
        <Routes>
          <Route path="/listing/:id" element={<IndividualListingPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/unable to load listing/i)).toBeInTheDocument()
    );
  });

  test("Rent Now link has correct mailto attributes", async () => {
    jest
      .spyOn(HttpService.prototype, "fetchRecord")
      .mockResolvedValueOnce({ fields: mockListingData })
      .mockResolvedValueOnce({ fields: mockOwnerFields });

    render(
      <MemoryRouter initialEntries={["/listing/123"]}>
        <Routes>
          <Route path="/listing/:id" element={<IndividualListingPage />} />
        </Routes>
      </MemoryRouter>
    );

    const rentLink = await screen.findByRole("link", { name: /RENT NOW/i });

    expect(rentLink).toHaveAttribute("href");
    const href = rentLink.getAttribute("href");

    expect(href).toContain(`mailto:${mockOwnerFields.Email}`);
    expect(href).toContain("bcc=aso.wa.uk@gmail.com");
    expect(href).toContain("subject=ASO%20WA%20-%20RENTAL%20REQUEST");
  });
});
