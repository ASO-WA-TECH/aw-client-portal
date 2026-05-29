interface GenderTabsProps {
  activeGender: string;
  onGenderChange: (gender: string) => void;
}

const GenderTabs = ({ activeGender, onGenderChange }: GenderTabsProps) => (
  <div className="listing-page__container__filters">
    <button
      className="listing-page__container__filters__option"
      onClick={() => onGenderChange("Woman")}
      data-testid="women-filter-btn"
    >
      <p
        className={`listing-page__container__filters__option__name ${
          activeGender === "Woman" ? "active" : ""
        }`}
      >
        Womens
      </p>
    </button>
    <button
      className="listing-page__container__filters__option"
      onClick={() => onGenderChange("Man")}
      data-testid="men-filter-btn"
    >
      <p
        className={`listing-page__container__filters__option__name ${
          activeGender === "Man" ? "active" : ""
        }`}
      >
        Mens
      </p>
    </button>
  </div>
);

export default GenderTabs;
