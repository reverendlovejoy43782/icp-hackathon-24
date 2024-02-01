
import React from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

function GoogleMapComponent({ userLocation }) {
    return (
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          center={userLocation || { lat: 0, lng: 0 }}
          zoom={8}
        >
          {userLocation && (
            <Marker
              position={userLocation}
              title="User Location"
            />
          )}
        </GoogleMap>
      </LoadScript>
    );
  }

export default GoogleMapComponent;
