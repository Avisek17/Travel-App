import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Itinerary = () => {
  const [tripId, setTripId] = useState(null); // Get trip ID from URL or user context
  const [itinerary, setItinerary] = useState([]);
  const [numDays, setNumDays] = useState(1); // Default number of days

  useEffect(() => {
    const fetchItinerary = async () => {
      if (tripId) {
        try {
          const response = await axios.get(`/api/itineraries/${tripId}`);
          setItinerary(response.data);
        } catch (error) {
          console.error('Error fetching itinerary:', error);
        }
      }
    };
    fetchItinerary();
  }, [tripId]);

  const handleAddItem = async (newItem, day) => {
    try {
      const response = await axios.post(`/api/itineraries/${tripId}/items`, { ...newItem, day });
      setItinerary([...itinerary, response.data]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = async (itemId, updatedItem) => {
    try {
      const response = await axios.put(`/api/itineraries/${tripId}/items/${itemId}`, updatedItem);
      setItinerary(itinerary.map(item => item._id === itemId ? response.data : item));
    } catch (error) {
      console.error('Error editing item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`/api/itineraries/${tripId}/items/${itemId}`);
      setItinerary(itinerary.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleNumDaysChange = (event) => {
    setNumDays(parseInt(event.target.value));
  };

  return (
    <div>
      <h1>Itinerary for {/* Display trip name based on tripId */}</h1>
      <label htmlFor="numDays">Number of Days:</label>
      <input type="number" id="numDays" value={numDays} min="1" onChange={handleNumDaysChange} />
      {Array.from({ length: numDays }, (_, day) => (
        <div key={day}>
          <h2>Day {day + 1}</h2>
          <ul>
            {itinerary.filter(item => item.day === day).map((item) => (
              <li key={item._id}>
                {item.name} ({item.estimatedTime} mins) - {item.activityType}
                <button onClick={() => handleEditItem(item._id, { /* Edit form logic */ })}>Edit</button>
                <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
              </li>
            ))}
          </ul>
          <button onClick={() => handleAddItem({ /* Add item form logic */ }, day)}>Add Item</button>
        </div>
      ))}
    </div>
  );
};

export default Itinerary;
