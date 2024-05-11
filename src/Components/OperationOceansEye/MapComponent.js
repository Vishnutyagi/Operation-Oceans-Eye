import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as turf from '@turf/turf';
import Port_Location_Data from '../Port_Location_Data.json';
import Ships_Location_Data from '../Ships_Location_Data.json';


const MapComponent = () => {
    const mapContainer = useRef(null);
    const [Coordinates, setCoordinates] = useState([]);
    const accessToken = 'pk.eyJ1IjoiZXNwYWNlc2VydmljZSIsImEiOiJjbHZ1dHZjdTQwMDhrMm1uMnoxdWRibzQ4In0.NaprcMBbdX07f4eXXdr-lw';

    useEffect(() => {
        mapboxgl.accessToken = accessToken;
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-9.873781, 42.643082],
            zoom: 9
        });

        Port_Location_Data.map(port => {
            new mapboxgl.Marker({ color: 'black', rotation: 45 })
                .setLngLat([port.geo_location_longitude, port.geo_location_latitude])
                .addTo(map);
        });

        Ships_Location_Data.forEach(ship => {
            new mapboxgl.Marker()
                .setLngLat([ship.location_longitude, ship.location_latitude])
                .addTo(map);
        });

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
            const coordinatesDiv = document.getElementById('coordinates');
            if (Coordinates_Data.features.length > 0) {
                const Coordinates_Value = Coordinates_Data.features[0].geometry.coordinates;
                const list = createList(Coordinates_Value);
                console.log(list);
            } else {
                coordinatesDiv.textContent = '';
                // add the alert!!!1
            }
        };
    });

    

    const createList = (polygon_coordinates) => {
        const polygonPointsData = turf.polygon([polygon_coordinates[0]]);
       
        const shipPoints = Ships_Location_Data.map(ship => [ship.location_longitude, ship.location_latitude]);
        const shipPointsData = turf.points(shipPoints);
        const  shipsInsidePolygon =  turf.pointsWithinPolygon(shipPointsData, polygonPointsData);
        return shipsInsidePolygon;
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
