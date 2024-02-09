// Import necessary hooks and functions from React and the data access library.
import { useEffect, useState } from "react";
import { listDocs } from "@junobuild/core";
// Import functions for DAU calculation and percentage difference.
import { countVisitors, calculatePercentageDifferenceVisitors } from './visitors';

// Import the mock data generator for testing purposes.
import { generateMockMetrics } from "./mockMetrics";

// Define the Table component that takes 'geohash' and 'refreshTable' as props.
export const Table = ({ geohash, latitude, longitude, refreshTable }) => {
  const [items, setItems] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [percentageDifference, setPercentageDifference] = useState(0);
  const [environmentMetrics, setEnvironmentMetrics] = useState({});
  const [trafficMetrics, setTrafficMetrics] = useState({});
  const [safetyMetrics, setSafetyMetrics] = useState({});
  const [publicHealthMetrics, setPublicHealthMetrics] = useState({});

  useEffect(() => {
    console.log('Table - refreshTable:', refreshTable);
  }, [refreshTable]);

  // Inside your Table component
useEffect(() => {
  const fetchData = async () => {
    if (geohash && refreshTable) {
      try {
        const { items } = await listDocs({
          collection: "location_info",
          query: { key: geohash }
        });

        setItems(items);

        // Generate mock metrics
        const mockMetrics = generateMockMetrics();

        // Extract and set metrics for each section
        setEnvironmentMetrics({
          pollutionIndex: mockMetrics.pollutionIndex,
          floodingProbability: mockMetrics.floodingProbability,
          hurricaneProbability: mockMetrics.hurricaneProbability
        });
        setTrafficMetrics({
          trafficAccidentsProbability: mockMetrics.trafficAccidentsProbability
        });
        setSafetyMetrics({
          crimeIndex: mockMetrics.crimeIndex
        });
        setPublicHealthMetrics({
          incidenceRatePandemicDiseases: mockMetrics.incidenceRatePandemicDiseases
        });

        // Assume there's no data initially.
        let currentDauMessage = "no data";
        let percentageDifferences = [];

        items.forEach(item => {
          // Attempt to retrieve the current DAU value, updating the message if possible.
          const visitorCount = countVisitors(item.data.dau);
          if (typeof visitorCount === "number") {
            currentDauMessage = visitorCount;
          }

          // Calculate and collect the percentage difference for each item.
          const percentageDifference = calculatePercentageDifferenceVisitors(item.data.dau);
          if (percentageDifference !== "no data") {
            // Parse the numeric value from the percentage string and add to the array.
            percentageDifferences.push(parseFloat(percentageDifference.replace('%', '')));
          }
        });

        // Only set the user count if a numerical value was found.
        if (currentDauMessage !== "no data") {
          setUserCount(currentDauMessage);
        }

        // Calculate the average percentage difference if any valid percentages were collected.
        if (percentageDifferences.length > 0) {
          const averagePercentageDifference = percentageDifferences.reduce((acc, val) => acc + val, 0) / percentageDifferences.length;
          // This is always a number, so calling .toFixed() here is safe
          setPercentageDifference(averagePercentageDifference.toFixed(0));
        } else {
          // Directly set a string without attempting to call .toFixed() on it
          setPercentageDifference("No Data");
        }

        

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  fetchData();
}, [geohash, refreshTable, setEnvironmentMetrics, setTrafficMetrics, setSafetyMetrics, setPublicHealthMetrics]);



return (
  <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200 mt-8">
    <div className="p-3">
      <div className="overflow-x-auto">

        {/* Add Geolocation Display Here */}
        <div className="text-gray-800 text-lg mb-4">
          <strong>Your Location:</strong> {latitude}, {longitude}
        </div>

        {/* Add Geolocation Display Here */}
        <div className="text-gray-800 text-lg mb-4">
          <strong>Corresponding square:</strong> {geohash}
        </div>

        {/* Static sections with bold titles */}
        <div className="text-gray-800 text-lg mb-2 font-bold">Environment</div>
        <div className="pl-4">
          <div className="text-gray-800 text-lg mb-2">
            Flooding Probability: {(environmentMetrics.floodingProbability * 100).toFixed(0)}%
          </div>
          <div className="text-gray-800 text-lg mb-2">
            Hurricane Probability: {(environmentMetrics.hurricaneProbability * 100).toFixed(0)}%
          </div>
          <div className="text-gray-800 text-lg mb-2">
            Pollution Rate: {(environmentMetrics.pollutionIndex * 100).toFixed(0)}%
          </div>
        </div>

        <div className="text-gray-800 text-lg mb-2 font-bold">Traffic</div>
        <div className="pl-4">
          <div className="text-gray-800 text-lg mb-2">
            Traffic Accident Probability: {(trafficMetrics.trafficAccidentsProbability * 100).toFixed(0)}%
          </div>
        </div>

        <div className="text-gray-800 text-lg mb-2 font-bold">Safety</div>
        <div className="pl-4">
          <div className="text-gray-800 text-lg mb-2">
            Crime Rate: {(safetyMetrics.crimeIndex * 100).toFixed(0)}%
          </div>
        </div>

        <div className="text-gray-800 text-lg mb-2 font-bold">Public Health</div>
        <div className="pl-4">
          <div className="text-gray-800 text-lg mb-2">
            Incidence Rate Pandemic Diseases: {(publicHealthMetrics.incidenceRatePandemicDiseases * 100).toFixed(0)}%
          </div>
        </div>

        {/* Society section with dynamic content */}
        <div className="text-gray-800 text-lg mb-2 font-bold">Society</div>
        <div className="pl-4">
          <div className="text-gray-800 text-lg mb-2">
            Check-ins today: {userCount}
          </div>
          <div className="text-gray-800 text-lg mb-2">
            Difference to average: {percentageDifference} %
          </div>

        </div>

        {/* Personal section */}
        <div className="text-gray-800 text-lg mb-2 font-bold">Personal</div>
        
        {/* Example dynamic listing if needed for each section */}
        {items.map((item) => {
          const { key, data: { text } } = item;
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


}