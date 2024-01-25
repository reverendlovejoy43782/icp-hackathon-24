
import { useState, useEffect} from "react";
import { Background } from "./Background";
import { Table } from "./Table";
import { Modal } from "./Modal";
import { initJuno } from "@junobuild/core";
import { Auth } from "./Auth";
import useGeolocation from './useGeolocation';

// Define the main App component
function App() {
  // State for managing the current view, initialized to 'default'
  const [currentView, setCurrentView] = useState("default");

  // Use geolocation hook to obtain user's location
  const { location } = useGeolocation();

  // Effect hook for initializing Juno with the specified satellite ID
  useEffect(() => {
    (async () => await initJuno({ satelliteId: "rqh4k-yiaaa-aaaal-adova-cai" }))();
  }, []);

  // Handler function to change view to 'write' when the Write button is clicked
  const handleWriteClick = () => setCurrentView("write");

  // Render JSX for the App component
  return (
    <>
      {/* Top navigation bar with a logo button */}
      <div className="bg-indigo-600 text-white py-4">
        <div className="container mx-auto flex justify-center">
          {/* Button for resetting the view to default */}
          <button onClick={() => setCurrentView("default")} className="text-xl font-semibold hover:text-gray-300">
            World L2
          </button>
        </div>
      </div>

      {/* Main content section of the app */}
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
            {/* Background component for additional UI */}
            <Background />
          </div>
        </main>

        {/* Table component to display geolocation data, visible by default */}
        <Table userLocation={location} />

        {/* Conditional rendering of Write button and Modal based on the current view */}
        {currentView === "default" && (
          <div className="text-center mt-10">
            {/* Button to change view to 'write', allowing entry creation */}
            <button onClick={handleWriteClick} className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Write
            </button>
          </div>
        )}

        {/* Rendering the Modal component within Auth for authentication when in 'write' view */}
        {currentView === "write" && (
          <Auth>
            <Modal />
          </Auth>
        )}
      </div>
    </>
  );
}

// Exporting the App component
export default App;
