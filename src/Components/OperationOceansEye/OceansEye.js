import MapComponent from './MapComponent';
import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const OceansEye = () => {
  const [Port_Geo_Location, setPort_Geo_Location] = useState([]);
  const [Ship_Geo_Location, setShip_Geo_Location] = useState([]);
  const [Loading, SetLoading] = useState(true);
  const accessToken = 'pk.eyJ1IjoiZXNwYWNlc2VydmljZSIsImEiOiJjbHZ1dHZjdTQwMDhrMm1uMnoxdWRibzQ4In0.NaprcMBbdX07f4eXXdr-lw';

  useEffect(() => {
    fetch('https://sheetdb.io/api/v1/m5kft0lcx7nvo')
      .then((response) => response.json())
      .then((data) => {
        setPort_Geo_Location(data);
        // SetLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    fetch('https://sheetdb.io/api/v1/gjzmz6sf6j3ea')
      .then((response) => response.json())
      .then((data) => {
        setShip_Geo_Location(data);
        console.log(data);
        // SetLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

  }, [accessToken])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const portResponse = await fetch('https://sheetdb.io/api/v1/m5kft0lcx7nvo');
  //       const portData = await portResponse.json();
  //       setPort_Geo_Location(portData);
    
  //       const shipResponse = await fetch('https://sheetdb.io/api/v1/gjzmz6sf6j3ea', { mode: 'no-cors' });
  //       const shipData = await shipResponse.json();
  //       setShip_Geo_Location(shipData);

  //       console.log(shipData);
    
  //       // setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
    
  // }, [accessToken])



  return (
    <div>
      <div>
        <MapComponent Ports_Data={Port_Geo_Location} Ships_Data={Ship_Geo_Location}  />
      </div>
    </div>
  );
}
