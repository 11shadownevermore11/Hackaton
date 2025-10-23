import type React from 'react';

interface LocationsListProps {
    children: React.ReactNode;
}

const LocationsList: React.FC<LocationsListProps> = ({ children }) => {
    return (
        <div className="flex flex-col gap-5">
            {children}
        </div>
    );
};

export default LocationsList;
