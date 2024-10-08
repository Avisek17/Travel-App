import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="header">
        <div className="logo">TripPlanner</div>
        <nav className="navbar">
          <a href="#">Home</a>
          <a href="#">Destinations</a>
          <a href="#">Trips</a>
          <a href="#">Contact</a>
        </nav>
      </header>
      
      <section className="hero">
        <h1>Plan Your Perfect Trip</h1>
        <p>Discover and book amazing experiences worldwide.</p>
        <button className="cta-button">Get Started</button>
      </section>
      
      {/* <section className="features">
        <div className="feature">
          <img src="../../public/logo512.png" alt="Explore" />
          <h3>Explore Destinations</h3>
          <p>Find the best places to visit around the world.</p>
        </div>
        <div className="feature">
          <img src="../../public/logo512.png" alt="Plan" />
          <h3>Plan Your Itinerary</h3>
          <p>Create detailed itineraries for your trips.</p>
        </div>
        <div className="feature">
          <img src="../../public/logo512.png" alt="Book" />
          <h3>Book Activities</h3>
          <p>Reserve tours, activities, and more with ease.</p>
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;