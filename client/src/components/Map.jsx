// src/components/Map.jsx
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import the marker images
import markerIcon from '../assets/images/marker-icon.png';
import markerIcon2x from '../assets/images/marker-icon-2x.png';
import markerShadow from '../assets/images/marker-shadow.png';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Create a custom icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function Map({ itinerary, center, places }) {
  const allPlaces = [
    ...places.historical,
    ...places.restaurant,
    ...places.adventure,
    ...places.other,
  ];

  return (
    <MapContainer center={center} zoom={13} style={containerStyle} maxZoom={20}>
      <ChangeView center={center} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {itinerary.map((item, index) => (
        <Marker key={index} position={[item.lat, item.lng]} icon={customIcon}>
          <Popup>
            {item.name}
          </Popup>
        </Marker>
      ))}
      {allPlaces.map((place, index) => (
        <Marker key={index} position={[place.lat, place.lon]} icon={customIcon}>
          <Popup>
            {place.tags.name || place.tags.amenity || 'Attraction'}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;