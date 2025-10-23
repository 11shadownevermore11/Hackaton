import type React from 'react';
import { FaRegHeart, FaRegStar } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { LuRoute } from 'react-icons/lu';
import { useNavigate } from 'react-router';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="bg-gradient-to-br from-[#14b8a6] to-[#10b981] p-6 pb-8">
                <div className="flex gap-5 items-center">
                    <span className="relative flex size-8 shrink-0 overflow-hidden rounded-full w-20 h-20 border-4 border-white/20">
                        <img className="aspect-square size-full" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/diverse-user-avatars-jNaliJbW5b5ccprrlYjj99XE0SOY9L.png" />
                    </span>
                    <div className="flex flex-col">
                        <h1 className="text-[24px] font-bold">Иван Петров</h1>
                        <span className="text-[14px] opacity-90">ivan.petrov@email.com</span>
                    </div>
                </div>
            </div>

            <div className="px-5 flex flex-col gap-2">
                <div className="border border-[#44403c] bg-[#292524] rounded-xl relative top-[-15px] py-4 flex justify-evenly mb-3">
                    <div className="flex flex-col items-center">
                        <span className="text-[#14b8a6] text-2xl font-bold">12</span>
                        <span className="text-[#a8a29e] text-[12px]">Избранное</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[#10b981] text-2xl font-bold">3</span>
                        <span className="text-[#a8a29e] text-[12px]">Маршруты</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[#d4a574] text-2xl font-bold">8</span>
                        <span className="text-[#a8a29e] text-[12px]">Отзывы</span>
                    </div>
                </div>

                {/**
                 * Избранное
                 */}
                <div
                    className="border border-[#44403c] bg-[#292524] rounded-xl relative top-[-15px] p-4 flex justify-between items-center active:bg-[#1c1917]"
                    onClick={() => navigate('/bookmarks')}
                >
                    <div className="flex-1 flex gap-3">
                        <div className="rounded-2xl bg-[#44403c] p-3">
                            <FaRegHeart color="#14b8a6" size={20} />
                        </div>

                        <div className="flex flex-col">
                            <span className="font-medium">Избранное</span>
                            <span className="text-[#a8a29e] text-[14px]">12 мест</span>
                        </div>
                    </div>

                    <div>
                        <IoIosArrowForward color="#a8a29e" size={20} />
                    </div>
                </div>

                {/**
                 * Мои маршруты
                 */}
                <div
                    className="border border-[#44403c] bg-[#292524] rounded-xl relative top-[-15px] p-4 flex justify-between items-center active:bg-[#1c1917]"
                    onClick={() => navigate('/routes')}
                >
                    <div className="flex-1 flex gap-3">
                        <div className="rounded-2xl bg-[#44403c] p-3">
                            <LuRoute color="#10b981" size={20} />
                        </div>

                        <div className="flex flex-col">
                            <span className="font-medium">Мои маршруты</span>
                            <span className="text-[#a8a29e] text-[14px]">3 маршрута</span>
                        </div>
                    </div>

                    <div>
                        <IoIosArrowForward color="#a8a29e" size={20} />
                    </div>
                </div>

                {/**
                 * Мои отзывы
                 */}
                <div
                    className="border border-[#44403c] bg-[#292524] rounded-xl relative top-[-15px] p-4 flex justify-between items-center opacity-60"
                >
                    <div className="flex-1 flex gap-3">
                        <div className="rounded-2xl bg-[#44403c] p-3">
                            <FaRegStar color="#d4a574" size={20} />
                        </div>

                        <div className="flex flex-col">
                            <span className="font-medium">Мои отзывы</span>
                            <span className="text-[#a8a29e] text-[14px]">8 отзывов</span>
                        </div>
                    </div>

                    <div>
                        <IoIosArrowForward color="#a8a29e" size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
