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
    
    </div>
  );
};

export default HomePage;