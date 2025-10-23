// @ts-nocheck

import axios from '@/shared/axios';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { IoAddCircle } from 'react-icons/io5';
import { useNavigate } from 'react-router';

const AddLocationPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const coords = useRef([0, 0]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        setFile(e.target.files[0]);
        }
  };

    const onSubmit = async (e) => {
        e.preventDefault();

        const name = document.querySelector('[name="name"]').value;
        const type = document.querySelector('[name="type"]').value;
        const address = document.querySelector('[name="address"]').value;
        const workTime = document.querySelector('[name="workTime"]').value;
        const description = document.querySelector('[name="description"]').value;
        const vk = document.querySelector('[name="vk"]').value;
        const telegram = document.querySelector('[name="telegram"]').value;

        const response = await axios.post('/locations', {
            id: ~~(Math.random() * 1000),
            name,
            description,
            addres: address,
            coords: coords.current,
            workTime,
            contacts: {
                vk,
                telegram,
            },
        });

        const locationId = response.data?.location.id;

        if (!locationId) {
            alert('Не удалось добавить локацию');
            return;
        }

        const formData = new FormData();

        formData.append('location_id', locationId);
        formData.append('file', file);

        const fileResponse = await axios.post('/locations/uploadfile', formData)

        console.log(fileResponse);

        alert(response.data.message);

        navigate('/location/' + response.data.location.id);
    }

    useEffect(() => {
        const DONETSK_COORDINATES = [48.016011, 37.802773]; // [долгота, широта]

        ymaps.ready(init);

        function init(){
            document.querySelector('#addLocationMap').innerHTML = '';

            var myMap = new ymaps.Map("addLocationMap", {
                center: DONETSK_COORDINATES,
                zoom: 15
            });

            myMap.events.add('click', function (e) {
                const clickedCoords = e.get('coords');
                coords.current = clickedCoords;
            });
        }
    }, []);

    return (
        <div className="pt-5">
            <div className="px-5">
                <div className="flex gap-3 items-center mb-1">
                    <IoAddCircle color="#14b8a6" size={24} />

                    <h1 className="font-bold text-[24px]">Добавление локации</h1>
                </div>

                <span className="text-[14px] text-[#a8a29e]">
                    Добавьте свою локацию в общий каталог
                </span>
            </div>

            <hr className="my-4 text-[#a1a1a1]" />

            <form className="px-5" onSubmit={onSubmit}>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-[18px]">Название</label>
                    <input name="name" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-[18px]">Тип локации</label>
                    <select name="type" id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected value="site">Достопримечательность</option>
                        <option value="restoraunt">Ресторан</option>
                    </select>
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-[18px]">Адрес</label>
                    <input name="address" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-[18px]">Рабочее время</label>
                    <input name="workTime" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-[18px]">Описание</label>


                    <textarea name="description" className="bg-gray-50 h-30 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-[18px]">Контакты</label>

                    <input name="vk" type="text" placeholder="VK" className="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <input name="telegram" type="text" placeholder="Telegram" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-[18px]">Фотография</label>

                    <input
                        className="p-3 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        name="photo"
                        accept="image/png, image/jpeg"
                        type="file"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-[18px]">Укажите координаты вашей локации</label>

                    <div id="addLocationMap" className="w-full h-[200px]"></div>
                </div>

                <button className="w-full bg-[#14b8a6] rounded-lg py-2 text-black text-[14px] font-medium">
                    Добавить локацию
                </button>
            </form>
        </div>
    );
};

export default AddLocationPage;
