import { useState } from "react";

import './index.scss'

import DesktopNavigationMenu from "./DesktopNavigationMenu";
import MobileNavigationMenu from "./MobileNavigationMenu";

interface Props {
    toggleDarkMode: () => void;
    darkMode: boolean
}
const NavigationMenu = ({ toggleDarkMode, darkMode }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="navigation-menu" >
            <div>
                <DesktopNavigationMenu toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                <div>
                    <div className={`${isOpen ? 'navigation-menu__opened' : 'navigation-menu__closed'}`}>
                        <button className="navigation-menu__closed__hamburger-button" onClick={() => setIsOpen(true)}>
                            <span className="navigation-menu__closed__hamburger-button__bar"></span>
                            <span className="navigation-menu__closed__hamburger-button__bar"></span>
                            <span className="navigation-menu__closed__hamburger-button__bar"></span>
                        </button>
                        {isOpen ? <MobileNavigationMenu setIsOpen={setIsOpen} toggleDarkMode={toggleDarkMode} darkMode={darkMode} /> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigationMenu