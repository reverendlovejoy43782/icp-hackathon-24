import React, { useEffect, useState } from "react";

const GeolocationMap = ({ location, geoError, bounds, geohash }) => {

    const [mapLoadError, setMapLoadError] = useState(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
    const loadGoogleMapsScript = () => {
        if (window.google && window.google.maps) {
          setIsScriptLoaded(true);
          return;
        }
      
        if (document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]')) {
          // Script is already being loaded
          return;
        }
      
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.defer = true;
        
        // Use the onload callback to set isScriptLoaded to true
        script.onload = () => {
          console.log("Google Maps script loaded successfully");
          setIsScriptLoaded(true);
        };
        script.onerror = () => {
          console.log("Failed to load Google Maps script");
          setMapLoadError("Failed to load Google Maps script.");
        };
      
        document.head.appendChild(script);
      };
  
    useEffect(() => {
      loadGoogleMapsScript();
    }, []);
    console.log("Location object: ", location);

    useEffect(() => {
        console.log("Checking conditions for map creation", { isScriptLoaded, google: window.google, location });
        if (isScriptLoaded && window.google && location?.latitude && location?.longitude) {
          console.log("Creating map with location: ", location);
          
          // Create a new map instance inside the useEffect
          const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
            center: { lat: location.latitude, lng: location.longitude },
            zoom: 14,
          });
  
          // Create a marker for the user's location
          new window.google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: mapInstance,
            title: "Your Location",
          });
  
          // Draw the rectangle if bounds are provided
          if (bounds) {
            new window.google.maps.Rectangle({
              strokeColor: "#FF0000",
              strokeOpacity: 0.1,
              strokeWeight: 1,
              fillColor: "#FF0000",
              fillOpacity: 0.2,
              map: mapInstance,
              bounds: {
                north: bounds.latEnd,
                south: bounds.latStart,
                east: bounds.lonEnd,
                west: bounds.lonStart,
              },
            });

            // Calculate the center longitude and a slightly lower latitude
            const centerLng = (bounds.lonStart + bounds.lonEnd) / 2;
            const offsetLat = bounds.latEnd - (bounds.latEnd - bounds.latStart) * 0.09; // Adjust 9% southward

            // Create a marker with the geohash label at the adjusted position
            new window.google.maps.Marker({
              position: { lat: offsetLat, lng: centerLng },
              map: mapInstance,
              label: {
                text: geohash,
                color: "#FF0000",
                // Additional label styling options can be added here
              },
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillOpacity: 0,
                strokeOpacity: 0,
                scale: 0 // Marker remains invisible
              }
            });
          }
        }
      }, [location, bounds, isScriptLoaded, geohash]); // Include geohash in the dependency array
  

  // Display error messages if any
  if (geoError) {
    console.log("Geolocation error: ", geoError);
    return <div>Error fetching location: {geoError}</div>;
  }

  if (mapLoadError) {
    console.log("Map loading error: ", mapLoadError);
    return <div>Error loading Google Maps: {mapLoadError}</div>;
  }

  // Map container
  return (
    <div id="map" style={{ width: "100%", height: "300px" }}>
      {/* Map will be rendered here */}
    </div>
  );
};

export default GeolocationMap;


