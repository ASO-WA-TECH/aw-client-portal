import { MdHome } from "react-icons/md";
import { IoLeaf } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { TbNotes } from 'react-icons/tb';
import { RiAccountCircleFill } from "react-icons/ri";

import './index.scss';
import { IconContext } from "react-icons";

export interface ButtomNavigationBarProps {
    /** Custom styling */
    customStyle?: string
}

/** UI component for user interaction */
const ButtomNavigationBar = ({ customStyle = '' }: ButtomNavigationBarProps) => {
    return (
        <div className='bottom-navigation-bar'>
            <IconContext.Provider value={{ className: `bottom-navigation-bar__icons ${customStyle}` }}>
                <a href="bottom-navigation-bar__icons__link" className=""><MdHome /></a>
                <a href="bottom-navigation-bar__icons__link"><IoLeaf /></a>
                <a href="bottom-navigation-bar__icons__link"><GoPlus className="bottom-navigation-bar__icons__plus-icon" /></a>
                <a href="bottom-navigation-bar__icons__link"><TbNotes /></a >
                <a href="bottom-navigation-bar__icons__link"><RiAccountCircleFill /></a >
            </IconContext.Provider >
        </div >
    );
};

export default ButtomNavigationBar
