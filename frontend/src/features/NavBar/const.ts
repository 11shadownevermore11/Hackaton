import { FaRegHeart } from "react-icons/fa";
import { LuMap, LuRoute, LuUser } from "react-icons/lu";
import { MdGridOn } from "react-icons/md";

const navLinks = [
    {
        route: '/map',
        icon: LuMap,
        text: 'Карта',
    },
    {
        route: '/catalog',
        icon: MdGridOn,
        text: 'Каталог',
    },
    {
        route: '/bookmarks',
        icon: FaRegHeart,
        text: 'Избранное',
    },
    {
        route: '/routes',
        icon: LuRoute,
        text: 'Маршруты',
    },
    {
        route: '/profile',
        icon: LuUser,
        text: 'Профиль',
    },
];

export { navLinks };
