
/* eslint-disable no-undef */
import { useContext, useEffect } from "react";
import { AuthContext } from "./Auth";
import { addDauId } from './visitors';



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