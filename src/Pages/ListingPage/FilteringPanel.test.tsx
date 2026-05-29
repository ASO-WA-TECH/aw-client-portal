import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FilterPanel from "./FilteringPanel";
import type { SortOption } from "./FilteringPanel";
import type {
  CategoryOption,
  SizeOption,
  ColourOption,
} from "../../Constants/Listing/listing.constants";

type FilterSection = "sort" | "category" | "size" | "colour" | "availability";

const mockProps = {
  totalResults: 42,
  activeFilterCount: 0,
  selectedCategories: [] as CategoryOption[],
  selectedSizes: [] as SizeOption[],
  selectedColours: [] as ColourOption[],
  currentSort: "date-desc" as SortOption,
  availableOnly: false,
  expandedSections: ["category"] as FilterSection[],
  setAvailableOnly: vi.fn(),
  setCurrentSort: vi.fn(),
  toggleSection: vi.fn(),
  toggleCategory: vi.fn(),
  toggleSize: vi.fn(),
  toggleColour: vi.fn(),
  clearAllFilters: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("FilterPanel", () => {
  describe("Header", () => {
    it("renders the sidebar main title and result count", () => {
      render(<FilterPanel {...mockProps} />);
      expect(screen.getByText("FILTERS & SORT")).toBeInTheDocument();
      expect(screen.getByText("42 RESULTS")).toBeInTheDocument();
    });

    it("does not show clear button when no filters are active", () => {
      render(<FilterPanel {...mockProps} />);
      expect(screen.queryByText(/Clear all/)).not.toBeInTheDocument();
    });

    it("shows clear button with count when filters are active", () => {
      render(<FilterPanel {...mockProps} activeFilterCount={3} />);
      expect(screen.getByText("Clear all (3)")).toBeInTheDocument();
    });

    it("calls clearAllFilters when clear button is clicked", () => {
      render(<FilterPanel {...mockProps} activeFilterCount={2} />);
      fireEvent.click(screen.getByText("Clear all (2)"));
      expect(mockProps.clearAllFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe("Sort section", () => {
    it("renders sort heading", () => {
      render(<FilterPanel {...mockProps} />);
      expect(screen.getByText("Sort By")).toBeInTheDocument();
    });

    it("shows sort radio options when section is expanded", () => {
      render(<FilterPanel {...mockProps} expandedSections={["sort"]} />);
      expect(screen.getByLabelText("Newest First")).toBeInTheDocument();
      expect(screen.getByLabelText("Oldest First")).toBeInTheDocument();
      expect(screen.getByLabelText("Price: Low to High")).toBeInTheDocument();
      expect(screen.getByLabelText("Price: High to Low")).toBeInTheDocument();
    });

    it("hides sort options when section is collapsed", () => {
      render(<FilterPanel {...mockProps} expandedSections={[]} />);
      expect(screen.queryByLabelText("Newest First")).not.toBeInTheDocument();
    });

    it("calls setCurrentSort when a radio button is selected", () => {
      render(<FilterPanel {...mockProps} expandedSections={["sort"]} />);
      fireEvent.click(screen.getByLabelText("Oldest First"));
      expect(mockProps.setCurrentSort).toHaveBeenCalledWith("date-asc");
    });

    it("marks correct radio option as checked based on currentSort state", () => {
      render(
        <FilterPanel
          {...mockProps}
          expandedSections={["sort"]}
          currentSort="price-asc"
        />,
      );
      expect(screen.getByLabelText("Price: Low to High")).toBeChecked();
      expect(screen.getByLabelText("Newest First")).not.toBeChecked();
    });
  });

  describe("Availability toggle", () => {
    it("renders the Available Now toggle", () => {
      render(<FilterPanel {...mockProps} />);
      expect(screen.getByText("Available Now")).toBeInTheDocument();
    });

    it("toggle is not active by default", () => {
      render(<FilterPanel {...mockProps} />);
      const toggle = screen.getByRole("button", { pressed: false });
      expect(toggle).not.toHaveClass("active");
    });

    it("toggle has active class when availableOnly is true", () => {
      render(<FilterPanel {...mockProps} availableOnly={true} />);
      const toggle = screen.getByRole("button", { pressed: true });
      expect(toggle).toHaveClass("active");
    });

    it("calls setAvailableOnly when toggle is clicked", () => {
      render(<FilterPanel {...mockProps} />);
      const toggle = screen.getByRole("button", { pressed: false });
      fireEvent.click(toggle);
      expect(mockProps.setAvailableOnly).toHaveBeenCalledTimes(1);
    });
  });

  describe("Category section", () => {
    it("renders category heading", () => {
      render(<FilterPanel {...mockProps} />);
      expect(screen.getByText("Category")).toBeInTheDocument();
    });

    it("shows category options when section is expanded", () => {
      render(<FilterPanel {...mockProps} expandedSections={["category"]} />);
      expect(screen.getByText("Dress")).toBeInTheDocument();
      expect(screen.getByText("Gele")).toBeInTheDocument();
    });

    it("hides category options when section is collapsed", () => {
      render(<FilterPanel {...mockProps} expandedSections={[]} />);
      expect(screen.queryByText("Dress")).not.toBeInTheDocument();
    });

    it("calls toggleSection with 'category' when heading is clicked", () => {
      render(<FilterPanel {...mockProps} />);
      fireEvent.click(screen.getByText("Category"));
      expect(mockProps.toggleSection).toHaveBeenCalledWith("category");
    });

    it("calls toggleCategory when a category checkbox is changed", () => {
      render(<FilterPanel {...mockProps} expandedSections={["category"]} />);
      const dressCheckbox = screen.getByRole("checkbox", { name: "Dress" });
      fireEvent.click(dressCheckbox);
      expect(mockProps.toggleCategory).toHaveBeenCalledWith("Dress");
    });

    it("shows category as checked when it is selected", () => {
      render(
        <FilterPanel
          {...mockProps}
          expandedSections={["category"]}
          selectedCategories={["Dress"]}
        />,
      );
      const dressCheckbox = screen.getByRole("checkbox", { name: "Dress" });
      expect(dressCheckbox).toBeChecked();
    });

    it("shows category as unchecked when it is not selected", () => {
      render(<FilterPanel {...mockProps} expandedSections={["category"]} />);
      const dressCheckbox = screen.getByRole("checkbox", { name: "Dress" });
      expect(dressCheckbox).not.toBeChecked();
    });
  });

  describe("Size section", () => {
    it("renders size heading", () => {
      render(<FilterPanel {...mockProps} />);
      expect(screen.getByText("Size")).toBeInTheDocument();
    });

    it("shows size chips when section is expanded", () => {
      render(<FilterPanel {...mockProps} expandedSections={["size"]} />);
      expect(screen.getByText("M")).toBeInTheDocument();
      expect(screen.getByText("XL")).toBeInTheDocument();
    });

    it("hides size chips when section is collapsed", () => {
      render(<FilterPanel {...mockProps} expandedSections={[]} />);
      expect(screen.queryByText("XS")).not.toBeInTheDocument();
    });

    it("calls toggleSize when a size chip is clicked", () => {
      render(<FilterPanel {...mockProps} expandedSections={["size"]} />);
      fireEvent.click(screen.getByText("M"));
      expect(mockProps.toggleSize).toHaveBeenCalledWith("M");
    });

    it("applies active class to selected size chip", () => {
      render(
        <FilterPanel
          {...mockProps}
          expandedSections={["size"]}
          selectedSizes={["M"]}
        />,
      );
      const mChip = screen.getByText("M").closest("button");
      expect(mChip).toHaveClass("active");
    });

    it("does not apply active class to unselected size chip", () => {
      render(<FilterPanel {...mockProps} expandedSections={["size"]} />);
      const mChip = screen.getByText("M").closest("button");
      expect(mChip).not.toHaveClass("active");
    });
  });

  describe("Colour section", () => {
    it("renders colour heading", () => {
      render(<FilterPanel {...mockProps} />);
      expect(screen.getByText("Colour")).toBeInTheDocument();
    });

    it("shows colour options when section is expanded", () => {
      render(<FilterPanel {...mockProps} expandedSections={["colour"]} />);
      expect(screen.getByText("Black")).toBeInTheDocument();
      expect(screen.getByText("Gold")).toBeInTheDocument();
    });

    it("hides colour options when section is collapsed", () => {
      render(<FilterPanel {...mockProps} expandedSections={[]} />);
      expect(screen.queryByText("Black")).not.toBeInTheDocument();
    });

    it("calls toggleColour when a colour checkbox is changed", () => {
      render(<FilterPanel {...mockProps} expandedSections={["colour"]} />);
      fireEvent.click(screen.getByRole("checkbox", { name: "Black" }));
      expect(mockProps.toggleColour).toHaveBeenCalledWith("Black");
    });

    it("shows colour as checked when selected", () => {
      render(
        <FilterPanel
          {...mockProps}
          expandedSections={["colour"]}
          selectedColours={["Black"]}
        />,
      );
      expect(screen.getByRole("checkbox", { name: "Black" })).toBeChecked();
    });
  });

  describe("Multiple sections expanded", () => {
    it("renders options for all expanded sections simultaneously", () => {
      render(
        <FilterPanel
          {...mockProps}
          expandedSections={["category", "size", "colour"]}
        />,
      );
      expect(screen.getByText("Dress")).toBeInTheDocument();
      expect(screen.getByText("M")).toBeInTheDocument();
      expect(screen.getByText("Black")).toBeInTheDocument();
    });
  });
});
