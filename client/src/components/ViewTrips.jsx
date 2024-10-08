


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';

const ViewTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState();  
    const [tripToDelete, setTripToDelete] = useState(null);  // Track which trip is being deleted
    const navigate = useNavigate();

    const fetchSessionData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/Trip/session', { withCredentials: true });
            if (response.data && response.data.id) {
                setUserId(response.data.id);  
                sessionStorage.setItem('userId', response.data.id);  
            } else {
                console.error('No user ID found in session data.', response.data);
            }
        } catch (error) {
            console.error('Error fetching session data:', error);
        }
    };

    useEffect(() => {
        fetchSessionData();  
    }, []);

    useEffect(() => {
        const fetchTrips = async () => {
            const storedUserId = sessionStorage.getItem('userId');  
            if (!storedUserId) {
                setError('User ID not found in sessionStorage');
                setLoading(false);
                return;  
            }

            const tripsUrl = `http://localhost:8000/api/Trip/view-trips/${storedUserId}`;
            try {
                const response = await axios.get(tripsUrl, { withCredentials: true });
                setTrips(response.data);  
                setLoading(false);
            } catch (error) {
                setError(error.response?.data || 'Error fetching trips');
                setLoading(false);
            }
        };
        if (userId) {
            fetchTrips();  
        }
    }, [userId]);  

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleCardClick = (trip_id) => {
        navigate(`/trip/${trip_id}`);  
    };

    const handleDeleteTrip = async (trip_id) => {
        try {
            await axios.delete(`http://localhost:8000/api/Trip/trips/${trip_id}`, { withCredentials: true });
            setTrips(trips.filter(trip => trip.trip_id !== trip_id));  // Update the state
            setTripToDelete(null);  // Reset delete state
            alert('Trip deleted successfully.');
        } catch (error) {
            alert('Error deleting trip: ' + (error.response?.data || 'Unknown error'));
        }
    };

    const handleConfirmDelete = (trip_id) => {
        setTripToDelete(trip_id);  // Show confirmation for this trip
    };

    const handleCancelDelete = () => {
        setTripToDelete(null);  // Cancel deletion
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
        <NavBar />
        <div>
            <h2>Your Trips</h2>
            <Grid container spacing={3}>
                {trips.length > 0 ? (
                    trips.map(trip => (
                        <Grid item xs={12} sm={6} md={4} key={trip.tripId}>
                            <Card style={{ cursor: 'pointer' }}>
                                <CardContent onClick={() => handleCardClick(trip.trip_id)}>
                                    <Typography variant="h5">Trip Name: {trip.trip_name}</Typography>
                                    <Typography variant="body2">
                                        Start Date: {formatDate(trip.start_date)}
                                    </Typography>
                                    <Typography variant="body2">
                                        Destination: {trip.destination}
                                    </Typography>
                                    <Typography variant="body2">
                                        Trip Days: {trip.num_of_days}
                                    </Typography>

                                    {/* If the user is trying to delete this trip, show confirmation message */}
                                    {tripToDelete === trip.trip_id ? (
                                        <>
                                            <Typography variant="body2" color="error">
                                                Are you sure you want to delete this trip?
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={(e) =>{  e.stopPropagation(); 
                                                    handleDeleteTrip(trip.trip_id)}}
                                                style={{ marginTop: '10px', marginRight: '10px' }}
                                            >
                                                Yes, Delete
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={(e) => {
                                               e.stopPropagation();  // Prevent card click
                                                 handleCancelDelete();
                                                                 }}
                                                style={{ marginTop: '10px' }}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={(e) => {
                                                e.stopPropagation();  // Prevent card click
                                                handleConfirmDelete(trip.trip_id);
                                            }}
                                            style={{ marginTop: '10px' }}
                                        >
                                            Delete Trip
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography>No trips available</Typography>
                )}
                </Grid>
            </div>
        </>
        );
    };
    
    export default ViewTrips;