
const express = require('express');
const { createTrip, getTripDetails, deleteTrip,getTripsAndItinerary,getTripsForUser } = require('../controllers/trip.controller');

const router = express.Router();
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(404).json({ error: 'No session found' });
    }
});

router.post('/trips', createTrip);  // Route to create a trip
router.get('/view-trips/:userId',getTripsForUser);
router.get('/trips/:tripId', getTripDetails);  // Route to get trip details
router.delete('/trips/:tripId', deleteTrip);  // Route to delete a trip


module.exports = router;


