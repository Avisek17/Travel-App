
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import CreateTrip from './components/CreateTripForm'; // Create these components
import ItineraryBuilder from './components/ItineraryBuilder';
import PlaceSearch from './components/PlaceSearch';
import ViewTrips from './components/ViewTrips';
import TripDetails from './components/TripDetails';


const App=()=> {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trips" element={<CreateTrip />} />
        <Route path="/login" element={<LoginForm />} />
       <Route path="/signup" element={<SignupForm />} />
       <Route path="/itinerary-builder/:tripId" element={<ItineraryBuilder />} />
       <Route path="/place-search" element={<PlaceSearch/>} />
       <Route path="/view-trips" element={<ViewTrips />} />
       <Route path="/trip/:trip_id" element={<TripDetails />} />
      </Routes>
    </Router>
  );
}
export default App;