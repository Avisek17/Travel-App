



import NavBar from '../components/Navbar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const TripDetails = () => {
    const { trip_id } = useParams();
    const [tripDetails, setTripDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/Trip/trips/${trip_id}`, { withCredentials: true });
                setTripDetails(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data || 'Error fetching trip details');
                setLoading(false);
            }
        };

        fetchTripDetails();
    }, [trip_id]);

    const formatActivities = (activities) => {
        if (!activities || activities.length === 0) return [];
        try {
            return JSON.parse(activities);
        } catch (error) {
            console.error('Error parsing activities:', error);
            return [];
        }
    };

    const formatPlaces = (places) => {
        if (!places || places.length === 0) return [];
        try {
            return JSON.parse(places);
        } catch (error) {
            console.error('Error parsing places:', error);
            return [];
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
    
        doc.setFontSize(16);
        doc.text(`Trip Name: ${tripDetails[0].trip_name || 'N/A'}`, 10, 10);
        doc.text(`Start Date: ${new Date(tripDetails[0].start_date).toLocaleDateString() || 'N/A'}`, 10, 20);
        doc.text(`Destination: ${tripDetails[0].destination || 'N/A'}`, 10, 30);
        doc.text(`Number of Days: ${tripDetails[0].num_of_days || 'N/A'}`, 10, 40);
    
        let yPosition = 50;
    
        doc.setFontSize(16);
        doc.text('Itineraries:', 10, yPosition);
        yPosition += 10;
    
        tripDetails.forEach((itinerary, index) => {
            if (yPosition > 270) { // Ensure we don't run off the page
                doc.addPage();
                yPosition = 10;
            }
    
            doc.setFontSize(12);
            doc.text(`Day ${itinerary.day_number || index + 1}`, 10, yPosition);
            yPosition += 10;
            
            doc.text(`Title: ${itinerary.notes || 'No title provided'}`, 10, yPosition);
            yPosition += 10;
            
            doc.text(`Notes: ${itinerary.notes || 'No notes provided'}`, 10, yPosition);
            yPosition += 10;
    
            // Process activities
            const activities = formatActivities(itinerary.activities);
            doc.text('Activities to do:', 10, yPosition);
            yPosition += 10;
            if (activities.length === 0) {
                doc.text('- No activities provided', 10, yPosition);
                yPosition += 10;
            } else {
                activities.forEach((activity, activityIndex) => {
                    doc.text(`- ${activity.name || 'Untitled Activity'}`, 10, yPosition);
                    yPosition += 10;
                });
            }
    
            // Process places
            const places = formatPlaces(itinerary.places);
            doc.text('Places to Visit:', 10, yPosition);
            yPosition += 10;
            if (places.length === 0) {
                doc.text('- No places provided', 10, yPosition);
                yPosition += 10;
            } else {
                places.forEach((place, placeIndex) => {
                    // Ensure valid place name, stripping special characters if necessary
                    const placeName = place.name?.replace(/[^\w\s]/gi, '') || 'Untitled Place';
                    doc.text(`- ${placeName}`, 10, yPosition);
                    yPosition += 10;
    
                    // Check if yPosition exceeds the page height
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 10;
                    }
                });
            }
    
            yPosition += 5; // Extra space between days
        });
    
        doc.save('trip-details.pdf');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <> 
        <NavBar />
        <div>
            <h2>Trip Details</h2>
            {tripDetails ? (
                <div>
                    <h3>Trip Name: {tripDetails[0].trip_name}</h3>
                    <p>Start Date: {new Date(tripDetails[0].start_date).toLocaleDateString()}</p>
                    <p>Destination: {tripDetails[0].destination}</p>
                    <p>Number of Days: {tripDetails[0].num_of_days}</p>

                    <h4>Itineraries:</h4>
                    {tripDetails.map((itinerary, index) => (
                        <div key={index} style={{ border: '1px solid #ccc', margin: '5px', padding: '10px' }}>
                            <h5>Day {itinerary.day_number}</h5>
                            <p>Title: {itinerary.notes || 'No titles provided'}</p>
                            <p>Notes: {itinerary.notes || 'No notes provided'}</p>
                            <p>Activities to do:</p>
                            {formatActivities(itinerary.activities).map((activity, activityIndex) => (
                                <div key={activityIndex}>
                                    <h4>{activity.name || 'Untitled Activity'}</h4>
                                    <p>Description: {activity.description || 'No description available'}</p>
                                </div>
                            ))}
                            <p>Places to Visit:</p>
                            {formatPlaces(itinerary.places).map((place, placeIndex) => (
                                <div key={placeIndex}>
                                    <p>{place.name || 'Untitled Place'}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button onClick={generatePDF}>Download Trip Details as PDF</button>
                </div>
                
            ) : (
                <p>No trip details available</p>
            )}
        </div></>
    );
};

export default TripDetails;
