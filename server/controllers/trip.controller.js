 // src/controllers/TripController.js

const { createTripModel, getTripDetailsModel, deleteTripModel,getTripsForUserModel } = require('../models/trip.model');
const axios = require('axios');
const db = require('../config/db');

// Create a new trip controller
const createTrip = async (req, res) => {
    const { id: userId } = req.session.user || {};
    console.log('Session:', req.session.user); // Add this line
   

    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    
    try {
        const { tripName, startDate, numOfDays, destination } = req.body;
        const userId=req.session.user.id;
         const { lat, lng } = await fetchCoordinates(destination);
   

        const tripData = {
            userId,
            tripName,
            startDate,
            numOfDays,
            destination,
            destinationLat: lat,
            destinationLng: lng,
        };

        const result = await createTripModel(tripData);
        res.status(201).json({ message: 'Trip created successfully!', tripId: result.insertId,tripName: tripName });
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ error: 'Failed to create trip' });
    }
};

const getTripsForUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const trips = await  getTripsForUserModel(userId);
        if (trips.length === 0) {
            return res.status(404).json({ message: 'No trips found for this user' });
        }
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error });
    }
};

const getTripDetails = async (req, res) => {
    const { tripId } = req.params;
    
    try {
        const tripDetails = await getTripDetailsModel(tripId);
        // Check if tripDetails is not empty and respond accordingly
        if (tripDetails.length > 0) {
            res.json(tripDetails);
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    } catch (error) {
        console.error('Error fetching trip details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Delete a trip controller
const deleteTrip = async (req, res) => {
    const tripId = req.params.tripId;

    try {
        const result = await deleteTripModel(tripId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).json({ error: 'Failed to delete trip' });
    }
};

const fetchCoordinates = async (destination) => {
    const API_KEY = 'AIzaSyCEiojsFm3pm6cKnmAdffu9GYih2rzqt7I';

    // Construct the URL using the destination as input for location search
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(destination)}&inputtype=textquery&fields=geometry&key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const result = response.data.candidates[0];  // Access the first search result

        if (!result) {
            throw new Error('No results found for the given destination');
        }

        // Fetch lat and lng from the geometry of the result
        const lat = result.geometry.location.lat;
        const lng = result.geometry.location.lng;

        return { lat, lng };
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw new Error('Failed to fetch coordinates');
    }
};

module.exports = {
    createTrip,
    getTripDetails,
    deleteTrip,
    getTripsForUser
};
