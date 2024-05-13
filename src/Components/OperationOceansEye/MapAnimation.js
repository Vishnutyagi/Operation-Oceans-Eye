import React, { useEffect} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import shipsData from "../Ships_24hr_Locations.json";

const MapAnimation = ({ map, shipMarker }) => {
      
    return(
        <div>
            {console.log(" i am here ")}
        </div>
    ) ; // MapAnimation does not render any visible content
};

export default MapAnimation;