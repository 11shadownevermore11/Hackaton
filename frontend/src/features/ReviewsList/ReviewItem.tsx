import type React from 'react';
import { FaStar } from 'react-icons/fa';

interface ReviewItemProps {
    img: string;
    name: string;
    rating: string;
    text: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ img, name, rating, text }) => {
    return (
        <div>
            <div className="flex justify-between">
                <div className="flex gap-3 items-center">
                    <img
                        className="w-10 h-10 rounded-full object-cover"
                        src={img}
                        alt="pf img"
                    />

                    <span>{name}</span>
                </div>

                <div className="flex items-center gap-1">
                    <FaStar color="#f0b100" />

                    <span className="font-semibold text-[14px]">
                        {rating}
                    </span>
                </div>
            </div>

            <p className="mt-3 text-[14px] text-[#a8a29e]">
                {text}
            </p>
        </div>
    );
};

export default ReviewItem;
