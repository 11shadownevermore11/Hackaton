import type React from 'react';
import type { IconType } from 'react-icons';
import { Link } from 'react-router';

interface NavItem {
    Icon: IconType;
    route: string;
    text: string;
    isActive: boolean;
}

const NavItem: React.FC<NavItem> = ({ Icon, text, route, isActive }) => {
    return (
        <Link to={route}>
            <div className={`flex flex-col items-center gap-2 text-[${!isActive ? '#a8a29e' : '#14b8a6'}]`}>
                <div className="w-[20px] h-[20px]">
                    <Icon size={20} />
                </div>

                <span className="text-[12px]">{ text }</span>
            </div>
        </Link>
    );
};

export default NavItem;
