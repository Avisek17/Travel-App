

// src/models/TripModel.js

const pool=require('../config/db.js');

// Create a new trip
const createTripModel = async (tripData) => {
    const { userId, tripName, startDate, numOfDays, destination, destinationLat, destinationLng } = tripData;
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const formattedStartDate = formatDate(tripData.startDate);
      
    const sql = `INSERT INTO Trip (user_id, trip_name, start_date, num_of_days, destination, destination_lat, destination_lng) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.query(sql, [userId, tripName, startDate, numOfDays, destination, destinationLat, destinationLng]);
    return result;
};

const getTripsForUserModel = async (userId) => {
    
    const query = `SELECT * FROM Trip WHERE user_id = ?`; // Assuming Trip table has a column user_id
    try {
        const [rows] = await pool.execute(query, [userId]); // Use db.execute to run the query
        return rows; // Returns the list of trips for the user
    } catch (error) {
        console.error("Error fetching trips from database:", error);
        throw error; // Throw error to be caught by the controller
    }
};

const getTripDetailsModel = async (trip_id) => {
    const sql = `
        SELECT 
            t.trip_id, t.trip_name, t.start_date, t.num_of_days, t.destination, t.destination_lat, t.destination_lng, i.notes, i.activities,i.places, i.day_number
        FROM 
            Trip t
        LEFT JOIN 
            Itinerary i ON t.trip_id = i.trip_id
        WHERE 
            t.trip_id = ?
    `;

    try {
        const [results] = await pool.query(sql, [trip_id]);
        return results;
    } catch (error) {
        console.error('Error fetching trip details:', error);
        throw error; 
    }
};


// Delete a trip by ID along with its associated itinerary
const deleteTripModel = async (trip_id) => {
    try {
        const conn = await pool.getConnection();

        // First, delete associated itinerary entries
        const deleteItinerarySql = `DELETE FROM Itinerary WHERE trip_id = ?`;
        await conn.query(deleteItinerarySql, [trip_id]);

        // Then, delete the trip
        const deleteTripSql = `DELETE FROM Trip WHERE trip_id = ?`;
        const [result] = await conn.query(deleteTripSql, [trip_id]);

        conn.release();
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    createTripModel,
    getTripDetailsModel,
    deleteTripModel,
    getTripsForUserModel
};

