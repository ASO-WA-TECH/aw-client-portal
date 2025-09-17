import { routes } from "./routes";

import './index.scss'
import Button from "../Button";

interface MobileNavigationMenuProps {
    setIsOpen: (isOpen: boolean) => void;
    toggleDarkMode: () => void;
    darkMode: boolean
}


const MobileNavigationMenu = ({ setIsOpen, toggleDarkMode, darkMode }: MobileNavigationMenuProps) => {
    return (
        <div className="navigation-menu__mobile" data-testid="mobile-menu">
            <Button customStyle="navigation-menu__mobile__close-button" handleClick={() => setIsOpen(false)} variant="tertiary" text="X" />
            <ul className="navigation-menu__mobile__links">
                {routes.map((route) => {
                    const { Icon, href, title } = route;
                    return (
                        <li className="navigation-menu__mobile__links__item">
                            <a
                                href={href}
                                className="navigation-menu__mobile__links__item__link"
                            >
                                <Icon />
                                <span className="navigation-menu__mobile__links__item__link__text">{title}</span>
                            </a>
                        </li>
                    );
                })}
                <Button handleClick={toggleDarkMode} customStyle="dark-mode-toggle" data-testid="darkmode-toggle" text={darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'} variant="secondary" />

            </ul>
        </div>
    );
};

export default MobileNavigationMenu