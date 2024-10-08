


const express = require('express');
const { createItinerary, getItineraryByTrip, updateItinerary, deleteItinerary } = require('../controllers/itinerary.controller');
const router = express.Router();
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(404).json({ error: 'No session found' });
    }
});

// Route to create a new itinerary item
router.post('/create', createItinerary);

// Route to get all itinerary items for a specific trip
router.get('/trip/:Trip_id', getItineraryByTrip);

// Route to update an existing itinerary item
router.put('/update/:itinerary_id', updateItinerary);

// Route to delete an itinerary item
router.delete('/delete/:itinerary_id', deleteItinerary);

router.post('/create', async (req, res) => {
    try {
        const { itinerary } = req.body;
        
        console.log('Received Itinerary Data:', JSON.stringify(itinerary, null, 2)); // Log received data

        if (Array.isArray(itinerary)) {
            for (const item of itinerary) {
                await createItineraryModel(item);
            }
            res.status(200).json({ message: 'Itinerary created successfully' });
        } else {
            res.status(400).json({ message: 'Invalid itinerary data' });
        }
    } catch (error) {
        console.error('Error creating itinerary:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
