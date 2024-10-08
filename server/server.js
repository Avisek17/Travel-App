// server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const userRouter = require("./routers/users.router.js");
const itineraryRouter = require('./routers/itinerary.router.js');
const tripRouter = require('./routers/trip.router.js');
const googlePlacesRouter = require('./routers/googlePlaces');
const cors = require('cors');
const axios = require('axios');
 const pool = require('./config/db.js');
// const db = require('./config/db');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', // or the origin of your frontend
    credentials: true // This allows cookies to be sent with requests
}));


const sessionStore = new session.MemoryStore(); 
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { 
        secure: false, 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
        sameSite: 'lax' 
    }
}));


app.use("/api/user", userRouter);
app.use("/api/itinerary", itineraryRouter);
app.use("/api/Trip", tripRouter);
app.use('/api/google', googlePlacesRouter);
app.get('/api/session', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(404).json({ error: 'No session found' });
    }
});


app.get('/api/Trip/session', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user }); // Return the user object from session
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});
app.get('/api/itinerary/session', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(404).json({ error: 'No session found' });
    }
});



app.post('/api/Trip', (req, res) => {
    // Log the entire request body
    console.log('Received request body:', req.body);
  
    const { trip_name, start_date, num_of_days, destination, destination_lat, destination_lng, user_id } = req.body;
  
  
    // Continue with your trip creation logic
    if (!trip_name || !start_date || !num_of_days || !destination || !destination_lat || !destination_lng || !user_id) {
      console.log('Error: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    // Simulate creating a trip (you'll likely insert into your database here)
    console.log('Trip is being created...');
    res.status(200).json({ message: 'Trip created successfully' });
  });

  app.post('/api/itinerary/create', (req, res) => {
    try {
        const { itinerary } = req.body;
        console.log('Received itinerary:', itinerary);

        // Process the itinerary here...
        res.status(200).json({ message: 'Itinerary created successfully' });
    } catch (error) {
        console.error('Error creating itinerary:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


const API_KEY = 'AIzaSyCEiojsFm3pm6cKnmAdffu9GYih2rzqt7I';

app.get('/api/places', async (req, res) => {
  const { input } = req.query;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Google Places data' });
  }
});

app.use((req, res, next) => {
    console.log('Sessions :', req.session); // Log session data
    next();
});
async function getUserFromDatabase(username) {
    try {
        const [rows] = await db.query('SELECT * FROM User WHERE user_name = ?', [username]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Database error in getUserFromDatabase:', error);
        throw error;
    }
}

app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT id, username FROM User WHERE username = ? AND password = ?';
    
    pool.query(query, [username, password], (err, results) => {
      if (err) return res.status(500).send('Server error');
      if (results.length === 0) return res.status(401).send('Invalid credentials');
  
      // Assuming valid login, set session data
      req.session.user = { id: results[0].id, username: results[0].username };
  
      // Send the user id in response
      res.json({ id: results[0].id, username: results[0].username });
    });
  });
  


const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
