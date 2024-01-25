// Import from gridGenerator.js
// createGridWithGeohash is a function that creates a grid of geohashes
import { createGridWithGeohash } from './gridGenerator';

// Import from geoAreaGenerator.js
// calculateArea is a function that calculates the boundaries of a grid area based on fixed latitude and longitude of the globe
import { calculateArea } from './geoAreaGenerator';


// Function to find the nearest geohash to a given latitude and longitude
function findNearestGeohash(lat, lon) {
    const stepMeters = 500; // Size of each square in the grid, in meters

    // Determine the grid boundaries dynamically based on the client's location
    const { latStart, lonStart, latEnd, lonEnd } = calculateArea(lat, lon);

    // Generate grid points with their corresponding geohashes within these boundaries
    const gridPointsWithGeohash = createGridWithGeohash(latStart, lonStart, latEnd, lonEnd, stepMeters);

    let closestGeohash = null; // To store the nearest geohash
    let minDistance = Infinity; // Initialize with the largest possible number

    // Iterate through each grid point
    gridPointsWithGeohash.forEach((point) => {
        // Calculate Euclidean distance to the given location
        const distance = Math.sqrt((point.lat - lat) ** 2 + (point.lon - lon) ** 2);

        // Update closest geohash if a closer point is found
        if (distance < minDistance) {
            minDistance = distance;
            closestGeohash = point.geohash;
        }
    });

    // Return the nearest geohash
    return closestGeohash;
}

// Export the function to be used in other parts of the application
export { findNearestGeohash };
