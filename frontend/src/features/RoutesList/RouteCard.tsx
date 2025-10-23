import type React from 'react';
import { GoClock } from 'react-icons/go';
import { IoLocationOutline } from 'react-icons/io5';
import { LuRoute } from 'react-icons/lu';

interface RouteCardProps {
    img: string;
    name: string;
    description: string;
    time: string;
    distance: string;
    points: string;
}

const RouteCard: React.FC<RouteCardProps> = ({ img, name, description, distance, points, time }) => {
    return (
        <div className="rounded-lg bg-[#292524]">
            <div className="relative">
                <img
                    className="w-full h-[160px] object-cover rounded-t-lg"
                    src={img}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div  className="flex flex-col absolute left-5 bottom-5">
                    <span className="text-lg font-bold text-balance">{ name }</span>
                    <span className="text-sm text-white/90">{ description }</span>
                </div>
            </div>

            <div className="p-5">
                <div className="flex gap-3 text-[#a8a29e] text-[14px] mt-3">
                    <span className="flex gap-1 items-center">
                        <GoClock />

                        {time} часа
                    </span>

                    <span className="flex gap-1 items-center">
                        <IoLocationOutline />

                        {distance} км
                    </span>

                    <span className="flex gap-1 items-center">
                        <LuRoute />

                        {points} остановок
                    </span>
                </div>

                <button className="w-full bg-[#14b8a6] rounded-lg mt-4 py-2 text-black text-[14px] font-medium">
                    Начать маршрут
                </button>
            </div>
        </div>
    );
};

export default RouteCard;
