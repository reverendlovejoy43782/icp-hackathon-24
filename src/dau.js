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
  
/*
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
        data: { dauId: {} }
      };
    }

    if (!existingDoc.data.dauId[hashedUserId]) {
      existingDoc.data.dauId[hashedUserId] = true;

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
*/