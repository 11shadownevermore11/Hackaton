import type React from 'react';
import ReviewItem from './ReviewItem';
import { IoSend } from 'react-icons/io5';

const ReviewsList: React.FC = () => {
    return (
        <div>
            <h3 className="text-[24px] font-bold mb-3">Отзывы</h3>

            <div className="flex gap-2 items-start my-5">
                    <div className="flex flex-col flex-1 gap-3">
                        <div className="flex items-center border border-[#a1a1a1] rounded p-3">
                            <textarea className="ml-2 outline-0 h-20 resize-none" placeholder="Напишите отзыв об этом месте" />
                        </div>

                        <div className="border border-[#a1a1a1] w-35 rounded p-1">
                            <input type="text" id="zip-input" className="outline-0" placeholder="оценка от 1 до 5" />
                        </div>
                    </div>

                    <div className="border border-[#a1a1a1] rounded aspect-square shrink-0 p-3">
                        <IoSend color="#fafaf9" size={21} />
                    </div>
                </div>

            <div className="flex flex-col gap-5">
                <ReviewItem
                    img="https://s.ura.news/760/images/news/upload/news/216/396/1052216396/137622_Akter_Andrey_Gaydulyan__gaydulyan_andrey_2312.1537.0.0.jpg"
                    name="Андрей"
                    rating="4.8"
                    text="Очень красивое место, мне понравилось"
                />

                <ReviewItem
                    img="https://veasy.online/wp-content/uploads/1-2237.jpg"
                    name="Сергей"
                    rating="5"
                    text="Крутой стадион, помню был здесь в детстве на реальной игре"
                />

                <ReviewItem
                    img="https://avatars.mds.yandex.net/i?id=8400dae0c80242395d235fe5da49dbc2_l-5279191-images-thumbs&n=13"
                    name="Родион"
                    rating="4.3"
                    text="Это место интересно как музей, очень много классных вещей"
                />
            </div>
        </div>
    );
};

export default ReviewsList;
