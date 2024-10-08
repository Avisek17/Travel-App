
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, CircularProgress, Box } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';  
import { useNavigate } from 'react-router-dom';
import PlacesAutocomplete from 'react-places-autocomplete';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import NavBar from '../components/Navbar';

import './CreateTripForm.css';  

// const API_KEY = 'AIzaSyCEiojsFm3pm6cKnmAdffu9GYih2rzqt7I';
const containerStyle = { width: '100%', height: '400px' };
const center = { lat: 27.7172, lng: 85.3240 }; 

function CreateTrip() {
    const [trips, setTrip] = useState({ name: '', itinerary: [], startDate: null, numOfDays: 1, user_id: null });
    const [destination, setDestination] = useState({ name: '', lat: '', lng: '' });
    const [loading, setLoading] = useState(false);
    const [map, setMap] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch session data on component mount
        const fetchSessionData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/Trip/session', { withCredentials: true });
                if (response.data && response.data.id) {
                    setTrip(prevTrips => ({ ...prevTrips, user_id: response.data.id }));
                }
            } catch (error) {
                console.error('Error fetching session data:', error);
            }
        };

        fetchSessionData();
    }, []);

    const handleChange = (e) => {
        setTrip({ ...trips, [e.target.name]: e.target.value });
    };

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setDestination({ name: '', lat: lat.toFixed(6), lng: lng.toFixed(6) });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!trips.startDate) {
            alert('Please enter a start date.');
            return;
        }
        if (trips.numOfDays < 1) {
            alert('Number of days must be at least 1.');
            return;
        }
        const formatDate = (date) => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        const formattedStartDate = formatDate(trips.startDate);
        
        try {
            const response=await axios.post('http://localhost:8000/api/Trip/trips', {
                ...trips,
                tripName: trips.name,
                startDate: formattedStartDate,
                destination: destination.name,
                destination_lat: destination.lat,
                destination_lng: destination.lng
            },{
                withCredentials: true
            });
            // Log the response to check if it contains tripId and tripName
        console.log('Response from server:', response);

        // Destructure the response data to get tripId and tripName
        const { tripId, tripName } = response.data;

        // Log the extracted values for debugging
        console.log('Trip ID:', tripId);
        console.log('Trip Name:', tripName);
            // navigate('/itinerary-builder', { state: { trip: trips } });
         
        navigate(`/itinerary-builder/${tripId}`, { state: { tripName, destination} });
        } catch (error) {
            console.error('Error creating trip:', error);
        }
    };

    const handleDestinationChange = (value) => {
        setDestination(prev => ({ ...prev, name: value }));
        // Trigger suggestions only when 2 or more characters are entered
        if (value.length >= 2) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    };

    return (
        <>
        <div><NavBar></NavBar></div>
        <Container maxWidth="sm" className="create-trip-form" sx={{
            marginTop:"100px"
         } }>
            <Typography variant="h4" align="center" gutterBottom>
                Create a Trip
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Trip Name"
                    name="name"
                    value={trips.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Number of Days"
                    type="number"
                    name="numOfDays"
                    value={trips.numOfDays}
                    onChange={handleChange}
                    min="1"
                    fullWidth
                    margin="normal"
                    required
                />

                <label className="custom-label">Start Date</label>
                <DatePicker
                    selected={trips.startDate}
                    onChange={date => setTrip({ ...trips, startDate: date })}
                    dateFormat="yyyy/MM/dd"
                    minDate={new Date()}  
                    placeholderText="Select a start date"
                    className="custom-date-picker"
                    required
                />
                <PlacesAutocomplete
                    value={destination.name}
                    onChange={handleDestinationChange}
                    onSelect={(address) => setDestination(prev => ({ ...prev, name: address }))}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                        <div>
                            <TextField
                                {...getInputProps({ placeholder: 'Enter destination' })}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        </>
                                    ),
                                }}
                            />
                            <div>
                                {suggestions.map((suggestion) => (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            style: { cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }
                                        })}
                                    >
                                        {suggestion.description}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>

                <Box mt={3}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Create Trip
                    </Button>
                </Box>
            </form>
        </Container>
        </>
    );
}

export default CreateTrip;