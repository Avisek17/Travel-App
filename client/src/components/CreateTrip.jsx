// // //src/components/CreateTrip.js

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Autocomplete, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import Map from './Map';
import { fetchNearbyPlaces } from '../utils/fetchNearbyPlaces.jsx';

const OPENCAGE_API_KEY = 'ee1e873fa205420892ce770d80a88483';

function CreateTrip() {
  const [trip, setTrip] = useState({ name: '', itinerary: [] });
  const [destination, setDestination] = useState({ name: '', lat: '', lng: '' });
  const [center, setCenter] = useState({ lat: 27.7008, lng:  85.3001 });
  const [suggestions, setSuggestions] = useState([]);
  const [places, setPlaces] = useState({
    historical: [],
    restaurant: [],
    adventure: [],
    other: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const fetchSuggestions = async (value) => {
    if (value.trim() !== '') {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(value)}&key=${OPENCAGE_API_KEY}&countrycode=np`
        );
        const results = response.data.results;
        setSuggestions(results.map(result => ({
          name: result.formatted,
          lat: result.geometry.lat,
          lng: result.geometry.lng,
        })));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addDestination = async () => {
    if (destination.lat && destination.lng) {
      setTrip({ ...trip, itinerary: [...trip.itinerary, destination] });
      setCenter({ lat: destination.lat, lng: destination.lng });
      try {
        setLoading(true);
        const nearbyPlaces = await fetchNearbyPlaces(destination.lat, destination.lng);
        setPlaces(nearbyPlaces);
      } catch (error) {
        console.error('Error fetching nearby places:', error);
      } finally {
        setLoading(false);
      }
      setDestination({ name: '', lat: '', lng: '' });
    }
  };

  return (
    <Container>
      <Typography variant="h4">Create a New Trip</Typography>
      <form noValidate autoComplete="off">
        <TextField
          label="Trip Name"
          name="name"
          value={trip.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </form>
      <div>
        <Autocomplete
          freeSolo
          options={suggestions}
          getOptionLabel={(option) => option.name}
          onInputChange={(e, value) => {
            setDestination({ ...destination, name: value });
            fetchSuggestions(value);
          }}
          onChange={(e, value) => setDestination(value || { name: '', lat: '', lng: '' })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter Destination"
              margin="normal"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <Button variant="contained" color="primary" onClick={addDestination} disabled={loading}>
          Add Destination
        </Button>
      </div>
      <Map itinerary={trip.itinerary} center={center} places={places} />
      <Typography variant="h5" style={{ marginTop: '20px' }}>Nearby Tourist Attractions</Typography>
      
      <Typography variant="h6">Historical Sites</Typography>
      <List>
        {places.historical.map((place, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={place.tags.name || 'Historical Site'}
              secondary={`${place.tags.tourism || ''} - ${place.lat}, ${place.lon}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6">Restaurants</Typography>
      <List>
        {places.restaurant.map((place, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={place.tags.name || 'Restaurant'}
              secondary={`${place.tags.amenity || ''} - ${place.lat}, ${place.lon}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6">Adventure Sites</Typography>
      <List>
        {places.adventure.map((place, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={place.tags.name || 'Adventure Site'}
              secondary={`${place.tags.tourism || ''} - ${place.lat}, ${place.lon}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6">Other Places</Typography>
      <List>
        {places.other.map((place, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={place.tags.name || 'Place'}
              secondary={`${place.tags.tourism || ''} - ${place.lat}, ${place.lon}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default CreateTrip;