import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

const MapClickableWithRadius = ({ onMapClick, latitude, longitude, radius }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const circleRef = useRef(null);

    // const [markerPosition, setMarkerPosition] = useState(null);

    const [formData, setFormData] = useState({
        latitude: latitude,
        longitude: longitude,
        radius: 200
    });

    // Function to handle input changes
    const handleInputChange = (latitude, longitude) => {

        setFormData({ ...formData, ['latitude']: latitude, ['longitude']: longitude });
    };

    const drawMarkerAndCircle = (latitude, longitude) => {

        if (markerRef.current) {
            mapRef.current.removeLayer(markerRef.current); // Remove the previous marker from the map
        }

        const marker = L.marker([latitude, longitude]).addTo(mapRef.current); // Add a marker at the clicked location
        // marker.bindPopup(`Clicked at: ${lat}, ${lng}`).openPopup(); // Bind a popup to the marker showing the coordinates

        if (circleRef.current) {
            mapRef.current.removeLayer(circleRef.current); // Remove the previous marker from the map
        }
        const circle = L.circle([latitude, longitude], {
            color: 'red', // Color of the circle outline
            fillColor: '#f03', // Color of the circle fill
            fillOpacity: 0.5, // Opacity of the circle fill
            radius: radius // Radius of the circle in meters
        }).addTo(mapRef.current);
        circleRef.current = circle
        markerRef.current = marker; // Store the reference to the marker



    };

    useEffect(() => {

        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png')
        });

        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([latitude, longitude], 11);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);
        }

        // mapContainerRef.current.addEventListener('click', handleMapClick);

        // Add event listener for click events on the map
        mapRef.current.on('click', handleMapClick);


        // Cleanup function to remove the click event listener when the component unmounts
        return () => {
            mapRef.current.off('click', handleMapClick);
            // mapContainerRef.current.removeEventListener('click', handleMapClick);

        };
    }, [latitude, longitude, radius]);

    useEffect(() => {
        drawMarkerAndCircle(formData.latitude, formData.longitude)

    }, [radius])

    // Function to handle click events on the map
    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng; // Get latitude and longitude of the clicked point
        console.log(event.latlng)
        drawMarkerAndCircle(lat, lng)
        handleInputChange(lat, lng)
        // setMarkerPosition({ lat, lng }); // Update the marker position state
        onMapClick(lat, lng);

    };


    return <div ref={mapContainerRef} style={{ width: '100%', height: '300px' }} />;
};

export default MapClickableWithRadius;