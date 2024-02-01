import { useEffect, useState } from "react";
import { listDocs } from "@junobuild/core";
import { countDauId } from './dau';

// Define the Table component with 'geohash' received as a prop
export const Table = ({ geohash }) => {
  // State to store the list of items/documents fetched from the database
  const [items, setItems] = useState([]);

  // State to keep track of the user count derived from the data
  const [userCount, setUserCount] = useState(0);

  // useEffect hook to perform side effects (data fetching)
  useEffect(() => {
    // Async function to fetch data
    const fetchData = async () => {
      // Check if geohash is available
      if (geohash) {
        try {
          // Fetch documents from the 'location_info' collection filtered by geohash
          const { items } = await listDocs({
            collection: "location_info",
            query: { key: geohash } // Assuming the listDocs function supports this query format
          });
          // Update the items state with the fetched data
          setItems(items);

          // Extracting the dauId string from the first item, if available
          const dauIdString = items.length > 0 ? items[0].data.dauId : "";

          // Count the number of users (DAU - Daily Active Users) using countDauId function
          const count = countDauId(dauIdString);

          // Update the userCount state with the calculated count
          setUserCount(count);
        } catch (error) {
          // Log any errors to the console
          console.error("Error fetching data:", error);
        }
      }
    };

    // Execute the fetchData function
    fetchData();
  }, [geohash]); // The effect depends on the geohash prop

  // Render the component
  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200 mt-8">
      <div className="p-3">
        <div className="overflow-x-auto">
          <div className="text-gray-800 text-lg mb-2">
            {/* Display the user count */}
            User Count: {userCount}
          </div>
          {/* Iterate over each item in the items array and display its content */}
          {items.map((item) => {
            // Destructure to extract key and text data from each item
            const { key, data: { text } } = item;
            // Render a div for each item to display its text data
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


/*
// Define the Table component, get geohash as a prop
export const Table = ({ geohash }) => {
  // State 'items' to hold the data to be displayed in the table
  const [items, setItems] = useState([]);

  // State variable to hold the user count
  const [userCount, setUserCount] = useState(0); // Initialize userCount state

  // Effect hook to fetch data when the component mounts and when userCount changes
  useEffect(() => {
    // Function to fetch the data
    const fetchData = async () => {
      if {geohash} {
        const { items } = await listDocs({
          collection: "location_info",
        });
        setItems(items); // Update the items state with the fetched data
      // Get dauId string
      const dauIdString = items.length > 0 ? items[0].data.dauId : "";
      // Count users using countDauId function
      const count = countDauId(dauIdString);
      setUserCount(count); // Update userCount state
      }
    };

    // Call the fetchData function
    fetchData();
  }, [userCount]); // Add userCount as a dependency

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





import { useEffect, useState } from "react";
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