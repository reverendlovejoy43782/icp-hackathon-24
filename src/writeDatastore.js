
/* eslint-disable no-undef */
import { useContext, useEffect } from "react";
import { AuthContext } from "./Auth";
import { addDauId } from './dau';



export const Modal = ({ geohash, onWriteSuccess }) => {
  
  const { user } = useContext(AuthContext);
  console.log("modal start geohash and user", geohash, user)
  

  // Automatically call addDauId when the user is signed in and location is available
  useEffect(() => {
    if (user && geohash) {
      console.log("modal useEffect geohash and user", geohash , user);
      addDauId(geohash, user, onWriteSuccess);
    }
  }, [user, geohash, onWriteSuccess]);

  // No UI elements are needed, as the process is automatic
  return null;
};

/*
import { useContext, useEffect, useState, useRef } from "react";
import { setDoc, getDoc } from "@junobuild/core";
import { AuthContext, hashUserId } from "./Auth";
import useGeolocation from './useGeolocation';
import { findNearestGeohash } from './geoGridMatch';
import {addDauId} from './dau';

export const Modal = () => {
  // State hooks for managing modal visibility, input text, form validity, upload progress, and file upload
  const [showModal, setShowModal] = useState(false);
  const [inputText, setInputText] = useState("");
  const [valid, setValid] = useState(false);
  const [progress, setProgress] = useState(false);
  const [setFile] = useState();

  // Define nearestGeoHash as a ref
  const nearestGeoHashRef = useRef();

  // Context for user authentication and custom hook for geolocation
  const { location} = useGeolocation();
  const { user } = useContext(AuthContext);
  
  // useEffect hook for finding nearest square when location changes
  useEffect(() => {
    if (user && location.latitude != null && location.longitude != null) {
      const geoKey = findNearestGeohash(location.latitude, location.longitude);
      addDauId(geoKey, user); // Use the addDauId function
    }
  }, [user, location]);

  // useEffect for setting 'valid'
  useEffect(() => {
    setValid(inputText !== "" && user !== undefined && user !== null);
  }, [showModal, inputText, user]);

  const reload = () => {
    let event = new Event("reload");
    window.dispatchEvent(event);
  };

  const add = async () => {
    console.log("add function called");
    // Demo purpose therefore edge case not properly handled
    if ([null, undefined].includes(user)) {
      return;
    }

    setProgress(true);

    try {
      //let url;

      //if (file !== undefined) {
      //  const filename = `${user.key}-${file.name}`;

        // TODO: STEP_7_UPLOAD_FILE
      //  const downloadUrl = undefined;
        // const { downloadUrl } = await uploadFile({
        //   collection: "images",
        //   data: file,
        //   filename,
        // });

      //  url = downloadUrl;
      //}

      // start new code entry key
      let geoKey;
      console.log("nearestGeoHash", nearestGeoHashRef.current);
      if (nearestGeoHashRef.current != null) {
        geoKey = nearestGeoHashRef.current;
        console.log("geoKey", geoKey);
      }

      let existingDoc = await getDoc({
        collection: "location_info",
        key: geoKey,
      });

      // Hash the user's ID
    const hashedUserId = hashUserId(user.key);

    // Initialize isNewDocument flag
    let isNewDocument = false;

    // Check if the document exists
    if (!existingDoc || !existingDoc.data) {
      // Create a new document structure if it doesn't exist
      isNewDocument = true;
      existingDoc = {
        data: { dauId: {} } // Initialize dauId object
      };
    }

    // Add the user's hashed ID to the dauId object if it's not already there
    if (!existingDoc.data.dauId[hashedUserId]) {
      existingDoc.data.dauId[hashedUserId] = true; // Mark the user as present
    }

    // Prepare the document for updating or creating
    const docToSet = {
      collection: "location_info",
      doc: {
        key: geoKey,
        data: existingDoc.data
      }
    };

    // Include updated_at only if the document already exists
    if (!isNewDocument) {
      docToSet.doc.updated_at = existingDoc.updated_at;
    }

    // Update or create the document
    await setDoc(docToSet);

      
  

      reload();
    } catch (err) {
  console.error("Error in add function:", err);
} finally {
  // This block will run whether or not an error occurred in the try block
  setProgress(false);
}
  }


  return (
    <>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add an entry
        </button>
      </div>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="relative p-6 flex-auto">
                  <textarea
                    className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-indigo-600 focus:outline-none
        resize-none
      "
                    rows="5"
                    placeholder="Your diary entry"
                    onChange={(e) => {
                      setInputText(e.target.value);
                    }}
                    value={inputText}
                    disabled={progress}
                  ></textarea>
                  <input
                    type="file"
                    className="my-4 text-slate-500 text-lg leading-relaxed"
                    onChange={(event) => setFile(event.target.files?.[0])}
                    disabled={progress}
                  />
                </div>

                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  {progress ? (
                    <div
                      className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-indigo-600 rounded-full"
                      role="status"
                      aria-label="loading"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <button
                        className="background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>

                      <button
                        className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-25"
                        type="button"
                        onClick={add}
                        disabled={!valid}
                      >
                        Submit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};
*/
