import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, CircularProgress } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import MapContainer from './MapContainers';
import { useNavigate } from 'react-router-dom';

const CreateItineraryForm = () => {
    const { tripId } = useParams();
    const location = useLocation();
    const [tripName, setTripName] = useState('');
    const [destination, setDestination] = useState('');
    const [destination_lat, setDestinationlat] = useState('');
    const [destination_lng, setDestinationlng] = useState('');
    const [days, setDays] = useState([]);
    const [itineraryData, setItineraryData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [currentPlace, setCurrentPlace] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const tripResponse = await axios.get(`http://localhost:8000/api/Trip/trips/${tripId}`);
                
                const tripDetails = tripResponse.data[0];
                const { trip_name, num_of_days, destination, destination_lat, destination_lng } = tripDetails;
                setTripName(trip_name);
                setDestination(destination);
                setDestinationlat(destination_lat);
                setDestinationlng(destination_lng);
                
                const daysArray = Array.from({ length: num_of_days }, (_, index) => ({
                    dayNumber: index + 1,
                    title: '',
                    notes: '',
                    activities: [],
                    places: []  
                }));
                
                setDays(daysArray);
                setItineraryData(
                    daysArray.reduce((acc, day) => ({
                        ...acc,
                        [day.dayNumber]: day
                    }), {})
                );
            } catch (error) {
                console.error('Error fetching trip details:', error);
                setError('Failed to load trip details');
            } finally {
                setLoading(false);
            }
        };

        fetchTripDetails();
    }, [tripId, location.state]);
    const fetchSessionData = async () => {
                try {
                    const response = await axios.get('http://localhost:8000/api/Trip/session', { withCredentials: true });
                    if (response.data && response.data.id) {
                        setUserId(response.data.id);
                        sessionStorage.setItem('userId', response.data.id);
                    } else {
                        console.error('No user ID found in session data.');
                    }
                } catch (error) {
                    console.error('Error fetching session data:', error);
                }
            };
            
            useEffect(() => {
                const storedUserId = sessionStorage.getItem('userId');
                if (storedUserId) {
                    setUserId(storedUserId);
                } else {
                    fetchSessionData();
                }
            }, []);

    const handleInputChange = (e, dayNumber, field) => {
        const { value } = e.target;
        setItineraryData(prev => ({
            ...prev,
            [dayNumber]: {
                ...prev[dayNumber],
                [field]: value
            }
        }));
    };

    const handleActivityChange = (e, dayNumber, activityIndex, field) => {
        const { value } = e.target;
        setItineraryData(prev => {
            const updatedActivities = [...prev[dayNumber].activities];
            updatedActivities[activityIndex] = {
                ...updatedActivities[activityIndex],
                [field]: value
            };
            return {
                ...prev,
                [dayNumber]: {
                    ...prev[dayNumber],
                    activities: updatedActivities
                }
            };
        });
    };

    const handleAddActivity = (dayNumber) => {
        setItineraryData(prev => {
            const updatedActivities = [...prev[dayNumber].activities, { name: '', description: '' }];
            return {
                ...prev,
                [dayNumber]: {
                    ...prev[dayNumber],
                    activities: updatedActivities
                }
            };
        });
    };

    const handlePlaceSelect = (place) => {
        setCurrentPlace(place);
    };

    // Add place to a specific day in the itinerary
    const addPlaceToItinerary = (dayNumber) => {
        if (currentPlace) {
            setItineraryData(prev => ({
                ...prev,
                [dayNumber]: {
                    ...prev[dayNumber],
                    places: [...(prev[dayNumber].places || []), currentPlace]
                }
            }));
            setCurrentPlace(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!tripId) {
            alert('Trip ID is missing.');
            return;
        }
        if (!userId) {
            alert('User ID is missing. Please log in again.');
            return;
        }
        const trip_id = tripId;

        const itineraryDataToSend = days.map(day => ({
            user_id: userId,
            day_number: day.dayNumber,
            title: itineraryData[day.dayNumber]?.title || '',
            notes: itineraryData[day.dayNumber]?.notes || '',
            activities: itineraryData[day.dayNumber]?.activities || [],
            places: itineraryData[day.dayNumber]?.places || []
        }));

        try {
            await axios.post('http://localhost:8000/api/itinerary/create', {
                trip_id,
                itinerary: itineraryDataToSend
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            alert('Itinerary created successfully');
            navigate('/');
        } catch (error) {
            console.error('Error creating itinerary:', error.response?.data || error.message);
            alert('Error creating itinerary');
        }
    };

    if (loading) {
        return (
            <Container maxWidth="sm" align="center">
                <CircularProgress />
                <Typography variant="h6">Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" align="center">
                <Typography variant="h6" color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom>Create Itinerary for Trip: {tripName}</Typography>

            <Box display="flex" flexDirection="row" justifyContent="space-between">
                {/* Itinerary Form */}
                <Box flex={1} mr={2}>
                    <form onSubmit={handleSubmit}>
                        {days.map(day => (
                            <div key={day.dayNumber}>
                                <Typography variant="h6">Day {day.dayNumber}</Typography>
                                <TextField
                                    label="Title"
                                    value={itineraryData[day.dayNumber]?.title || ''}
                                    onChange={(e) => handleInputChange(e, day.dayNumber, 'title')}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Notes"
                                    value={itineraryData[day.dayNumber]?.notes || ''}
                                    onChange={(e) => handleInputChange(e, day.dayNumber, 'notes')}
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={4}
                                />
                                <Typography variant="h6" gutterBottom>Activities</Typography>
                                {itineraryData[day.dayNumber]?.activities.map((activity, activityIndex) => (
                                    <Box key={activityIndex} mb={2}>
                                        <TextField
                                            label="Activity Name"
                                            value={activity.name || ''}
                                            onChange={(e) => handleActivityChange(e, day.dayNumber, activityIndex, 'name')}
                                            fullWidth
                                            margin="normal"
                                            required
                                        />
                                        <TextField
                                            label="Activity Description"
                                            value={activity.description || ''}
                                            onChange={(e) => handleActivityChange(e, day.dayNumber, activityIndex, 'description')}
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={2}
                                        />
                                    </Box>
                                ))}
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleAddActivity(day.dayNumber)}
                                >
                                    Add Activity
                                </Button>

                                {/* Display Places for this day */}
                                <Typography variant="h6" gutterBottom>Places for Day {day.dayNumber}</Typography>
                                {itineraryData[day.dayNumber]?.places.map((place, index) => (
                                    <Typography key={index} variant="body1">
                                        {place.name} - {place.vicinity}
                                    </Typography>
                                ))}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => addPlaceToItinerary(day.dayNumber)}
                                    disabled={!currentPlace}
                                >
                                    Add Selected Place to Day {day.dayNumber}
                                </Button>
                            </div>
                        ))}
                        <Box mt={3}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Save Itinerary
                            </Button>
                        </Box>
                    </form>
                </Box>

                {/* Map for selecting places */}
                <Box flex={1} ml={2}>
                    <Typography variant="h5" align="center" gutterBottom>Select Places of Interest</Typography>
                    <MapContainer
                        destination={destination}
                        destination_lat={destination_lat}
                        destination_lng={destination_lng}
                        onPlaceSelect={handlePlaceSelect}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default CreateItineraryForm;