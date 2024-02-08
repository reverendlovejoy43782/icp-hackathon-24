import { setDoc, getDoc } from "@junobuild/core";
import { hashUserId } from "./Auth";

// timestamp to the minute for testing
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Month is zero-indexed, so add 1.
  const day = today.getDate();
  const hour = today.getHours();
  const minute = today.getMinutes();

  // Create a formatted string in the format: YYYY-MM-DD-HH-MM
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${hour.toString().padStart(2, '0')}-${minute.toString().padStart(2, '0')}`;
};

/*
// Function to get today's date in YYYY-MM-DD format
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};
*/

// Function to add or update the Daily Active User (DAU) count
export const addDauId = async (geoKey, user, onWriteSuccess) => {
  // Check if the necessary parameters are provided
  if (!user || !geoKey) {
    console.error("User or GeoKey is missing.");
    return;
  }

  try {
    // Hash the user's ID for privacy reasons.
    const hashedUserId = hashUserId(user.key);
    // Get today's date in the required format.
    const today = getTodayString();

    // Fetch the existing document from the datastore for the given geohash.
    let existingDoc = await getDoc({
      collection: "location_info",
      key: geoKey,
    });

    // Flag to check if a new document needs to be created.
    let isNewDocument = false;

    // If the document doesn't exist or lacks data, create a new structure.
    if (!existingDoc || !existingDoc.data) {
      isNewDocument = true;
      existingDoc = { data: { dau: {} } };
    }

    // Update today's DAU data. If today's data is not present, initialize it.
    if (!existingDoc.data.dau[today]) {
      existingDoc.data.dau[today] = { dau: 0, dauId: "" };
    }

    // Remove dauId for past minutes
    /*
    Object.keys(existingDoc.data.dau).forEach((date) => {
      if (date !== today) {
        delete existingDoc.data.dau[date].dauId;
      }
    });
    */

    // If the user's hash is not in today's DAU list, add it and increment the count.
    if (!existingDoc.data.dau[today].dauId.includes(hashedUserId)) {
      existingDoc.data.dau[today].dauId += existingDoc.data.dau[today].dauId ? `,${hashedUserId}` : hashedUserId;
      existingDoc.data.dau[today].dau++;
    }

    // Prepare the updated document to be set in the datastore.
    const docToSet = {
      collection: "location_info",
      doc: {
        key: geoKey,
        data: existingDoc.data
      }
    };

    // If the document is not new, include the existing 'updated_at' timestamp.
    if (!isNewDocument && existingDoc.updated_at) {
      docToSet.doc.updated_at = existingDoc.updated_at;
    }

    // Save the updated document to the datastore.
    await setDoc(docToSet);

    // If successful, invoke the callback
    if (onWriteSuccess) {
      onWriteSuccess();
      console.log('dau.js > Write operation was successful');
    }


  } catch (err) {
    // Log any errors that occur during the process.
    console.error("Error in addDauId function:", err);
  }
};


export const countVisitors = (dauData) => {
  if (!dauData) {
    // Return "no data" if there's no data provided.
    return "no data";
  }

  // Generate the timestamp for the current minute.
  const currentTimestamp = getTodayString();

  // Check if there's a DAU value for the current timestamp in the provided data.
  if (dauData[currentTimestamp] && dauData[currentTimestamp].dau) {
    // If a matching entry exists, return its DAU value.
    return dauData[currentTimestamp].dau;
  } else {
    // If no matching entry exists, return "no data".
    return "no data";
  }
};


/* average DAU
export const countDauId = (dauData) => {
  if (!dauData) {
    return 0;
  }

  let totalDau = 0;
  let dayCount = 0;

  Object.values(dauData).forEach(dayData => {
    totalDau += dayData.dau;
    dayCount++;
  });

  return dayCount > 0 ? totalDau / dayCount : 0; // Return the average DAU
};
*/

export const calculatePercentageDifferenceVisitors = (dauData) => {
  // Assuming getTodayString() gives us the current timestamp in the required format
  const currentTimestamp = getTodayString();
  console.log("Visitors.js Current Timestamp:", currentTimestamp);

  if (!dauData || !dauData[currentTimestamp]) {
    console.log("visitors.js No current data for the minute");
    return "no data"; // No current data for the minute
  }

  const currentDau = dauData[currentTimestamp].dau;
  console.log("visitors.js Current DAU:", currentDau);
  let pastDauValues = [];

  for (const [timestamp, { dau }] of Object.entries(dauData)) {
    if (timestamp < currentTimestamp) { // Only consider past data
      pastDauValues.push(dau);
    }
  }
  console.log("visitors.js Past DAU Values:", pastDauValues); 

  if (pastDauValues.length === 0) {
    console.log("visitors.js No past data to compare against");
    return "no data"; // No past data to compare against
  }

  const sumPastDau = pastDauValues.reduce((acc, value) => acc + value, 0);
  const averagePastDau = sumPastDau / pastDauValues.length;

  console.log("visitors.js Sum of Past DAU:", sumPastDau, "Average Past DAU:", averagePastDau);

  // Avoid division by zero by ensuring averagePastDau is not zero
  if (averagePastDau === 0) {
    console.log("visitors.js Average past DAU is 0");
    return "no data";
  }

  const percentageDifference = ((currentDau - averagePastDau) / averagePastDau) * 100;
  console.log("visitors.js Percentage Difference:", percentageDifference);
  
  // Ensure the calculation is numeric and finite.
  console.log("visitors.js isFinite(percentageDifference):", isFinite(percentageDifference), "Return Value:", `${percentageDifference.toFixed(2)}%`);
  return isFinite(percentageDifference) ? `${percentageDifference.toFixed(2)}%` : "no data";
};



