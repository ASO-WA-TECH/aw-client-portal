import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import { NavigationMenu } from "../../stories";
import "./index.scss";

export default function Layout() {
  const [darkMode, setDarkMode] = useState(() => {
    // Optional: persist theme
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className="layout-container">
      <header>
        <NavigationMenu toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </header>

      <main className="layout-container__main">
        <Outlet />
      </main>

      <footer className={"footerSection"}>
        <p className={"invitationText"}>
          Get to know <span className={"handle"}>@ASO.WA</span>
        </p>

        <div className="footerGrid">
          <div className="contactItem">
            <p>
              Contact us: <a href="mailto:aso.wa@gmail.com">aso.wa@gmail.com</a>
            </p>
          </div>

          <div className="footerLinks">
            <a href="/about-us">ABOUT US</a>
            <a href="/faq">FAQ</a>
            <a href="/privacy-policy">PRIVACY POLICY</a>
            <a href="/">TERMS & CONDITIONS</a>
            <a href="/terms-of-use">TERMS OF USE</a>
            <a href="/mobile-terms-of-use">MOBILE TERMS OF USE</a>
            <a href="/careers">CAREERS</a>
            <a href="/cookie-policy">COOKIE POLICY</a>
          </div>
        </div>

        <div className={"brandFooter"}>
          <h2 className={"footerLogo"}>ASO WA</h2>
          <p className={"copyright"}>© 2026 ASO WA.</p>
        </div>
      </footer>
    </div>
  );
}
