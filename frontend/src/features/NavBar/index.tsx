import type React from 'react';
import { navLinks } from './const';
import NavItem from './NavItem';
import { useMatches } from 'react-router';

const NavBar: React.FC = () => {
    const matches = useMatches();

    const activeRoute = matches[matches.length - 1].pathname;

    return (
        <div className="flex justify-evenly fixed bottom-0 left-0 w-full py-5 bg-[#292524] border-t border-[#44403c]">
            {navLinks.map(navLink =>
                <NavItem
                    key={navLink.route}
                    Icon={navLink.icon}
                    text={navLink.text}
                    route={navLink.route}
                    isActive={activeRoute === navLink.route}
                />
            )}
        </div>
    );
};

export default NavBar;
