import type React from 'react';
import { FaRegTrashAlt, FaStar } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';

interface BookmarkedLocationItemProps {
    img: string;
    name: string;
    type: string;
    rating: string;
    distance: string;
}

const BookmarkedLocationItem: React.FC<BookmarkedLocationItemProps> = ({ img, distance, name, rating, type }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#292524] p-3 rounded-lg" onClick={() => navigate('/location/1')}>
            <div className="flex gap-3">
                <img
                    src={img}
                    className="w-[120px] h-[120px]"
                />

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

                    <button className="text-[#e60009] flex items-center gap-2 text-[14px]">
                        <FaRegTrashAlt size={16} />

                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookmarkedLocationItem;
