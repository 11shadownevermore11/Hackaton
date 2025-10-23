import type React from 'react';

interface RoutesListProps {
    children: React.ReactNode;
}

const RoutesList: React.FC<RoutesListProps> = ({ children }) => {
    return (
        <div className="flex flex-col gap-5">
            {children}
        </div>
    );
};

export default RoutesList;
