import LocationsList from '@/features/LocationsList';
import BookmarkedLocationItem from '@/features/LocationsList/BookmarkedLocationItem';
import type React from 'react';
import { FaHeart } from 'react-icons/fa';

const BookmarksPage: React.FC = () => {
    return (
        <div className="pt-5">
            <div className="px-5">
                <div className="flex gap-3 items-center mb-1">
                    <FaHeart color="#14b8a6" size={24} />

                    <h1 className="font-bold text-[24px]">Избранное</h1>
                </div>

                <span className="text-[14px] text-[#a8a29e]">
                    3 места
                </span>
            </div>

            <hr className="my-4 text-[#a1a1a1]" />

            <div className="px-5">
                <LocationsList>
                    <BookmarkedLocationItem
                        img="https://avatars.mds.yandex.net/i?id=3eac9d48af577269bafca6899d0504ac_l-5906867-images-thumbs&n=13"
                        distance="1"
                        name="Донбасс арена"
                        rating="3.9"
                        type="Достопримечательность"
                    />
                    <BookmarkedLocationItem
                        img="https://avatars.mds.yandex.net/get-altay/5236021/2a0000017b03a97b77a5c8d11c481d193872/XXXL"
                        distance="2.5"
                        name="Хмели сунели"
                        rating="4.2"
                        type="Ресторан"
                    />
                </LocationsList>
            </div>
        </div>
    );
};

export default BookmarksPage;
