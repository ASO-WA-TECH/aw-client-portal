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

const NavigationMenu: React.FC<NavigationMenuProps> = ({ darkMode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const { currentUser } = useAuth();

  return (
    <>
      <div className="header-logo">
        <a href="/">
          <Logo width={80} height={80} />
        </a>
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
                to="/listings"
                className="navigation-menu__desktop__links__item__link"
              >
                Listings
              </Link>
            </li>
            <li>
              <Link
                to="/how-it-works"
                className="navigation-menu__desktop__links__item__link"
              >
                How It Works
              </Link>
            </li>
            <li>
              {currentUser ? (
                <LogoutLink />
              ) : (
                <Link to="authenticate" className="link">
                  Login/ Sign up
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
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Account
                </Link>
              </li>
              <li className="navigation-menu__mobile__links__item">
                <Link
                  to="/listings"
                  className="navigation-menu__mobile__links__item__link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Listings
                </Link>
              </li>
              <li className="navigation-menu__mobile__links__item">
                <Link
                  to="/how-it-works"
                  className="navigation-menu__mobile__links__item__link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
              </li>
              <br />
              <li className="navigation-menu__mobile__links__item">
                {currentUser ? (
                  <LogoutLink className="navigation-menu__mobile__links__item" />
                ) : (
                  <a href="/authenticate" className="link">
                    <b>Login/ Sign up</b>
                  </a>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavigationMenu;
