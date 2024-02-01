import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  // Function to fetch geolocation
  const fetchGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        setError('Geolocation is not supported by this browser.');
        reject('Geolocation is not supported by this browser.');
        return;
      }

      console.log("Requesting geolocation data");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          console.log("Geolocation data fetched in useGeolocation " + newLocation.latitude + " " + newLocation.longitude);
          resolve(newLocation);
        },
        (error) => {
          console.error("Error fetching geolocation: ", error.message);
          setError(error.message);
          reject(error.message);
        }
      );
    });
  };

  // Expose a method to manually fetch geolocation
  const fetchLocation = () => {
    return fetchGeolocation();
  };

  // Log the location whenever it changes
  useEffect(() => {
    console.log("Location changed in useGeolocation.js:", location.latitude, location.longitude);
  }, [location]);

  // Return location, error, and the fetchLocation method
  return { location, error, fetchLocation };
};

export default useGeolocation;
