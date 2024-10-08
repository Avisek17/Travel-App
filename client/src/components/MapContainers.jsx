import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'; 
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { fetchNearbyPlaces } from './FetchNearbyPlaces';
import CircularProgress from '@mui/material/CircularProgress';
import templeIcon from '../assets/images/temple.png';
import parkIcon from '../assets/images/parks.png';
import museumIcon from '../assets/images/museum.png';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapContainer = ({ destination, destination_lat, destination_lng, onPlaceSelect }) => {
  const mapRef = useRef(null);
  const [center, setCenter] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    if (destination && destination_lat && destination_lng) {
      const tripCenter = {
        lat: parseFloat(destination_lat),
        lng: parseFloat(destination_lng)
      };
      setCenter(tripCenter);
      setMarkerPosition(tripCenter);
    }
  }, [destination, destination_lat, destination_lng]);

  useEffect(() => {
    if (mapRef.current && center) {
      setLoading(true);
      fetchNearbyPlaces(mapRef.current, window.google, center)
        .then((places) => {
          const filteredPlaces = places.filter((place) => determineIcon(place));
          setNearbyPlaces(filteredPlaces);
          setError(null);
        })
        .catch((error) => {
          console.error(error);
          setError('Failed to fetch nearby places.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [center]);

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
    onPlaceSelect(place); 
  };

  return (
    <>
      {loading && <CircularProgress />}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={(map) => (mapRef.current = map)}
      >
        {markerPosition && <Marker position={markerPosition} />}

        {nearbyPlaces.map((place) => (
          <Marker
            key={place.place_id}
            position={place.geometry.location}
            title={place.name}
            onClick={() => handleMarkerClick(place)}
            icon={{
              url: determineIcon(place),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.geometry.location}
            onCloseClick={() => {
              setSelectedPlace(null);
              onPlaceSelect(null); 
            }}
          >
            <div>
              <h3>{selectedPlace.name}</h3>
              <p>{selectedPlace.vicinity || 'No vicinity available'}</p>
            </div>
          </InfoWindow>
        )}

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </GoogleMap>
    </>
  );
};

const determineIcon = (place) => {
  if (place.types.includes('hindu_temple')) {
    return templeIcon;
  }
  if (place.types.includes('museum')) {
    return museumIcon;
  }
  if (place.types.includes('park') || place.types.includes('water_park') || place.types.includes('amusement_park')) {
    return parkIcon;
  }
  return null;
};

export default MapContainer;