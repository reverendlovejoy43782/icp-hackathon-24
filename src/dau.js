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
export const addDauId = async (geoKey, user) => {
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
    Object.keys(existingDoc.data.dau).forEach((date) => {
      if (date !== today) {
        delete existingDoc.data.dau[date].dauId;
      }
    });

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
  } catch (err) {
    // Log any errors that occur during the process.
    console.error("Error in addDauId function:", err);
  }
};


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


/* legacy code 240205
import { setDoc, getDoc } from "@junobuild/core";
import { hashUserId } from "./Auth"; // Adjust the path as necessary


// Storing the user id hash in a comma-separated string with key dauId
export const addDauId = async (geoKey, user) => {
    if (!user || !geoKey) {
      console.error("User or GeoKey is missing.");
      return;
    }
  
    try {
      const hashedUserId = hashUserId(user.key);
  
      let existingDoc = await getDoc({
        collection: "location_info",
        key: geoKey,
      });
  
      let isNewDocument = false;
  
      if (!existingDoc || !existingDoc.data) {
        isNewDocument = true;
        existingDoc = {
          data: { dauId: "" } // Initialize dauId as an empty string
        };
      }
  
      // Check if the hashed user ID is already in dauId
      if (!existingDoc.data.dauId.includes(hashedUserId)) {
        // Concatenate the hashed user ID to the dauId string
        existingDoc.data.dauId += existingDoc.data.dauId ? `,${hashedUserId}` : hashedUserId;
  
        const docToSet = {
          collection: "location_info",
          doc: {
            key: geoKey,
            data: existingDoc.data
          }
        };
  
        if (!isNewDocument) {
          docToSet.doc.updated_at = existingDoc.updated_at;
        }
  
        await setDoc(docToSet);
      }
    } catch (err) {
      console.error("Error in addDauId function:", err);
    }
  };

// Count the number of unique user hashes in dauId
export const countDauId = (dauIdString) => {
    if (!dauIdString) {
        return 0;
    }

    // Split the string by commas to get individual user hashes
    const userHashes = dauIdString.split(',');

    // Count the number of unique user hashes
    return userHashes.length;
};
  
*/