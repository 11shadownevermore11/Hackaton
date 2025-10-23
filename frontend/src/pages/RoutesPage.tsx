import RoutesList from '@/features/RoutesList';
import RouteCard from '@/features/RoutesList/RouteCard';
import type React from 'react';
import { LuRoute } from 'react-icons/lu';

const RoutesPage: React.FC = () => {
    return (
        <div className="pt-5">
            <div className="px-5">
                <div className="flex gap-3 items-center mb-1">
                    <LuRoute color="#14b8a6" size={24} />

                    <h1 className="font-bold text-[24px]">Маршруты</h1>
                </div>

                <span className="text-[14px] text-[#a8a29e]">
                    Готовые маршруты по городу
                </span>
            </div>

            <hr className="my-4 text-[#a1a1a1]" />

            <div className="px-5">
                <RoutesList>
                    <RouteCard
                        img="https://avatars.mds.yandex.net/i?id=3f161a4152f907ab940b5c08451a70e1_l-8399918-images-thumbs&n=13"
                        name="Исторический центр"
                        description="Основные достопримечательности города"
                        distance="5 км"
                        points="5"
                        time="2-3"
                    />
                    <RouteCard
                        img="https://i.pinimg.com/736x/2a/01/89/2a0189f42c602527891c8398c4f1360b.jpg"
                        name="Винная карта"
                        description="Винные погребы Донецка"
                        distance="6"
                        points="4"
                        time="4"
                    />
                </RoutesList>
            </div>
        </div>
    );
};

export default RoutesPage;
