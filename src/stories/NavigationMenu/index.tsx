import React, { useState } from "react";
import LogoutLink from "../../Components/LogoutLink/";
import Logo from "../../stories/LogoImage";
import "./index.scss";
import { useAuth } from "../../Services/Auth/AuthContext";
import { Link } from "react-router-dom";

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
  const { currentUser } = useAuth();

  return (
    <>
      <div className="header-logo">
        <Logo width={80} height={80} />
      </div>
      <nav className={`navigation-menu ${darkMode ? "dark" : ""}`}>
        {/* Desktop Menu */}
        <div className="navigation-menu__desktop" data-testid="desktop-menu">
          <ul className="navigation-menu__desktop__links">
            <li className="navigation-menu__desktop__links__item">
              <Link
                to="/"
                className="navigation-menu__desktop__links__item__link"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="navigation-menu__desktop__links__item__link"
              >
                My Account
              </Link>
            </li>
            <li>
              <Link
                to="/my-listings"
                className="navigation-menu__desktop__links__item__link"
              >
                My Listings
              </Link>
            </li>
            <li>
              {currentUser ? (
                <LogoutLink />
              ) : (
                <Link to="authenticate" className="link">
                  Login
                </Link>
              )}
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
                <Link
                  to="/account"
                  className="navigation-menu__mobile__links__item__link"
                >
                  My Account
                </Link>
              </li>
              <li className="navigation-menu__mobile__links__item">
                <Link
                  to="/my-listings"
                  className="navigation-menu__mobile__links__item__link"
                >
                  My Listings
                </Link>
              </li>
              <li className="navigation-menu__mobile__links__item">
                <Link
                  to="/faq"
                  className="navigation-menu__mobile__links__item__link"
                >
                  FAQ
                </Link>
              </li>
              <li className="navigation-menu__mobile__links__item">
                <Link
                  to="/"
                  className="navigation-menu__mobile__links__item__link"
                >
                  How it works
                </Link>
              </li>
              <br />
              <li className="navigation-menu__mobile__links__item">
                {currentUser ? (
                  <LogoutLink className="navigation-menu__mobile__links__item" />
                ) : (
                  <Link
                    to="authenticate"
                    className="link navigation-menu__mobile__links__item"
                  >
                    Login
                  </Link>
                )}
              </li>
              <li className="navigation-menu__mobile__links__item">
                <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavigationMenu;
