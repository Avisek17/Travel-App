export const fetchNearbyPlaces = (map, google, center) => {
    if (!center || !center.lat || !center.lng) {
      return Promise.reject(new Error('Invalid center location'));
    }
  
    const radius = 5000; 
    const types = ['hindu_temple', 'park', 'museum', 'water_park','amusement_park'];
  
    const fetchPlacesByType = (type) => {
      return new Promise((resolve, reject) => {
        const service = new google.maps.places.PlacesService(map);
        const request = {
          location: center,
          radius,
          type, 
        };
  
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(results);
          } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            resolve([]);
          } else {
            reject({
              error: `Places search failed for type ${type} with status: ${status}`,
              status,
            });
          }
        });
      });
    };
  
   
    return Promise.all(types.map(fetchPlacesByType)).then((results) => {
      return results.flat();
    });
  };