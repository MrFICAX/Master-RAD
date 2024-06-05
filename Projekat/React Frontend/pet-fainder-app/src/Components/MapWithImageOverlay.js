import React, { useRef, useEffect } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

const MapWithImageOverlay = ({ latitude, longitude, image }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const circleRef = useRef(null);


  useEffect(() => {
    
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([latitude, longitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    } else {
      // Update the map view when latitude and longitude change
      mapRef.current.setView([latitude, longitude], 13);
    }

    
    // const icon = L.icon({
    //   iconUrl: `https://mrficax-react-bucket.s3.amazonaws.com/${image}`,
    //   iconSize: [40, 40],
    //   iconAnchor: [20, 40],
    //   popupAnchor: [0, -40]
    // });
    // console.log(image);
    // L.marker([latitude, longitude], { icon }).addTo(mapRef.current);
    if (circleRef.current) {
      mapRef.current.removeLayer(circleRef.current); // Remove the previous marker from the map
    }
    const circle = L.circle([latitude, longitude], {
      color: 'red', // Color of the circle outline
      fillColor: '#f03', // Color of the circle fill
      fillOpacity: 0.5, // Opacity of the circle fill
      radius: 200 // Radius of the circle in meters
    }).addTo(mapRef.current);
    circleRef.current = circle

  }, [latitude, longitude]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '200px' }} />;
};

export default MapWithImageOverlay;