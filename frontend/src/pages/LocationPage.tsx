import ReviewsList from '@/features/ReviewsList';
import axios from '@/shared/axios';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import { useParams } from 'react-router';

const LocationPage: React.FC = () => {
    const params = useParams();
    const map = useRef(null);
    const [card, setCard] = useState<any>(null);

    useEffect(() => {
        const loadLocationInfo = async () => {
            const response = await axios.get('/locations/' + params.id);

            console.log(response.data);
            setCard(response.data);
        }

        loadLocationInfo();
    }, []);
    
    useEffect(() => {
        if (!card) return;

        ymaps.ready(init);

        function init(){
            document.querySelector('#locationMap').innerHTML = '';

            map.current = new ymaps.Map("locationMap", {
                center: card.coords,
                zoom: 17
            });
        }
    }, [card]);

    if (!card) {
        return (
            <div className="fixed left-[50%] top-[40%] transform-[translate(-50%,-50%)]">
                <svg aria-hidden="true" className="w-[80px] h-[80px] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        )
    }

    return (
        <div className="pt-5">
            <div className="px-5 flex justify-between items-center">
                <div>
                    <div className="flex gap-3 items-center mb-1">
                        <IoLocationOutline color="#14b8a6" size={24} />

                        <h1 className="font-bold text-[24px]">{card.name}</h1>
                    </div>

                    <span className="text-[14px] text-[#a8a29e]">
                        {card.type}
                    </span>
                </div>

                <div>
                    <button className="rounded-full bg-[#14b8a6] w-[35px] h-[35px] flex items-center justify-center">
                        <FaHeart color="#1c1917" />
                    </button>
                </div>
            </div>

            <hr className="my-4 text-[#a1a1a1]" />

            <div className="px-5">
                    <img
                        src={'http://localhost:8000' + card.photo}
                        alt="donbass"
                        className="w-[100%]"
                    />


                <div>
                    <p className="mt-5 text-justify">
                        {card.description}
                    </p>
                </div>

                <div id="locationMap" className="mt-5 w-full h-[200px]"></div>

                <div className="mt-5">
                    <ReviewsList />
                </div>
            </div>
        </div>
    );
};

export default LocationPage;
