


import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Container from '@mui/material/Container';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo-no-background.png';
import axios from 'axios';

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tripAnchorEl, setTripAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);
  
 

  
  const isMenuOpen = Boolean(anchorEl);
  const isTripMenuOpen = Boolean(tripAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTripMenuOpen = (event) => {
    setTripAnchorEl(event.currentTarget);
  };

  const handleTripMenuClose = () => {
    setTripAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');  // Remove auth status
    setIsAuthenticated(false);
    navigate('/');
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {!isAuthenticated ? (
        <>
          <MenuItem onClick={handleMenuClose}>
            <Link to="/signup">Sign Up</Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link to="/login">Login</Link>
          </MenuItem>
        </>
      ) : (
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      )}
    </Menu>
  );

  const tripMenuId = 'trip-menu';
  const renderTripMenu = (
    <Menu
      anchorEl={tripAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      id={tripMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={isTripMenuOpen}
      onClose={handleTripMenuClose}
    >
      <MenuItem onClick={handleTripMenuClose}>
        <Link to="/trips">Create New Trip</Link>
      </MenuItem>
      <MenuItem onClick={handleTripMenuClose}>
        <Link to="/view-trips">View Trips</Link>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', padding: '0px' }}>
        <Container maxWidth="false">
          <Toolbar>
            <Box
              sx={{
                display: 'flex',
                left: 0,
                position: 'absolute',
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  height: '60px',
                  width: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'black',
                  display: 'flex',
                  backgroundImage: `url(${logo})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ color: 'black', marginRight: 'auto' }}
              >
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Travel Planner
                </Link>
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                position: 'absolute',
                right: 0,
              }}
            >
              <Button
                onClick={handleTripMenuOpen}
                sx={{
                  '&:hover': {
                    backgroundColor: '#F7F7F7',
                  },
                  borderRadius: '50px',
                  color: 'black',
                }}
              >
                Trip
              </Button>

              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle sx={{ color: 'black' }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMenu}
      {renderTripMenu}
    </Box>
  );
}
