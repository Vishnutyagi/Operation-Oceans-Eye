import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapComponent = ({ Ports_Data, Ships_Data }) => {
    const mapContainer = useRef(null);
    const accessToken = 'pk.eyJ1IjoiZXNwYWNlc2VydmljZSIsImEiOiJjbHZ1dHZjdTQwMDhrMm1uMnoxdWRibzQ4In0.NaprcMBbdX07f4eXXdr-lw';

    useEffect(() => {
        mapboxgl.accessToken = accessToken;
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-74.5, 40],
            zoom: 9
        });

        Ports_Data.map(port => {
            new mapboxgl.Marker({ color: 'black', rotation: 45})
                .setLngLat([port.geo_location_longitude, port.geo_location_latitude])
                .addTo(map);
        });
        
        // console.log(Ships_Data)
        // Ships_Data.map(port => {
        //     new mapboxgl.Marker()
        //         .setLngLat([port.geo_location_longitude, port.geo_location_latitude])
        //         .addTo(map);
        // });

        return () => map.remove();
    });

    return (
        <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
    );
};

export default MapComponent;
