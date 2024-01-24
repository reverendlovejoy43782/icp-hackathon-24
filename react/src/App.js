import { useState, useEffect } from "react";
import { Background } from "./Background";
import { Table } from "./Table";
import { Modal } from "./Modal";
import { initJuno } from "@junobuild/core";
import { Auth } from "./Auth";
import useGeolocation from './useGeolocation';

function App() {
  // New state to manage the current view, possible values: 'default', 'write', 'read
  const [currentView, setCurrentView] = useState("default"); 
  const { location, error } = useGeolocation();

  // TODO: STEP_1_INITIALIZATION
  // initialize the juni app with the satelliteId
  useEffect(() => {
    (async () =>
      await initJuno({
        satelliteId: "rqh4k-yiaaa-aaaal-adova-cai",
      }))();
  }, []);

  // Handler for "Write" button click
  const handleWriteClick = () => {
    setCurrentView("write");
  };

  // Handler for "Read" button click
  const handleReadClick = () => {
    setCurrentView("read");
  };

  const handleLogoClick = () => {
    setCurrentView("default");
  };

  return (
    <>

      <div className="bg-indigo-600 text-white py-4">
        <div className="container mx-auto flex justify-center">
          <button
            onClick={handleLogoClick}
            className="text-xl font-semibold hover:text-gray-300"
          >
            World L2
          </button>
        </div>
      </div>

      {/* The main content of the app */}
      {currentView === "default" && (
        <div className="isolate bg-white">
          <main>
            <div className="relative px-6 lg:px-8">
              <div className="mx-auto max-w-2xl pt-16">
                <div className="text-center">
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    This is a prototype for a decentralized geoloaction service.
                  </p>
                  {/* Conditional rendering of Read and Write buttons */}
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <button
                      onClick={handleReadClick}
                      className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Read
                    </button>
                    <button
                      onClick={handleWriteClick}
                      className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Write
                    </button>
                  </div>
                </div>
              </div>
              <Background />
            </div>
          </main>
        </div>
      )}

      {/* When "Write" is clicked, show these components */}
      {currentView === "write" && (
        <Auth>
          <Table />
          <Modal />
        </Auth>
      )}

      {/* Display geo-location data when Read is clicked */}
      {currentView === "read" && (
        <Auth>
          <Table userLocation={location} />
        </Auth>
      )}
    </>
  );
}

export default App;
