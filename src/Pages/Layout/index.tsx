import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import { NavigationMenu } from "../../stories";
import "./index.scss";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";

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
    <>
      <div className="layout-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <header>
          <NavigationMenu toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        </header>

        <main className="layout-container__main">
          <Outlet />
        </main>

        <footer className={"footerSection"}>
          <p className={"invitationText"}>
            Follow us on{" "}
            <a href="https://www.instagram.com/asowa.uk/" className={"handle"}>
              Instagram
            </a>{" "}
            and{" "}
            <a href="https://www.tiktok.com/@asowa.uk" className={"handle"}>
              TikTok
            </a>{" "}
            for the latest updates and news.
          </p>

          <div className="footerGrid">
            <div className="contactItem">
              <p>
                Contact us:{" "}
                <a href="mailto:hello@aso-wa.com">hello@aso-wa.com</a>
              </p>
            </div>

            <div className="footerLinks">
              <a href="/about-us">ABOUT US</a>
              <a href="/faq">FAQ</a>
              <a href="/privacy-policy">PRIVACY POLICY</a>
              <a href="/terms-and-conditions">TERMS & CONDITIONS</a>
              <a href="/mobile-terms-of-use">MOBILE TERMS OF USE</a>
              <a href="/cookie-policy">COOKIE POLICY</a>
              <a href="/community-guidelines">COMMUNITY GUIDELINES</a>
            </div>
          </div>

          <div className={"brandFooter"}>
            <h2 className={"footerLogo"}>OWN THE MOMENT</h2>
            <p className={"copyright"}>© 2026 ASO WA.</p>
          </div>
        </footer>
      </div>
      <Analytics />
    </>
  );
}
