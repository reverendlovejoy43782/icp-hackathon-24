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
// Function to generate an array of timestamps for the last 28 minutes
const getLast28MinuteTimestamps = () => {
  const timestamps = []; // Initialize an array to hold the timestamps
  const now = new Date(); // Get the current date and time

  // Loop to generate timestamps for each of the last 28 minutes, including the current minute
  for (let i = 0; i <= 28; i++) {
    let pastMinute = new Date(now.getTime() - i * 60000); // Calculate the timestamp for each minute in the past
    // Format the timestamp components to ensure two digits for month, day, hour, and minute
    const year = pastMinute.getFullYear();
    const month = pastMinute.getMonth() + 1; // Adjust month index (0-11)
    const day = pastMinute.getDate();
    const hour = pastMinute.getHours();
    const minute = pastMinute.getMinutes();
    // Construct the timestamp string in the format YYYY-MM-DD-HH-MM
    const timestamp = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${hour.toString().padStart(2, '0')}-${minute.toString().padStart(2, '0')}`;
    timestamps.unshift(timestamp); // Add the timestamp to the start of the array to maintain chronological order
  }
  return timestamps; // Return the array of last 28 minute timestamps
};



// Function to calculate the percentage difference in DAU for the current minute compared to the average of the last 28 minutes
export const calculatePercentageDifferenceVisitors = (dauData) => {
  const last28MinuteTimestamps = getLast28MinuteTimestamps(); // Get the last 28 minute timestamps

  // Map over the last 28 minute timestamps to extract DAU counts, defaulting to 0 for missing entries
  let pastDauValues = last28MinuteTimestamps.map(timestamp => {
    return dauData[timestamp] && dauData[timestamp].dau ? dauData[timestamp].dau : 0;
  });

  // Remove the current minute's DAU count to focus on past data only
  pastDauValues.pop(); // Assumes the current minute is the last element in the array

  // Check if we have any past data to compare against
  if (pastDauValues.length === 0) {
    return "no data"; // Return "no data" if there are no past DAU values for comparison
  }

  // Extract the current minute's DAU count, defaulting to 0 if not present
  const currentDau = dauData[last28MinuteTimestamps[last28MinuteTimestamps.length - 1]]?.dau || 0;

  // Calculate the sum of past DAU values
  const sumPastDau = pastDauValues.reduce((acc, value) => acc + value, 0);
  // Calculate the average of past DAU values, ensuring we don't divide by zero
  const averagePastDau = sumPastDau / (pastDauValues.length || 1);

  // Check if the average past DAU is 0 to avoid division by zero in the percentage calculation
  if (averagePastDau === 0) {
    return "no data";
  }

  // Calculate the percentage difference between the current DAU and the average past DAU
  const percentageDifference = ((currentDau - averagePastDau) / averagePastDau) * 100;
  console.log('percentageDifference', percentageDifference);

  // Return the percentage difference, formatted to 2 decimal places, or "no data" if the result is not a finite number
  return isFinite(percentageDifference) ? `${percentageDifference.toFixed(0)}%` : "no data";
};


// Function to find timestamps where a user's hashed ID appears
export const findUserTimestampsInDAU = async (geoKey, user) => {
  // Hash the user's ID
  const hashedUserId = hashUserId(user.key);

  // Fetch the existing document from the datastore for the given geohash
  try {
    const existingDoc = await getDoc({
      collection: "location_info",
      key: geoKey,
    });

    if (!existingDoc || !existingDoc.data || !existingDoc.data.dau) {
      console.error("No DAU data found.");
      return [];
    }

    // Initialize an array to hold timestamps where the hashed user ID is found
    const matchedTimestamps = [];

    // Iterate through the DAU data to find matches
    Object.entries(existingDoc.data.dau).forEach(([timestamp, { dauId }]) => {
      if (dauId && dauId.includes(hashedUserId)) {
        // If the hashed user ID is found in the dauId string, add the timestamp to the array
        matchedTimestamps.push(timestamp);
      }
    });

    return matchedTimestamps;
  } catch (err) {
    console.error("Error fetching DAU data:", err);
    return [];
  }
};


