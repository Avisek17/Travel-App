
import React from 'react';
import { Box, Typography, TextField, InputAdornment, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import heroImage from '../assets/images/background.png';
 // Ensure the image is in the assets folder

const HeroSection = () => {
  const handleSearch = (category) => {
    // Implement the search functionality for the specific category
    console.log(`Searching for: ${category}`);
    // You can redirect to search results page or perform search action here
  };

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)', // Adjust height to subtract the AppBar height
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        // border:"10px solid blue",
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '0 20px',
        color: 'black',
      }}
    >
        <Box sx={{
            padding:"0px 20px",
            // border:"1px solid black",
            marginBottom:"500px",
            maxwidth:"100%"
        }}>
      {/* <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Kata Haau?
      </Typography> */}
      <Box sx={{ width: '100%', maxWidth: 1000, marginBottom: 3 }}>
        {/* <TextField
          placeholder="Places to go, things to do, hotels..."
          variant="outlined"
          fullWidth
          sx={{
            backgroundColor: 'white',
            borderRadius: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: 5,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        /> */}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {/* <Button 
          variant="outlined" 
          sx={{ color: 'black', borderColor: 'black',borderRadius:"20px", 
          }} 
          onClick={() => handleSearch('all')}
        >
          Search All
        </Button>
        <Button 
          variant="outlined" 
          sx={{ color: 'black', borderColor: 'black',borderRadius:"20px" }} 
          onClick={() => handleSearch('hotels')}
        >
          Hotels
        </Button>
        <Button 
          variant="outlined" 
          sx={{ color: 'black', borderColor: 'black',borderRadius:"20px" }} 
          onClick={() => handleSearch('things_to_do')}
        >
          Things to Do
        </Button>
        <Button 
          variant="outlined" 
          sx={{ color: 'black', borderColor: 'black',borderRadius:"20px" }} 
          onClick={() => handleSearch('restaurants')}
        >
          Restaurants
        </Button> */}
        
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;