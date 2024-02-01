// Import from gridGenerator.js
// createGridWithGeohash is a function that creates a grid of geohashes
import { createGridWithGeohash } from './gridGenerator';

// Import from geoAreaGenerator.js
// calculateArea is a function that calculates the boundaries of a grid area based on fixed latitude and longitude of the globe
import { calculateArea } from './geoAreaGenerator';


// Function to find the nearest geohash and bounds to a given latitude and longitude
function findNearestGeohashWithBounds(lat, lon) {
    const stepMeters = 500; // Size of each square in the grid, in meters

    // Determine the grid boundaries dynamically based on the client's location
    const { latStart, lonStart, latEnd, lonEnd } = calculateArea(lat, lon);
   

    // Generate grid points with their corresponding geohashes and bounds within these boundaries
    const gridPointsWithGeohashAndBounds = createGridWithGeohash(latStart, lonStart, latEnd, lonEnd, stepMeters);

    let closestGeohash = null; // To store the nearest geohash
    let closestBounds = null; // To store the bounds of the nearest geohash
    let minDistance = Infinity; // Initialize with the largest possible number

    // Iterate through each grid point
    gridPointsWithGeohashAndBounds.forEach((point) => {
        // Calculate Euclidean distance to the given location
        const distance = Math.sqrt((point.lat - lat) ** 2 + (point.lon - lon) ** 2);

        // Update closest geohash and bounds if a closer point is found
        if (distance < minDistance) {
            minDistance = distance;
            closestGeohash = point.geohash;
            closestBounds = point.bounds;
        }
    });

    // Return an object containing both the geohash and the bounds
    return { geohash: closestGeohash, bounds: closestBounds };
}

// Export the function to be used in other parts of the application
export { findNearestGeohashWithBounds };
