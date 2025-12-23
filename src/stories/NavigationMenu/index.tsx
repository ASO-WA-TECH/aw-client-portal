import { useState } from "react";

import './index.scss'

import DesktopNavigationMenu from "./DesktopNavigationMenu";
import MobileNavigationMenu from "./MobileNavigationMenu";


const NavigationMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="navigation-menu" >
            <div>
                <DesktopNavigationMenu />
                <div>
                    <div className={`${isOpen ? 'navigation-menu__opened' : 'navigation-menu__closed'}`}>
                        <button className="navigation-menu__closed__hamburger-button" onClick={() => setIsOpen(true)} data-testid='menu-button'>
                            <span className="navigation-menu__closed__hamburger-button__bar"></span>
                            <span className="navigation-menu__closed__hamburger-button__bar"></span>
                            <span className="navigation-menu__closed__hamburger-button__bar"></span>
                        </button>
                        {isOpen ? <MobileNavigationMenu setIsOpen={setIsOpen} /> : <></>}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default NavigationMenu