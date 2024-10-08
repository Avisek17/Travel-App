import React from 'react';
import NavBar from './Navbar';
import HeroSection from './HeroSection';

const HomePage = () => {
  return (
    <div style={{height:'100vh',width:'100%'}}>
      <NavBar />
      <HeroSection />
    </div>
  );
};

export default HomePage;
