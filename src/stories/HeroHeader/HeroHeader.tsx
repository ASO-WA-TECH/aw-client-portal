import React from "react";
import PropTypes from "prop-types";
import "./HeroHeader.scss";

// Defining props
interface HeroHeaderProps {
  pageType: "login" | "register";
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ pageType }) => {
  const headerClass = `hero-header hero-header--${pageType}`;

  return (
    <header className={headerClass}>
      <div className="hero-header__content"></div>
    </header>
  );
};

// PropTypes for runtime type checking
HeroHeader.propTypes = {
  pageType: PropTypes.oneOf(["login", "register"]).isRequired,
};

export default HeroHeader;
