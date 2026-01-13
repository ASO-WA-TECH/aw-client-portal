import { routes } from "./routes";

import './index.scss'
import Button from "../Button";

interface MobileNavigationMenuProps {
    setIsOpen: (isOpen: boolean) => void;
}


const MobileNavigationMenu = ({ setIsOpen }: MobileNavigationMenuProps) => {
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

            </ul>
        </div>
    );
};

export default MobileNavigationMenu