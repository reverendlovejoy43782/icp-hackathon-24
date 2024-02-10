// Import of hooks and components
import React, { useState, useEffect, useCallback } from "react";
import { Background } from "./Background";
import { Table } from "./showTable";
import { Modal } from "./handleWriteFunctions";
import { initJuno } from "@junobuild/core";
import { Auth } from "./Auth";
import useGeolocation from './useGeolocation';
import GeolocationMap from "./showGeolocation";
import { findNearestGeohashWithBounds } from './gridMatch';
//import fetchAirQualityData from './openaq';


function App() {
  // State for managing the current view (default, write, etc.)
  const [currentView, setCurrentView] = useState("default");

  // use location hook, which returns location, error, and fetchLocation method
  // use fetchLocation method to fetch location
  // use location and error to display location and error
  const { location, fetchLocation, error: geoError } = useGeolocation();

  // State to track if the location has been fetched
  const [isLocationFetched, setIsLocationFetched] = useState(false);

  // State to track if data has been fetched and displayed once
  const [dataDisplayed, setDataDisplayed] = useState(false);

  // State to track if the map is visible
  const [showMap, setShowMap] = useState(false); // New state for map visibility

  // Bound state for map
  const [bounds, setBounds] = useState(null);

  // Geohash state for map and storage
  const [geohash, setGeohash] = useState("");


  // State variables for latitude and longitude
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // State to track if the table is visible
  const [showTable, setShowTable] = useState(false);

  // State to track if the table should be refreshed
  //const [refreshTable, setRefreshTable] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0); // Use a counter



  // Update the state when the write operation is successful
  const onWriteSuccess = useCallback(() => {
    console.log('Write operation was successful');
    
    // Increment the counter to trigger a refresh
    setRefreshCounter(prevCounter => prevCounter + 1);
}, []); 

  // Effect hook to initialize Juno on component mount
  useEffect(() => {
    (async () => await initJuno({ satelliteId: "rqh4k-yiaaa-aaaal-adova-cai" }))();
  }, []);

  useEffect(() => {
    console.log("Location changed:", location.latitude, location.longitude);
    
    // Check if the location is not null before setting isLocationFetched to true
    if (location.latitude !== null && location.longitude !== null) {
      setIsLocationFetched(true);
    }
  }, [location]);

  // Function to handle location fetching and update state
  const handleFetchLocation = () => {
    fetchLocation()
      .then((newLocation) => {
        console.log("Location fetched in app.js handleFetchLocation " + newLocation.latitude + " " + newLocation.longitude);
        setIsLocationFetched(true); // Set to true only if location fetch is successful
        const geoData = findNearestGeohashWithBounds(newLocation.latitude, newLocation.longitude)

        // Set the bounds of the square (gehohash, on map)
        setBounds(geoData.bounds);

        // Update geohash for the square
        setGeohash(geoData.geohash); // Store the geohash

        // Update state variables for latitude and longitude of clients position (in square)
        setLatitude(newLocation.latitude);
        setLongitude(newLocation.longitude);
        
        // Log bounds of square and geohash for some debugging
        console.log("Bounds: ", geoData.bounds);
        console.log("Geohash: ", geoData.geohash);

        // Fetch air quality data for the new location
        /* stopped here due to time constraints, does not work yet
        fetchAirQualityData(newLocation.latitude, newLocation.longitude)
          .then(airQualityData => {
            console.log('Air quality data:', airQualityData);
            // Handle the air quality data as needed
          });
          */

        setShowMap(true);
      })
      .catch(error => {
        console.error("Error fetching location: ", error);
        // Optionally, handle the error in the UI
      });
  };

  // Click handler for the Write button
  const handleWriteClick = () => {
    // Check if geohash is not set
    if (!geohash) {
      handleFetchLocation();
    }
    setShowTable(true);  // Ensure table is shown
    setShowMap(true);    // Ensure map is shown
    setCurrentView("write");
    // Increment the counter to trigger a refresh
    setRefreshCounter(prevCounter => prevCounter + 1);
  };
  

  // Click handler for the Toggle Map button
  const handleToggleMap = () => {
    if (!isLocationFetched) {
      handleFetchLocation();
      setShowTable(true);
      setDataDisplayed(true); // Set to true when fetching location
      // Increment the counter to trigger a refresh
      setRefreshCounter(prevCounter => prevCounter + 1);
    } else {
      setShowMap(!showMap);
    }
  };

  const isLocationAvailable = location.latitude != null && location.longitude != null;

  // Log the location before rendering
  console.log("location before rendering", location);

  // The main JSX render for the App component
return (
  <>
    {/* Top navigation bar */}
    <div className="bg-indigo-600 text-white py-4">
      <div className="container mx-auto flex justify-center">
        {/* Button to reset the view to default */}
        <button onClick={() => setCurrentView("default")} className="text-xl font-semibold hover:text-gray-300">
          A datalayer of the world
        </button>
      </div>
    </div>

    {/* Main content section */}
    <div className="isolate bg-white">
      <main>
        <Background />

        {/* Buttons container with flex layout */}
        <div className="flex justify-center items-center mt-10 space-x-4">
          {/* Toggle Button for Map and Table */}
          <button onClick={handleToggleMap} className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500">
            {showMap ? "Close Map" : (dataDisplayed ? "Open Map" : "Show Geo Data")}
          </button>

          {/* Conditional rendering of Write button */}
          {currentView === "default" && (
            <button onClick={handleWriteClick} className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500">
              Check in
            </button>
          )}
          {/* Render the Modal component within Auth for authentication when in 'write' view */}
          {currentView === "write" && (
            <Auth>
              <Modal geohash={geohash} onWriteSuccess={onWriteSuccess} />
            </Auth>   
        )}
        </div>

        {/* Conditionally render the Map */}
        {showMap && isLocationAvailable && (
          <div style={{ paddingTop: '20px' }}>  
            <GeolocationMap location={location} bounds={bounds} geohash={geohash} />
          </div>
        )}

        {/* Conditionally render the Table */}
        {isLocationFetched && showTable && <Table geohash={geohash} latitude={latitude} longitude={longitude} refreshCounter={refreshCounter} />}

        {/* Display loading message or the Table */}
        {showTable && !isLocationFetched && (
          <div className="text-center mt-10">
            <p>... fetching data</p>
          </div>
        )}
        
        

        {/* Display geolocation error if it exists */}
        {geoError && <div className="error-message">Error: {geoError}</div>}
      </main>
    </div>
  </>
);
}


// Exporting the App component for use in other parts of the application
export default App;
