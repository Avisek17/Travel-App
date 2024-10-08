const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = 'Your Api key'; 

// Route to get place suggestions
router.get('/places', async (req, res) => {
    const { input } = req.query;
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
            {
                params: {
                    input: input,
                    key: API_KEY,
                    libraries: 'places'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching places data:', error);
        res.status(500).json({ error: 'Failed to fetch places data' });
    }
});

module.exports = router;
