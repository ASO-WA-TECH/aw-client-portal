import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../LandingPage";
import HttpService from "../../Services/httpService";

// Mock the HttpService
const mockListings = [
  {
    id: "1",
    createdTime: "2024-01-01T00:00:00.000Z",
    fields: {
      Title: "Product 1",
      Price: 195.0,
      Gender: "Woman",
      Description: "Desc 1",
      Images: [{ url: "test1.jpg" }],
    },
  },
  {
    id: "2",
    createdTime: "2024-01-01T00:00:00.000Z",
    fields: {
      Title: "Product 2",
      Price: 80.0,
      Gender: "Man",
      Description: "Desc 2",
      Images: [{ url: "test2.jpg" }],
    },
  },
];

describe("LandingPage", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the JUST LANDED section heading", () => {
    // Wrap with MemoryRouter to fix the 'basename' error
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );
    const heading = screen.getByText(/JUST LANDED/i);
    expect(heading).toBeInTheDocument();
  });

  it("displays correct product prices after fetching", async () => {
    // Mock the fetch call to return our test data
    jest
      .spyOn(HttpService.prototype, "fetchAllRecords")
      .mockResolvedValue(mockListings);

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    // Because fetching is async, we must use waitFor or findBy
    await waitFor(() => {
      expect(screen.getByText(/£195/i)).toBeInTheDocument();
      expect(screen.getByText(/£80/i)).toBeInTheDocument();
    });
  });
});
