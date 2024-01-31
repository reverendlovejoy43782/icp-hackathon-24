import { useEffect, useState } from "react";
import { listDocs } from "@junobuild/core";
import { countDauId } from './dau';

// Define the Table component
export const Table = () => {
  // State 'items' to hold the data to be displayed in the table
  const [items, setItems] = useState([]);

  // State variable to hold the user count
  const [userCount, setUserCount] = useState(0); // Initialize userCount state

  // Effect hook to fetch data when the component mounts and when userCount changes
  useEffect(() => {
    // Function to fetch the data
    const fetchData = async () => {
      const { items } = await listDocs({
        collection: "location_info",
      });
      setItems(items); // Update the items state with the fetched data
      // Get dauId string
      const dauIdString = items.length > 0 ? items[0].data.dauId : "";
      // Count users using countDauId function
      const count = countDauId(dauIdString);
      setUserCount(count); // Update userCount state
    };

    // Call the fetchData function
    fetchData();
  }, [userCount]); // Add userCount as a dependency

  // Render the table with the fetched data
  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200 mt-8">
      {/* Table container */}
      <div className="p-3">
        <div className="overflow-x-auto">
          <div className="text-gray-800 text-lg mb-2">
            User Count: {userCount}
          </div>
          {/* Map over each item in the items array and render its text data */}
          {items.map((item) => {
            const {
              key,
              data: { text },
            } = item;

            // Render a div for each item to display the text data
            return (
              <div key={key} className="px-2.5 py-1.5">
                {/* Display only the text data */}
                <div className="text-gray-800 text-lg">{text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};




/*import { useEffect, useState } from "react";
import { listDocs } from "@junobuild/core";
import { countDauId } from './dau';



// Define the Table component
export const Table = () => {
  // State 'items' to hold the data to be displayed in the table
  const [items, setItems] = useState([]);

  // State variable to hold the user count
  const [userCount, setUserCount] = useState(0); // Initialize userCount state


  // Effect hook to add an event listener for 'reload' event on component mount
  useEffect(() => {
    // Define the function to be called when 'reload' event is triggered
    const list = async () => {
      const { items } = await listDocs({
        collection: "location_info",
      });
      setItems(items); // Update the items state with the fetched data
      // Get dauId string
      const dauIdString = items.length > 0 ? items[0].data.dauId : "";
      // Count users using countDauId function
      const count = countDauId(dauIdString);
      setUserCount(count); // Update userCount state
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
      // Get dauId string
      const dauIdString = items.length > 0 ? items[0].data.dauId : "";
      // Count users using countDauId function
      const count = countDauId(dauIdString);
      setUserCount(count); // Update userCount state
    };

    // Call the fetchData function
    fetchData();
  }, []);

  // Render the table with the fetched data
  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200 mt-8">
      
      <div className="p-3">
        <div className="overflow-x-auto">
          <div className="text-gray-800 text-lg mb-2">
            User Count: {userCount}
          </div>
          
          {items.map((item) => {
            const {
              key,
              data: { text },
            } = item;

            // Render a div for each item to display the text data
            return (
              <div key={key} className="px-2.5 py-1.5">
                
                <div className="text-gray-800 text-lg">{text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
*/