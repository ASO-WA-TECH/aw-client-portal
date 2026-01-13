import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import Logo from "../../stories/LogoImage";
import { NavigationMenu } from "../../stories";
import './index.scss';

export default function Layout() {
    const [darkMode, setDarkMode] = useState(() => {
        // Optional: persist theme
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(prev => !prev);

    return (
        <div className="layout-container">
            <header className="layout-container__header">
                <Logo width={100} height={90} />
                <NavigationMenu toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

            </header>

            <main className="layout-container__main">
                <Outlet />
            </main>

            <footer>
                <p>My footer</p>
            </footer>
        </div>
    );
}
