import type React from 'react';
import { useEffect } from 'react';


const MapPage: React.FC = () => {
    useEffect(() => {
        const DONETSK_COORDINATES = [48.016011, 37.802773]; // [долгота, широта]

        ymaps.ready(init);

        function init(){
            document.querySelector('#map').innerHTML = '';

            // Создание карты.
            var myMap = new ymaps.Map("map", {
                // Координаты центра карты.
                // Порядок по умолчанию: «широта, долгота».
                // Чтобы не определять координаты центра карты вручную,
                // воспользуйтесь инструментом Определение координат.
                center: DONETSK_COORDINATES,
                // Уровень масштабирования. Допустимые значения:
                // от 0 (весь мир) до 19.
                zoom: 15
            });
        }
    }, []);

    return (
        <div id="map" className="w-screen h-screen"></div>
    )
};

export default MapPage;
