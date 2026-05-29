interface MobileFilterBarProps {
  activeFilterCount: number;
  totalResults: number;
  onOpenFilters: () => void;
}

const MobileFilterBar = ({
  activeFilterCount,
  totalResults,
  onOpenFilters,
}: MobileFilterBarProps) => (
  <div className="listing-page__mobile-filter-bar">
    <button className="listing-page__mobile-filter-btn" onClick={onOpenFilters}>
      <p>FILTER &amp; SORT</p>
      {activeFilterCount > 0 && (
        <span className="listing-page__mobile-filter-btn__badge">
          {activeFilterCount}
        </span>
      )}
    </button>
    <span className="listing-page__mobile-filter-bar__count">
      {totalResults} results
    </span>
  </div>
);

export default MobileFilterBar;
