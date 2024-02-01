function calculateArea(lat, lon) {
    // Set grid spacing to 1 degree for both latitude and longitude
    const gridSpacing = 0.03; // This represents a grid square of roughly 111 km x 111 km at the Equator

    // Calculate the nearest lower latitude line based on the grid spacing
    const lowerLat = Math.floor(lat / gridSpacing) * gridSpacing;

    // Calculate the nearest upper latitude line by adding grid spacing to the lower latitude
    const upperLat = lowerLat + gridSpacing;

    // Calculate the nearest lower longitude line based on the grid spacing
    const lowerLon = Math.floor(lon / gridSpacing) * gridSpacing;

    // Calculate the nearest upper longitude line by adding grid spacing to the lower longitude
    const upperLon = lowerLon + gridSpacing;

    // Return an object with the calculated boundaries of the grid area
    return {
        latStart: lowerLat, // Starting latitude of the grid area
        lonStart: lowerLon, // Starting longitude of the grid area
        latEnd: upperLat,   // Ending latitude of the grid area
        lonEnd: upperLon    // Ending longitude of the grid area
    };
}

// Make the calculateArea function available for import in other modules
export { calculateArea };
