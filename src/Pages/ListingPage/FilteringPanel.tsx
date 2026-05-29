import type {
  CategoryOption,
  SizeOption,
  ColourOption,
} from "../../Constants/Listing/listing.constants";
import {
  CATEGORY_OPTIONS,
  SIZE_OPTIONS,
  COLOUR_OPTIONS,
} from "../../Constants/Listing/listing.constants";

export type SortOption = "date-desc" | "date-asc" | "price-asc" | "price-desc";

type FilterSection = "sort" | "category" | "size" | "colour" | "availability";

interface FilterPanelProps {
  totalResults: number;
  activeFilterCount: number;
  selectedCategories: CategoryOption[];
  selectedSizes: SizeOption[];
  selectedColours: ColourOption[];
  currentSort: SortOption;
  availableOnly: boolean;
  expandedSections: FilterSection[];
  setAvailableOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentSort: (sort: SortOption) => void;
  toggleSection: (section: FilterSection) => void;
  toggleCategory: (cat: CategoryOption) => void;
  toggleSize: (size: SizeOption) => void;
  toggleColour: (colour: ColourOption) => void;
  clearAllFilters: () => void;
}

const FilterPanel = ({
  totalResults,
  activeFilterCount,
  selectedCategories,
  selectedSizes,
  selectedColours,
  currentSort,
  availableOnly,
  expandedSections,
  setAvailableOnly,
  setCurrentSort,
  toggleSection,
  toggleCategory,
  toggleSize,
  toggleColour,
  clearAllFilters,
}: FilterPanelProps) => {
  return (
    <aside className="listing-page__sidebar">
      <div className="listing-page__sidebar__header">
        <span className="listing-page__sidebar__title">FILTERS & SORT</span>
        <span className="listing-page__sidebar__count">
          {totalResults} RESULTS
        </span>
      </div>

      {activeFilterCount > 0 && (
        <button
          className="listing-page__sidebar__clear"
          onClick={clearAllFilters}
        >
          <p>Clear all ({activeFilterCount})</p>
        </button>
      )}

      {/* Sorting Accordion Section */}
      <div className="listing-page__sidebar__section">
        <button
          className="listing-page__sidebar__section__heading"
          onClick={() => toggleSection("sort")}
        >
          <span>Sort By</span>
          <span
            className={`listing-page__sidebar__chevron ${expandedSections.includes("sort") ? "open" : ""}`}
          >
            &#8964;
          </span>
        </button>
        {expandedSections.includes("sort") && (
          <div className="listing-page__sidebar__section__options">
            <label className="listing-page__sidebar__radio-label">
              <input
                type="radio"
                name="sortOrder"
                checked={currentSort === "date-desc"}
                onChange={() => setCurrentSort("date-desc")}
              />
              <span>Newest First</span>
            </label>
            <label className="listing-page__sidebar__radio-label">
              <input
                type="radio"
                name="sortOrder"
                checked={currentSort === "date-asc"}
                onChange={() => setCurrentSort("date-asc")}
              />
              <span>Oldest First</span>
            </label>
            <label className="listing-page__sidebar__radio-label">
              <input
                type="radio"
                name="sortOrder"
                checked={currentSort === "price-asc"}
                onChange={() => setCurrentSort("price-asc")}
              />
              <span>Price: Low to High</span>
            </label>
            <label className="listing-page__sidebar__radio-label">
              <input
                type="radio"
                name="sortOrder"
                checked={currentSort === "price-desc"}
                onChange={() => setCurrentSort("price-desc")}
              />
              <span>Price: High to Low</span>
            </label>
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="listing-page__sidebar__section">
        <div className="listing-page__sidebar__section__toggle-row">
          <span className="listing-page__sidebar__section__label">
            Available Now
          </span>
          <button
            className={`listing-page__sidebar__toggle ${availableOnly ? "active" : ""}`}
            onClick={() => setAvailableOnly((v) => !v)}
            aria-pressed={availableOnly}
          >
            <span className="listing-page__sidebar__toggle__thumb" />
          </button>
        </div>
      </div>

      {/* Category */}
      <div className="listing-page__sidebar__section">
        <button
          className="listing-page__sidebar__section__heading"
          onClick={() => toggleSection("category")}
        >
          <span>Category</span>
          <span
            className={`listing-page__sidebar__chevron ${expandedSections.includes("category") ? "open" : ""}`}
          >
            &#8964;
          </span>
        </button>
        {expandedSections.includes("category") && (
          <div className="listing-page__sidebar__section__options">
            {CATEGORY_OPTIONS.map((cat) => (
              <label
                key={cat}
                className="listing-page__sidebar__checkbox-label"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Size */}
      <div className="listing-page__sidebar__section">
        <button
          className="listing-page__sidebar__section__heading"
          onClick={() => toggleSection("size")}
        >
          <span>Size</span>
          <span
            className={`listing-page__sidebar__chevron ${expandedSections.includes("size") ? "open" : ""}`}
          >
            &#8964;
          </span>
        </button>
        {expandedSections.includes("size") && (
          <div className="listing-page__sidebar__section__options listing-page__sidebar__section__options--sizes">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                className={`listing-page__sidebar__size-chip ${selectedSizes.includes(size) ? "active" : ""}`}
                onClick={() => toggleSize(size)}
              >
                <p>{size}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Colour */}
      <div className="listing-page__sidebar__section">
        <button
          className="listing-page__sidebar__section__heading"
          onClick={() => toggleSection("colour")}
        >
          <span>Colour</span>
          <span
            className={`listing-page__sidebar__chevron ${expandedSections.includes("colour") ? "open" : ""}`}
          >
            &#8964;
          </span>
        </button>
        {expandedSections.includes("colour") && (
          <div className="listing-page__sidebar__section__options">
            {COLOUR_OPTIONS.map((col) => (
              <label
                key={col}
                className="listing-page__sidebar__checkbox-label"
              >
                <input
                  type="checkbox"
                  checked={selectedColours.includes(col)}
                  onChange={() => toggleColour(col)}
                />
                <span>{col}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterPanel;
