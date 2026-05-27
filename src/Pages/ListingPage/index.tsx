import { useEffect, useMemo, useState } from "react";
import HttpService from "../../Services/httpService";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import type { FlattenedListing, ListingRecord } from "./types";

import type { SizeOption, CategoryOption } from "../../listing.types";
import groupByKeyValue from "./utils/groupByKeyValue";
import ListingDisplayImage from "../../stories/ListingDisplayImage/ListingDisplayImage";
import Loading from "./Loading";
import FilterPanel from "./FilteringPanel";

type FilterSection = "category" | "size" | "colour" | "availability";

const ListingPage = () => {
  const navigate = useNavigate();
  const httpService = useMemo(() => new HttpService("Listings"), []);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [listingData, setListingData] = useState<FlattenedListing[]>([]);
  const [isDataError, setIsDataError] = useState(false);
  const [filteredData, setFilteredData] = useState<FlattenedListing[]>([]);
  const [activeGender, setActiveGender] = useState("Woman");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<
    CategoryOption[]
  >([]);
  const [selectedSizes, setSelectedSizes] = useState<SizeOption[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [expandedSections, setExpandedSections] = useState<FilterSection[]>([
    "category",
  ]);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoadingData(true);
      try {
        const data = (await httpService.fetchAllRecords()) as ListingRecord[];
        const flattenedData = data.map(({ id, createdTime, fields }) => ({
          ...fields,
          id,
          createdTime,
        }));
        setListingData(flattenedData);
        const defaultFilter = groupByKeyValue(flattenedData, "Gender", "Woman");
        setFilteredData(defaultFilter);
      } catch {
        setIsDataError(true);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchListings();
  }, [httpService]);

  useEffect(() => {
    let data = groupByKeyValue(listingData, "Gender", activeGender);

    if (selectedCategories.length > 0) {
      data = data.filter((item) =>
        item.Category?.some((cat: CategoryOption) =>
          selectedCategories.includes(cat),
        ),
      );
    }
    if (selectedSizes.length > 0) {
      data = data.filter((item) => selectedSizes.includes(item.Size));
    }
    if (selectedColours.length > 0) {
      data = data.filter((item) =>
        item.Colour?.some((col: string) => selectedColours.includes(col)),
      );
    }
    if (availableOnly) {
      data = data.filter((item) => item.Status === "available");
    }

    setFilteredData(data);
  }, [
    activeGender,
    selectedCategories,
    selectedSizes,
    selectedColours,
    availableOnly,
    listingData,
  ]);

  const toggleSection = (section: FilterSection) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const toggleCategory = (cat: CategoryOption) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const toggleSize = (size: SizeOption) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const toggleColour = (colour: string) => {
    setSelectedColours((prev) =>
      prev.includes(colour)
        ? prev.filter((c) => c !== colour)
        : [...prev, colour],
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColours([]);
    setAvailableOnly(false);
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedSizes.length +
    selectedColours.length +
    (availableOnly ? 1 : 0);

  const sharedFilterProps = {
    totalResults: filteredData.length,
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
  };

  if (isLoadingData) return <Loading />;

  if (isDataError) {
    return (
      <p>
        Unable to load listings at the moment. Please try again later or contact
        us if the problem persists.
      </p>
    );
  }

  return (
    <div className="listing-page">
      {/* Mobile filter toggle bar */}
      <div className="listing-page__mobile-filter-bar">
        <button
          className="listing-page__mobile-filter-btn"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <p>FILTER &amp; SORT</p>
          {activeFilterCount > 0 && (
            <span className="listing-page__mobile-filter-btn__badge">
              {activeFilterCount}
            </span>
          )}
        </button>
        <span className="listing-page__mobile-filter-bar__count">
          {filteredData.length} results
        </span>
      </div>

      {/* Mobile filter drawer overlay */}
      {isMobileFilterOpen && (
        <div className="listing-page__mobile-overlay">
          <div className="listing-page__mobile-drawer">
            <div className="listing-page__mobile-drawer__header">
              <span>FILTER &amp; SORT</span>
              <button
                className="listing-page__mobile-drawer__close"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="listing-page__mobile-drawer__body">
              <FilterPanel {...sharedFilterProps} />
            </div>
            <div className="listing-page__mobile-drawer__footer">
              <button
                className="listing-page__mobile-drawer__apply"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <p>SEE {filteredData.length} RESULTS</p>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="listing-page__layout">
        {/* Desktop sidebar */}
        <div className="listing-page__sidebar-wrapper">
          <FilterPanel {...sharedFilterProps} />
        </div>

        {/* Main content */}
        <div className="listing-page__main">
          {/* Gender tabs */}
          <div className="listing-page__container__filters">
            <button
              className="listing-page__container__filters__option"
              onClick={() => setActiveGender("Woman")}
              data-testid="women-filter-btn"
            >
              <p
                className={`listing-page__container__filters__option__name ${activeGender === "Woman" ? "active" : ""}`}
              >
                Womens
              </p>
            </button>
            <button
              className="listing-page__container__filters__option"
              onClick={() => setActiveGender("Man")}
              data-testid="men-filter-btn"
            >
              <p
                className={`listing-page__container__filters__option__name ${activeGender === "Man" ? "active" : ""}`}
              >
                Mens
              </p>
            </button>
          </div>

          {/* Listings grid */}
          <div className="listing-page__container__listings">
            {filteredData.length === 0 ? (
              <p className="listing-page__no-results">
                No listings match your filters.
              </p>
            ) : (
              filteredData.map((data) => (
                <div
                  key={data.id}
                  onClick={() => navigate(`/listing/${data.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <ListingDisplayImage
                    imageUrl={data.Images?.[0]?.url}
                    title={data.Title}
                    subtitle={`£${data.Price?.toFixed(2) ?? "0.00"}`}
                    listingId={data.id}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
