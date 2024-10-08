







const pool = require('../config/db');
// Fetch all itinerary items for a specific trip
const getItineraryByTripModel = async (Trip_id, user_id) => {
    const sql = `SELECT * FROM Itinerary WHERE Trip_id = ? AND user_id = ?`;
    const [result] = await pool.query(sql, [Trip_id, user_id]);
    return result;
};


const createItineraryModel = async (itineraryData) => {
    console.log("Itenary model data:",itineraryData);
    const { trip_id, user_id, day_number, title, notes, activities, places } = itineraryData;
    const sql = `
        INSERT INTO Itinerary (trip_id, user_id, day_number, title, notes, activities, places) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    // Ensure activities and places are stringified if they are objects/arrays
    const [result] = await pool.query(sql, [
        trip_id, 
         user_id, 
        day_number, 
        title || '',  // Default empty string if title is not provided
        notes || '',  // Default empty string if notes are not provided
        JSON.stringify(activities) || '[]', // Default empty JSON array if activities are not provided
        JSON.stringify(places) || '[]'  // Default empty JSON array if places are not provided
    ]);
    return result;
};







// Update an itinerary item
const updateItineraryModel = async (itinerary_id, itineraryData) => {
    const { title, notes, activities, places } = itineraryData;
    const sql = `UPDATE Itinerary SET title = ?, notes = ?, activities = ?, places = ? WHERE itinerary_id = ?`;
    const [result] = await pool.query(sql, [title, notes, JSON.stringify(activities), JSON.stringify(places), itinerary_id]);
    return result;
};

// Delete an itinerary item
const deleteItineraryModel = async (itinerary_id) => {
    const sql = `DELETE FROM Itinerary WHERE itinerary_id = ?`;
    const [result] = await pool.query(sql, [itinerary_id]);
    return result;
};

module.exports = {
    getItineraryByTripModel,
    createItineraryModel,
    updateItineraryModel,
    deleteItineraryModel
};


// const day = ['day1','day2']
// const title = ["Pasupati","Manakamana"];