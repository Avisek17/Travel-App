// loadGoogleMaps.jsx
export const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = resolve; // Resolve promise when script loads
      script.onerror = () => reject(new Error('Failed to load Google Maps API'));
    } else {
      resolve(); // Resolve immediately if already loaded
    }
  });
};
