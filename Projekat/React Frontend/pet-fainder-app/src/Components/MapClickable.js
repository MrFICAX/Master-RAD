import React, { useRef, useEffect } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

const MapClickable = ({ onMapClick, latitude, longitude }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    // const [markerPosition, setMarkerPosition] = useState(null);



    useEffect(() => {

        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png')
          });
          
        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([latitude, longitude], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);


        }

        // mapContainerRef.current.addEventListener('click', handleMapClick);

        // Add event listener for click events on the map
        mapRef.current.on('click', handleMapClick);

        console.log("map use effect")
        console.log(mapRef)
        console.log(mapContainerRef)

        // Cleanup function to remove the click event listener when the component unmounts
        return () => {
            mapRef.current.off('click', handleMapClick);
            // mapContainerRef.current.removeEventListener('click', handleMapClick);

        };
    }, [latitude, longitude]);

    // Function to handle click events on the map
    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng; // Get latitude and longitude of the clicked point
        console.log(event.latlng)
        if (markerRef.current) {
            mapRef.current.removeLayer(markerRef.current); // Remove the previous marker from the map
        }

        const marker = L.marker([lat, lng]).addTo(mapRef.current); // Add a marker at the clicked location
        // marker.bindPopup(`Clicked at: ${lat}, ${lng}`).openPopup(); // Bind a popup to the marker showing the coordinates

        markerRef.current = marker; // Store the reference to the marker
        // setMarkerPosition({ lat, lng }); // Update the marker position state
        onMapClick(lat, lng);

    };


    return <div ref={mapContainerRef} style={{ width: '100%', height: '300px' }} />;
};

export default MapClickable;