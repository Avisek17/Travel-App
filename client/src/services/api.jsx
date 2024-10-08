// services/api.js
export const createUser = async (userData) => {
    const response = await fetch('http://localhost:8000/api/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error('Signup failed');
    }

    return response.json();
};


// src/services/api.js

// Function to fetch coordinates from an external API
const fetchCoordinates = async (destination) => {
    const OPENCAGE_API_KEY = '5e20dfafb98f41588eb7bbc9f525045f';  // Replace with your API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(destination)}&key=${OPENCAGE_API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch coordinates');
        }
        const data = await response.json();
        const result = data.results[0];

        const lat = result.geometry.lat;
        const lng = result.geometry.lng;

        return { lat, lng };
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw new Error('Failed to fetch coordinates');
    }
};

// Function to create a new trip
export const createTrip = async (tripData) => {
    const { destination, ...rest } = tripData;
    
    // Fetch coordinates for the destination
    const { lat, lng } = await fetchCoordinates(destination);

    // Send trip data along with fetched coordinates to the server
    const response = await fetch('http://localhost:8000/api/Trip/trips', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...rest,
            destination_lat: lat,
            destination_lng: lng
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create trip');
    }

    return response.json();
};

// Function to fetch trip details by ID
export const getTripDetails = async (tripId) => {
    const response = await fetch(`http://localhost:8000/api/trip/${tripId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch trip details');
    }

    return response.json();
};

// Function to delete a trip by ID
export const deleteTrip = async (tripId) => {
    const response = await fetch(`http://localhost:8000/api/trip/${tripId}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete trip');
    }

    return response.json();
};
