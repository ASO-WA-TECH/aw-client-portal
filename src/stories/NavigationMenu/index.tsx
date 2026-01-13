import React, { useState } from "react";
import "./index.scss";

interface NavigationMenuProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  toggleDarkMode,
  darkMode,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className={`navigation-menu ${darkMode ? "dark" : ""}`}>
      {/* Desktop Menu */}
      <div className="navigation-menu__desktop" data-testid="desktop-menu">
        <ul className="navigation-menu__desktop__links">
          <li className="navigation-menu__desktop__links__item">
            <a href="/" className="navigation-menu__desktop__links__item__link">
              Home
            </a>
          </li>
        </ul>
      </div>

      {/* Hamburger Button (Closed State) */}
      {!isMobileMenuOpen && (
        <div className="navigation-menu__closed">
          <button
            className="navigation-menu__closed__hamburger-button"
            onClick={toggleMenu}
            data-testid="menu-button"
          >
            <span className="navigation-menu__closed__hamburger-button__bar"></span>
            <span className="navigation-menu__closed__hamburger-button__bar"></span>
            <span className="navigation-menu__closed__hamburger-button__bar"></span>
          </button>
        </div>
      )}

      {/* Mobile Menu (Open State) */}
      {isMobileMenuOpen && (
        <div className="navigation-menu__mobile" data-testid="mobile-menu">
          <button
            className="navigation-menu__mobile__close-button"
            onClick={toggleMenu}
          >
            X
          </button>
          <ul className="navigation-menu__mobile__links">
            <li className="navigation-menu__mobile__links__item">
              <a
                href="/"
                className="navigation-menu__mobile__links__item__link"
              >
                Home
              </a>
            </li>
            <li className="navigation-menu__mobile__links__item">
              <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavigationMenu;
