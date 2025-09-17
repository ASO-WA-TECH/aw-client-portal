import { routes } from "./routes";

import './index.scss'

interface Props {
    toggleDarkMode: () => void;
    darkMode: boolean
}

const DesktopNavigationMenu = ({ toggleDarkMode, darkMode }: Props) => {

    return (
        <nav className="navigation-menu__desktop" data-testid="desktop-menu">
            <ul className="navigation-menu__desktop__links">
                {routes.map((route) => {
                    const { Icon, href, title } = route;
                    return (
                        <li className="navigation-menu__desktop__links__item">
                            <a
                                href={href}
                                className="navigation-menu__desktop__links__item__link"
                            >
                                <Icon />
                                <span className="navigation-menu__desktop__links__item__link__text">{title}</span>
                            </a>
                        </li>
                    );
                })}
                <button onClick={toggleDarkMode} className="dark-mode-toggle" data-testid="darkmode-toggle">
                    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
            </ul>
        </nav>
    );
};

export default DesktopNavigationMenu