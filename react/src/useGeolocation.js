// Import from react
// useState is a Hook that lets you add React state to function components.
// useEffect is a Hook that lets you perform side effects in function components.
import { useState, useEffect } from 'react';

// Custom hook for geolocation
const useGeolocation = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  // Function to fetch geolocation
  const fetchGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    // Get current position as latitude and longitude from the browser
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setError(error.message);
      }
    );
  };

  // Call fetchGeolocation function on component mount
  useEffect(() => {
    fetchGeolocation();
  }, []);

  // Return location and error state
  return { location, error };
};

// Export the custom hook
export default useGeolocation;
