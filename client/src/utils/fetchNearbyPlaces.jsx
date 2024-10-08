// src/utils/fetchNearbyPlaces.js

import axios from 'axios';

export const fetchNearbyPlaces = async (lat, lng) => {
  const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:3000,${lat},${lng})[tourism~"attraction|museum|hotel|guest_house|hostel|motel|restaurant|cafe|pub|bar|fast_food|theme_park|water_park"];out;`;
  
  try {
    const response = await axios.get(overpassUrl);
    const elements = response.data.elements;

    const categorizedPlaces = {
      historical: [],
      restaurant: [],
      adventure: [],
      other: [],
    };

    elements.forEach(place => {
      if (place.tags.tourism === 'attraction' || place.tags.tourism === 'museum') {
        categorizedPlaces.historical.push(place);
      } else if (place.tags.amenity === 'restaurant' || place.tags.amenity === 'cafe' || place.tags.amenity === 'bar' || place.tags.amenity === 'pub' || place.tags.amenity === 'fast_food') {
        categorizedPlaces.restaurant.push(place);
      } else if (place.tags.tourism === 'theme_park' || place.tags.tourism === 'water_park') {
        categorizedPlaces.adventure.push(place);
      } else {
        categorizedPlaces.other.push(place);
      }
    });

    return categorizedPlaces;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return {
      historical: [],
      restaurant: [],
      adventure: [],
      other: [],
    };
  }
};