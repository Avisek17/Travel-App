// src/components/MapWithSearch.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 37.7749,
  lng: -122.4194
};

const libraries = ['places'];

const MapWithSearch = () => {
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [category, setCategory] = useState('restaurant');
  const [loading, setLoading] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'your Api Key',
    libraries
  });

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(14);
        fetchPlaces(place.geometry.location);
      }
    }
  }, [autocomplete, map]);

  const fetchPlaces = async (location) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/googleplaces/search-places`, {
          params: {
            location: `${location.lat()},${location.lng()}`,
            type: category
          }
        }
      );
      setPlaces(response.data.results);
    } catch (error) {
      console.error('Error fetching places', error);
      alert(`Error fetching places: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
    >
      <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Search for a place"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            fontSize: `16px`,
            outline: `none`,
            position: `absolute`,
            top: `10px`,
            left: `10px`,
          }}
        />
      </Autocomplete>
      {loading && <div>Loading...</div>}
      {!loading && places.map((place) => (
        <Marker
          key={place.place_id}
          position={{
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }}
          onClick={() => setSelectedPlace(place)}
        />
      ))}
      {selectedPlace && (
        <div>
          <h2>{selectedPlace.name}</h2>
          <p>{selectedPlace.vicinity}</p>
        </div>
      )}
      <select onChange={handleCategoryChange} value={category}>
        <option value="restaurant">Restaurant</option>
        <option value="museum">Museum</option>
        <option value="temple">Temple</option>
        <option value="tourist_attraction">Attraction</option>
      </select>
    </GoogleMap>
  );
};

export default MapWithSearch;
