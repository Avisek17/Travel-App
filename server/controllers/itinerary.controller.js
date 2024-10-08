const itineraryModel = require('../models/itinerary.model');
const axios = require('axios');

// 1. Get all itinerary items for a specific trip
const getItineraryByTrip = async (req, res) => {
    const { trip_id } = req.params;

    try {
        const itineraries = await itineraryModel.getItineraryByTripModel(trip_id);

        if (itineraries.length === 0) {
            return res.status(404).json({ message: "No itinerary found for this trip" });
        }

        res.status(200).json({ success: true, data: itineraries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching itinerary" });
    }
};

// 2. Create a new itinerary item

const db = require('../config/db');
const createItinerary = async (req, res) => {
    // Destructure user ID from session
    // const { id: userId } = req.session.user || {};
    const userId = req.session.user ? req.session.user.id : null;
    console.log('Session data:', req.session.user); // Log the session for debugging
    
    // Check if the user is authenticated
    // if (!userId) {
    //     return res.status(401).json({ message: 'User not authenticated' });
    // }

    const { trip_id, itinerary } = req.body;  // Destructure trip_id and itinerary data from request body

    // Ensure data is valid
    if (!trip_id || !itinerary || itinerary.length === 0) {
        return res.status(400).json({ error: "Trip ID and day-wise itinerary data are required" });
    }

    // Loop through each day's itinerary and store it in the database
    try {
        for (let day of itinerary) {
            const { day_number, title, notes, activities, places } = day;

            // SQL query to insert each day's data into the Itinerary table
            const query = `
                INSERT INTO Itinerary (trip_id, user_id, day_number, title, notes, activities, places)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            // Convert activities and places to JSON strings before inserting
            await db.execute(query, [
                trip_id,
                userId,  // Use userId from session
                day_number,
                title || null,  // Optional fields
                notes || null,  // Optional fields
                JSON.stringify(activities) || "[]",  // Default to empty array if no activities
                JSON.stringify(places) || "[]"       // Default to empty array if no places
            ]);
        }

        res.status(201).json({ message: 'Itinerary created successfully' });
    } catch (error) {
        console.error('Error inserting itinerary data:', error);
        res.status(500).json({ error: 'Error inserting itinerary data' });
    }
};

module.exports = { createItinerary };



// 3. Update an existing itinerary item
const updateItinerary = async (req, res) => {
    const { itinerary_id } = req.params;
    const itineraryData = req.body;

    try {
        const result = await itineraryModel.updateItineraryModel(itinerary_id, itineraryData);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Itinerary item not found" });
        }

        res.status(200).json({ success: true, message: "Itinerary item updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating itinerary item" });
    }
};

// 4. Delete an itinerary item
const deleteItinerary = async (req, res) => {
    const { itinerary_id } = req.params;

    try {
        const result = await itineraryModel.deleteItineraryModel(itinerary_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Itinerary item not found" });
        }

        res.status(200).json({ success: true, message: "Itinerary item deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting itinerary item" });
    }
};

module.exports = {
    getItineraryByTrip,
    createItinerary,
    updateItinerary,
    deleteItinerary
};
