import { useEffect, useMemo, useState } from "react";
import HttpService from "../../Services/httpService";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./index.scss";
import type { FlattenedListing, ListingRecord } from "./types";
import type {
  SizeOption,
  CategoryOption,
  ColourOption,
} from "../../Constants/Listing/listing.constants";
import type { SortOption } from "./FilteringPanel";
import groupByKeyValue from "./utils/groupByKeyValue";
import Loading from "./Loading";
import FilterPanel from "./FilteringPanel";
import MobileFilterBar from "./MobileFilterBar";
import GenderTabs from "./GenderTabs";
import ListingGrid from "./ListingGrid";

type FilterSection = "sort" | "category" | "size" | "colour" | "availability";

const ListingPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const httpService = useMemo(() => new HttpService("Listings"), []);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [listingData, setListingData] = useState<FlattenedListing[]>([]);
  const [isDataError, setIsDataError] = useState(false);
  const [filteredData, setFilteredData] = useState<FlattenedListing[]>([]);
  const [activeGender, setActiveGender] = useState("Woman");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<FilterSection[]>([]);

  const selectedCategories = useMemo(
    () => searchParams.getAll("category") as CategoryOption[],
    [searchParams],
  );
  const selectedSizes = useMemo(
    () => searchParams.getAll("size") as SizeOption[],
    [searchParams],
  );
  const selectedColours = useMemo(
    () => searchParams.getAll("colour") as ColourOption[],
    [searchParams],
  );
  const availableOnly = searchParams.get("available") === "true";
  const currentSort = (searchParams.get("sort") as SortOption) || "date-desc";

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
      } catch {
        setIsDataError(true);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchListings();
  }, [httpService]);

  // Combined Filters and Sort Logic Chain
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
        item.Colour?.some((col: ColourOption) => selectedColours.includes(col)),
      );
    }
    if (availableOnly) {
      data = data.filter((item) => item.Status === "available");
    }

    data = [...data].sort((a, b) => {
      if (currentSort === "date-desc") {
        return (
          new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
        );
      }
      if (currentSort === "date-asc") {
        return (
          new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime()
        );
      }
      if (currentSort === "price-asc") {
        return (a.Price || 0) - (b.Price || 0);
      }
      if (currentSort === "price-desc") {
        return (b.Price || 0) - (a.Price || 0);
      }
      return 0;
    });

    setFilteredData(data);
  }, [
    activeGender,
    selectedCategories,
    selectedSizes,
    selectedColours,
    availableOnly,
    currentSort,
    listingData,
  ]);

  // Param Mutation Closures
  const updateParams = (key: string, values: string[]) => {
    setSearchParams(
      (prev) => {
        prev.delete(key);
        values.forEach((val) => prev.append(key, val));
        return prev;
      },
      { replace: true },
    );
  };

  const toggleCategory = (cat: CategoryOption) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    updateParams("category", next);
  };

  const toggleSize = (size: SizeOption) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    updateParams("size", next.map(String));
  };

  const toggleColour = (colour: ColourOption) => {
    const next = selectedColours.includes(colour)
      ? selectedColours.filter((c) => c !== colour)
      : [...selectedColours, colour];
    updateParams("colour", next);
  };

  const setAvailableOnly = (
    valueUpdate: React.SetStateAction<boolean> | boolean,
  ) => {
    const nextValue =
      typeof valueUpdate === "function"
        ? valueUpdate(availableOnly)
        : valueUpdate;
    setSearchParams(
      (prev) => {
        if (nextValue) prev.set("available", "true");
        else prev.delete("available");
        return prev;
      },
      { replace: true },
    );
  };

  const setCurrentSort = (sort: SortOption) => {
    setSearchParams(
      (prev) => {
        prev.set("sort", sort);
        return prev;
      },
      { replace: true },
    );
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const toggleSection = (section: FilterSection) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
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
      <MobileFilterBar
        activeFilterCount={activeFilterCount}
        totalResults={filteredData.length}
        onOpenFilters={() => setIsMobileFilterOpen(true)}
      />

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
        <div className="listing-page__sidebar-wrapper">
          <FilterPanel {...sharedFilterProps} />
        </div>

        <div className="listing-page__main">
          <GenderTabs
            activeGender={activeGender}
            onGenderChange={setActiveGender}
          />
          <ListingGrid
            listings={filteredData}
            onItemClick={(id) => navigate(`/listing/${id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
