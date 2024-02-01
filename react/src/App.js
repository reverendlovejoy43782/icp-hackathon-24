// Import of hooks and components
import React, { useState, useEffect } from "react";
import { Background } from "./Background";
import { Table } from "./Table";
import { Modal } from "./Modal";
import { initJuno } from "@junobuild/core";
import { Auth } from "./Auth";
import useGeolocation from './useGeolocation';
import GeolocationMap from "./showGeolocation";
import { findNearestGeohashWithBounds } from './geoGridMatch';


function App() {
  // State for managing the current view (default, write, etc.)
  const [currentView, setCurrentView] = useState("default");

  // use location hook, which returns location, error, and fetchLocation method
  // use fetchLocation method to fetch location
  // use location and error to display location and error
  const { location, fetchLocation, error: geoError } = useGeolocation();

  // State to track if the location has been fetched
  const [isLocationFetched, setIsLocationFetched] = useState(false);

  // State to track if the map is visible
  const [showMap, setShowMap] = useState(false); // New state for map visibility

  // Bound state for map
  const [bounds, setBounds] = useState(null);

  // Geohash state for map and storage
  const [geohash, setGeohash] = useState("");

  // State to track if the table is visible
  const [showTable, setShowTable] = useState(false);


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

        // Set the geohash for the square
        setGeohash(geoData.geohash); // Store the geohash

        console.log("Bounds: ", geoData.bounds);
        console.log("Geohash: ", geoData.geohash);

        setShowMap(true);
      })
      .catch(error => {
        console.error("Error fetching location: ", error);
        // Optionally, handle the error in the UI
      });
  };

  // Click handler for the Write button
  const handleWriteClick = () => {
    if (!isLocationFetched) {
      handleFetchLocation();
      setShowTable(true); // Show table when fetching location
    }
    setCurrentView("write");
  };

  // Click handler for the Toggle Map button
  const handleToggleMap = () => {
    if (!isLocationFetched) {
      handleFetchLocation();
      setShowTable(true); // Show table when fetching location
    } else {
      setShowMap(!showMap); // Toggle only the map visibility
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
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-2xl pt-16">
              <div className="text-center">
                {/* Description text */}
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  This is a prototype for a decentralized geolocation service.
                </p>
              </div>
            </div>
          </div>
          <Background />

          {/* Toggle Button for Map and Table */}
          <div className="text-center mt-10">
            <button onClick={handleToggleMap} className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              {showMap ? "Close Map" : "Show Geo Data"}
            </button>
          </div>


          {/* Display loading message or the Table */}
          {showTable && !isLocationFetched && (
            <div className="text-center mt-10">
              <p>... fetching data</p>
            </div>
          )}
          {/* Conditionally render the Table and Map */}
          {isLocationFetched && showTable && <Table geohash={geohash} />}
          {showMap && isLocationAvailable && (
            <div style={{ paddingTop: '20px' }}>  
              <GeolocationMap location={location} bounds={bounds} />
            </div>
          )}
          
          {/* Conditional rendering of Write button and Modal */}
          {currentView === "default" && (
            <div className="text-center mt-10">
              {/* Button to change view to 'write', allowing entry creation */}
              <button onClick={handleWriteClick} className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Write
              </button>
            </div>
          )}

          {/* Render the Modal component within Auth for authentication when in 'write' view */}
          {currentView === "write" && (
            <Auth>
              <Modal geohash={geohash} />
            </Auth>
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
