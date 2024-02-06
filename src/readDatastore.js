import { useEffect, useState } from "react";
import { listDocs } from "@junobuild/core";
import { countDauId } from './dau';

// Define the Table component with 'geohash' received as a prop
export const Table = ({ geohash, refreshTable }) => {
  // State to store the list of items/documents fetched from the database
  const [items, setItems] = useState([]);

  // State to keep track of the user count derived from the data
  const [userCount, setUserCount] = useState(0);



  // check if refreshTable changes properly

  useEffect(() => {
    console.log('Table - refreshTable:', refreshTable);
  }, [refreshTable]);

  // end of test

  // useEffect hook to perform side effects (data fetching)
  useEffect(() => {
    // Async function to fetch data
    const fetchData = async () => {
      // Check if geohash is available
      if (geohash && refreshTable) {
        console.log("Table useEffect geohash and refreshTable", geohash, refreshTable)
        try {
          const { items } = await listDocs({
            collection: "location_info",
            query: { key: geohash }
          });
  
          setItems(items);
  
          // Assuming each item has dau data under a 'dau' key
          let totalAverageDau = 0;
          items.forEach(item => {
            totalAverageDau += countDauId(item.data.dau);
          });
  
          // Calculate the overall average DAU if multiple items are returned
          setUserCount(items.length > 0 ? totalAverageDau / items.length : 0);
        } catch (error) {
          // Log any errors to the console
          console.error("Error fetching data:", error);
        }
      }
    };

    // Execute the fetchData function
    fetchData();
  }, [geohash, refreshTable]); // The effect depends on the geohash prop

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



/* legacy code 240205
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
            User Count: {userCount}
          </div>
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
*/

