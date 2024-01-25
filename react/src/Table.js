import { useContext, useEffect, useState } from "react";
import { listDocs } from "@junobuild/core";
import { AuthContext } from "./Auth";

// Define the Table component
export const Table = () => {
  // State 'items' to hold the data to be displayed in the table
  const [items, setItems] = useState([]);

  // Effect hook to add an event listener for 'reload' event on component mount
  useEffect(() => {
    // Define the function to be called when 'reload' event is triggered
    const list = async () => {
      const { items } = await listDocs({
        collection: "location_info",
      });
      setItems(items); // Update the items state with the fetched data
    };

    // Add 'reload' event listener which calls the list function
    window.addEventListener("reload", list);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("reload", list);
    };
  }, []);

  // Effect hook to fetch data when the component mounts
  useEffect(() => {
    // Function to fetch the data
    const fetchData = async () => {
      const { items } = await listDocs({
        collection: "location_info",
      });
      setItems(items); // Update the items state with the fetched data
    };

    // Call the fetchData function
    fetchData();
  }, []);

  // Render the table with the fetched data
  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200 mt-8">
      {/* Table header */}
      <header className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Entries</h2>
      </header>
      {/* Table body */}
      <div className="p-3">
        <div className="overflow-x-auto">
          {/* Map over each item in the items array and render its data */}
          {items.map((item) => {
            const {
              key,
              data: { text },
            } = item;

            // Render a div for each item
            return (
              <div key={key} className="flex items-center gap-6 px-2.5 py-1.5">
                {/* Display the geohash */}
                <div className="flex flex-col">
                  <span className="text-gray-600 font-semibold">Geohash: {key}</span>
                </div>
                {/* Display the text data */}
                <div className="line-clamp-3 text-left grow">{text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};