import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as turf from '@turf/turf';
import Port_Location_Data from '../Port_Location_Data.json';
import Ships_Final_Location_Data from '../Ships_Final_Locations.json';
import Ships_24hr_Locations_Data from "../Ships_24hr_Locations.json";
import './Style.css';
import 'react-toastify/dist/ReactToastify.css';

const MapComponent = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [edit, setEdit] = useState(true);
    const [list, setList] = useState([]);
    const accessToken = 'pk.eyJ1IjoiZXNwYWNlc2VydmljZSIsImEiOiJjbHZ1dHZjdTQwMDhrMm1uMnoxdWRibzQ4In0.NaprcMBbdX07f4eXXdr-lw';

    useEffect(() => {

        mapboxgl.accessToken = accessToken;
        // if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [77.5937, 25.9629],
            zoom: 3
        });
        Port_Location_Data.map(port => {
            const port_marker = new mapboxgl.Marker({ color: 'black', rotation: 45 })
                .setLngLat([port.geo_location_longitude, port.geo_location_latitude])
                .addTo(map.current);
        });

        Ships_Final_Location_Data.forEach(ship => {
            const marker = new mapboxgl.Marker({ color: 'blue', rotation: 45 })
                .setLngLat([ship.location_longitude, ship.location_latitude])
                .addTo(map.current);

        });

        return () => map.current.remove();

    }, []);


    const shipsInsidePolygon = (polygon_coordinates) => {
        const polygonPointsData = turf.polygon([polygon_coordinates[0]]);
        const shipPoints = Ships_Final_Location_Data.map(ship => [ship.location_longitude, ship.location_latitude]);
        const shipPointsData = turf.points(shipPoints);
        const shipsInsidePolygonData = turf.pointsWithinPolygon(shipPointsData, polygonPointsData);
        return shipsInsidePolygonData;
    };

    const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true
        },
        defaultMode: 'draw_polygon'
    });

    const findNameOfShipsInsidePolygon = (coordinates) => {
        const nameOfShips = Ships_Final_Location_Data.filter(ship => {
            return coordinates.some(coord => (
                coord[1] === ship.location_latitude && coord[0] === ship.location_longitude
            ));
        });
        return nameOfShips;
    };


    function updateCoordinates() {
        const Coordinates_Data = draw.getAll();
        if (Coordinates_Data.features.length > 0) {
            const Coordinates_Value = Coordinates_Data.features[0].geometry.coordinates;
            const listOfShipsData = shipsInsidePolygon(Coordinates_Value);
            const listOfShips = listOfShipsData.features.map(data =>
                data.geometry.coordinates
            );
            const names = findNameOfShipsInsidePolygon(listOfShips);
            console.log(names);
            setList(names);
        } else {
            setList([]);
        }
    };

    const updateControlToDraw = () => {
        setEdit(false);
        if (edit)
            map.current.addControl(draw);

        map.current.on('draw.create', updateCoordinates);
        map.current.on('draw.delete', updateCoordinates);
        map.current.on('draw.update', updateCoordinates);

        return () => map.current.remove();
    }

    return (
        <div className='main'>
            <div className="marquee">
                <div>
                    <span>Hello Tiger,Kabir and Pathan, Vishnu This side. I have founded the ships and ports locations, The path of ships and more. You can draw a polygon by click on "Draw" and find out the ships inside the polygon and Click on a ship to show the ship movement and events over the last 24 hours. Best of Luck!</span>
                </div>
            </div>
            <div ref={mapContainer} className="map-container" />
            {
                edit && (<button className='btn' onClick={() => updateControlToDraw()} style={{ cursor: 'pointer' }}>
                    Draw
                </button>)
            }
            {
                list.length > 0 && (
                    <div id="calculation-box" className="calculation-box">
                        <h2 className='heading-listship'>List of Ships Inside this polygon</h2>
                        <ul>
                            {list.map((Ships, index) => (
                                <li key={index}> {Ships.site_name}  ({Ships.location_latitude},{Ships.location_longitude})</li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div >
    );
};

export default MapComponent;
