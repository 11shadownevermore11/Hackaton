import type React from 'react';
import { FaStar } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';

interface LocationItemProps {
    id: string;
    name: string;
    type: string;
    rating: string;
    distance: string;
}

const LocationItem: React.FC<LocationItemProps> = ({ id, distance, name, rating, type }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#292524] p-3 rounded-lg" onClick={() => navigate('/location/' + id)}>
            <div className="flex gap-3">
                <div className="flex flex-col gap-2">
                    <span className="font-semibold">{name}</span>
                    <span className="text-[14px] text-[#a8a29e]">{type}</span>

                    <div className="flex gap-3">
                        <div className="flex items-center gap-1">
                            <FaStar color="#f0b100" />

                            <span className="font-semibold text-[14px]">
                                {rating}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <IoLocationOutline color="#a8a29e" />

                            <span className="text-[14px] text-[#a8a29e]">
                                {distance} км
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationItem;
