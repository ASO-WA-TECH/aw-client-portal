import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AddListing from "./index";

// --- Mocks ---

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockToastError = vi.fn();
const mockToastSuccess = vi.fn();
vi.mock("react-toastify", () => ({
  toast: {
    error: (msg: string) => mockToastError(msg),
    success: (msg: string) => mockToastSuccess(msg),
  },
}));

vi.mock("../../Services/Auth/AuthContext", () => ({
  useAuth: () => ({ currentUser: { uid: "test-uid" } }),
}));

const mockFetchAllRecords = vi.fn();
const mockCreateRecords = vi.fn();
vi.mock("../../Services/httpService", () => ({
  default: vi.fn().mockImplementation(() => ({
    fetchAllRecords: mockFetchAllRecords,
    createRecords: mockCreateRecords,
  })),
}));

vi.mock("../../Components/ImageUploader", () => ({
  default: () => <div data-testid="image-uploader" />,
}));

// --- Helpers ---

const renderComponent = () =>
  render(
    <MemoryRouter>
      <AddListing />
    </MemoryRouter>,
  );

// Labels aren't associated via htmlFor so we query by role/label text on the
// container, or use the label text to find the nearest sibling input.
const getInputByLabel = (labelText: RegExp) => {
  const label = screen
    .getAllByText(labelText)
    .find((el) => el.tagName === "LABEL" || el.closest("label") === null);
  const container = label?.closest(".input-field-container");
  return container?.querySelector("input, select, textarea") as HTMLElement;
};

const fillRequiredFields = () => {
  // Text inputs — find by their container label text
  fireEvent.change(getInputByLabel(/^title/i), {
    target: { value: "Test Agbada" },
  });
  fireEvent.change(getInputByLabel(/^description/i), {
    target: { value: "A beautiful agbada" },
  });
  // Dropdowns
  fireEvent.change(getInputByLabel(/^size/i), {
    target: { value: "M" },
  });
  fireEvent.change(getInputByLabel(/^gender/i), {
    target: { value: "Man" },
  });
  fireEvent.change(getInputByLabel(/^status/i), {
    target: { value: "available" },
  });
  // Text inputs
  fireEvent.change(getInputByLabel(/^location/i), {
    target: { value: "London" },
  });
  fireEvent.change(getInputByLabel(/^price/i), {
    target: { value: "10" },
  });
  // Checkboxes — these DO have proper for/id associations (for="checkbox-Black")
  fireEvent.click(document.getElementById("checkbox-Black")!);
  fireEvent.click(document.getElementById("checkbox-Agbada")!);
};

const fillTitleOnly = (title: string) => {
  fireEvent.change(getInputByLabel(/^title/i), {
    target: { value: title },
  });
};

// --- Tests ---

describe("AddListing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validation", () => {
    it("shows error toast if required fields are empty on submit", async () => {
      renderComponent();

      fireEvent.click(screen.getByTestId("button"));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          "Please fill all required fields.",
        );
      });
    });

    it("shows error toast if title exceeds 21 characters", async () => {
      renderComponent();

      fillTitleOnly("This title is way too long for the form");

      fireEvent.click(screen.getByTestId("button"));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          "Title must be 21 characters or less",
        );
      });
    });

    it("does not submit if title is exactly 21 characters and other fields are empty", async () => {
      renderComponent();

      fillTitleOnly("123456789012345678901"); // exactly 21 chars

      fireEvent.click(screen.getByTestId("button"));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          "Please fill all required fields.",
        );
        expect(mockCreateRecords).not.toHaveBeenCalled();
      });
    });
  });

  describe("successful submission", () => {
    it("calls createRecords and navigates to /listings on success", async () => {
      mockFetchAllRecords.mockResolvedValue([
        { id: "airtable-user-1", fields: { auth_uid: "test-uid" } },
      ]);
      mockCreateRecords.mockResolvedValue({});

      renderComponent();
      fillRequiredFields();

      fireEvent.click(screen.getByTestId("button"));

      await waitFor(() => {
        expect(mockCreateRecords).toHaveBeenCalled();
        expect(mockToastSuccess).toHaveBeenCalledWith(
          "Listing created successfully!",
        );
      });

      await waitFor(
        () => {
          expect(mockNavigate).toHaveBeenCalledWith("/listings");
        },
        { timeout: 2000 },
      );
    });
  });

  describe("error handling", () => {
    it("shows error toast if user record is not found", async () => {
      mockFetchAllRecords.mockResolvedValue([
        { id: "other-user", fields: { auth_uid: "different-uid" } },
      ]);

      renderComponent();
      fillRequiredFields();

      fireEvent.click(screen.getByTestId("button"));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith("User record not found.");
        expect(mockCreateRecords).not.toHaveBeenCalled();
      });
    });

    it("shows error toast if createRecords throws", async () => {
      mockFetchAllRecords.mockResolvedValue([
        { id: "airtable-user-1", fields: { auth_uid: "test-uid" } },
      ]);
      mockCreateRecords.mockRejectedValue(new Error("Network error"));

      renderComponent();
      fillRequiredFields();

      fireEvent.click(screen.getByTestId("button"));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          "Failed to create listing.",
        );
      });
    });

    it("shows error toast if fetchAllRecords throws", async () => {
      mockFetchAllRecords.mockRejectedValue(new Error("Network error"));

      renderComponent();
      fillRequiredFields();

      fireEvent.click(screen.getByTestId("button"));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith(
          "Failed to create listing.",
        );
      });
    });
  });

  describe("submit button state", () => {
    it("disables the button while saving", async () => {
      mockFetchAllRecords.mockImplementation(() => new Promise(() => {}));

      renderComponent();
      fillRequiredFields();

      const button = screen.getByTestId("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });
    });
  });
});
