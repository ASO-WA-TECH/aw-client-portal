
import { FiSearch } from "react-icons/fi";
import { CiShoppingBasket } from "react-icons/ci";
import { CiCircleInfo } from "react-icons/ci";

import { Routes } from "../../Routes";

export const routes = [
    {
        title: "My listings",
        href: `/${Routes.MY_LISTINGS}`,
        Icon: CiShoppingBasket,
    },
    {
        title: "Explore",
        href: `/${Routes.LISTING}`,
        Icon: FiSearch,
    },
    {
        title: "About",
        href: `/${Routes.HOME}`,
        Icon: CiCircleInfo,
    },
];