import type {
  CategoryOption,
  SizeOption,
} from "../../Constants/Listing/listing.constants";

const CATEGORIES: CategoryOption[] = [
  "Agbada",
  "Gele",
  "Iro and Buba",
  "Dress",
  "Top",
  "Skirt",
  "Corset",
  "Fila",
  "Kente",
  "Boubou",
  "Kaftan",
  "Kaba & Slit",
  "Kitenge",
  "Habesha",
];

const SIZES: SizeOption[] = ["XS", "S", "M", "L", "XL", "XXL"];

const COLOURS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Pink",
  "Purple",
  "Brown",
  "Gold",
  "Silver",
  "Multi",
];

type FilterSection = "category" | "size" | "colour" | "availability";

interface FilterPanelProps {
  totalResults: number;
  activeFilterCount: number;
  selectedCategories: CategoryOption[];
  selectedSizes: SizeOption[];
  selectedColours: string[];
  availableOnly: boolean;
  expandedSections: FilterSection[];
  setAvailableOnly: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSection: (section: FilterSection) => void;
  toggleCategory: (cat: CategoryOption) => void;
  toggleSize: (size: SizeOption) => void;
  toggleColour: (colour: string) => void;
  clearAllFilters: () => void;
}

const FilterPanel = ({
  totalResults,
  activeFilterCount,
  selectedCategories,
  selectedSizes,
  selectedColours,
  availableOnly,
  expandedSections,
  setAvailableOnly,
  toggleSection,
  toggleCategory,
  toggleSize,
  toggleColour,
  clearAllFilters,
}: FilterPanelProps) => {
  return (
    <aside className="listing-page__sidebar">
      <div className="listing-page__sidebar__header">
        <span className="listing-page__sidebar__title">FILTERS</span>
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
            {CATEGORIES.map((cat) => (
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
            {SIZES.map((size) => (
              <button
                key={size}
                className={`listing-page__sidebar__size-chip ${selectedSizes.includes(size) ? "active" : ""}`}
                onClick={() => toggleSize(size)}
              >
                <p> {size}</p>
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
            {COLOURS.map((col) => (
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
