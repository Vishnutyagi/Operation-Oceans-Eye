import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as turf from '@turf/turf';
import Port_Location_Data from '../Port_Location_Data.json'


const MapComponent = () => {
    const mapContainer = useRef(null);
    const [Port_Geo_Location, setPort_Geo_Location] = useState(Port_Location_Data);
    // const [Ship_Geo_Location, setShip_Geo_Location] = useState(JsonData);
    const [Coordinates, setCoordinates] = useState([]);
    const accessToken = 'pk.eyJ1IjoiZXNwYWNlc2VydmljZSIsImEiOiJjbHZ1dHZjdTQwMDhrMm1uMnoxdWRibzQ4In0.NaprcMBbdX07f4eXXdr-lw';

    useEffect(() => {
        mapboxgl.accessToken = accessToken;
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-74.5, 40],
            zoom: 9
        });

        Port_Location_Data.map(port => {
            new mapboxgl.Marker({ color: 'black', rotation: 45 })
                .setLngLat([port.geo_location_longitude, port.geo_location_latitude])
                .addTo(map);
        });

        // console.log(data)
        // Ships_Data.forEach(port => {
        //     new mapboxgl.Marker()
        //         .setLngLat([port.geo_location_longitude, port.geo_location_latitude])
        //         .addTo(map);
        // });

        const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            },
            defaultMode: 'draw_polygon'
        });
        map.addControl(draw);

        map.on('draw.create', updateCoordinates);
        map.on('draw.delete', updateCoordinates);
        map.on('draw.update', updateCoordinates);

        return () => map.remove();

        function updateCoordinates () {
            const Coordinates_Data = draw.getAll();
            console.log(Coordinates_Data);
            const coordinatesDiv = document.getElementById('coordinates');
            if (Coordinates_Data.features.length > 0) {
                const Coordinates_Value = Coordinates_Data.features[0].geometry.coordinates;
                createList(Coordinates_Value);
    
            } else {
                coordinatesDiv.textContent = '';
                // add the alert!!!1
            }
        };
    });

    

    const createList = (polygon_coordinates) => {
        const polygonFeature = turf.polygon(polygon_coordinates);
        // const shipsInsidePolygon = .filter(ship => {
        //     const shipPoint = turf.point(ship.coordinates);
        //     return turf.booleanPointInPolygon(shipPoint, polygonFeature);
        // });
        // console.log(Coordinates_Value)
        // setCoordinates(Coordinates_Value); 
    };



    return (
        <div>
            <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
            <div className="calculation-box">
                <div id="coordinates"></div>

            </div>
        </div>

    );
};

export default MapComponent;
