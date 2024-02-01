// Imports from geohash: Geohash is a public domain geocode system invented in 2008 by Gustavo Niemeyer and (similar work in 1966) G. Schimpf. It is a hierarchical spatial data structure which subdivides space into buckets of grid shape, which is one of the many applications of what is known as a Z-order curve, and generally space-filling curves.
// ngGeohash is a geohash library for AngularJS. It provides a service and a filter.
// Importing geohash library
import geohash from 'ngeohash';

// Function to calculate the bounds of a square based on its center and step sizes
function calculateSquareBounds(centerLat, centerLon, latStep, lonStep) {
    const halfLat = latStep / 2;
    const halfLon = lonStep / 2;

    // Calculate the start and end points for latitude and longitude
    const latStart = centerLat - halfLat;
    const lonStart = centerLon - halfLon;
    const latEnd = centerLat + halfLat;
    const lonEnd = centerLon + halfLon;
    
    // Return the calculated bounds
    return { latStart, lonStart, latEnd, lonEnd };
}

// Function to create a grid of geohashes within given latitude and longitude bounds
function createGridWithGeohash(latStart, lonStart, latEnd, lonEnd, stepMeters) {
    // Conversion factor from meters to degrees latitude (constant)
    const metersInDegreeLat = 111320;

    // Arrays to store calculated latitudes and longitudes
    let latitudes = [];
    let longitudes = [];
    // Array to store grid points with geohash
    let gridPointsWithGeohash = [];

    // Calculate step size in degrees for latitude
    const stepDegreesLat = stepMeters / metersInDegreeLat;

    // Populate latitudes array within the specified range
    for (let lat = latStart; lat <= latEnd; lat += stepDegreesLat) {
        latitudes.push(lat);
    }

    // For each latitude, calculate corresponding longitude step size
    latitudes.forEach(lat => {
        // Convert latitude from degrees to radians for accurate calculation
        const radiansLat = (lat * Math.PI) / 180;
        // Conversion factor from meters to degrees longitude, adjusted for this latitude
        const metersInDegreeLon = metersInDegreeLat * Math.cos(radiansLat);
        // Calculate step size in degrees for longitude
        const stepDegreesLon = stepMeters / metersInDegreeLon;

        // Reset longitudes array for each latitude
        longitudes = [];

        // Populate longitudes array within the specified range
        for (let lon = lonStart; lon <= lonEnd; lon += stepDegreesLon) {
            longitudes.push(lon);
        }

        // Combine latitudes and longitudes to create grid points
        longitudes.forEach(lon => {
            // Calculate the center point of each grid square
            const centerLat = lat + stepDegreesLat / 2;
            const centerLon = lon + stepDegreesLon / 2;

            // Generate geohash for the center point
            const geohashKey = geohash.encode(centerLat, centerLon);

            // Calculate bounds for the square
            const squareBounds = calculateSquareBounds(centerLat, centerLon, stepDegreesLat, stepDegreesLon);

            // Add the grid point with its geohash and bounds to the array
            gridPointsWithGeohash.push({ lat: centerLat, lon: centerLon, geohash: geohashKey, bounds: squareBounds });
        });
    });

    // Return the array of grid points with their corresponding geohashes
    return gridPointsWithGeohash;
}

// Export the function for use in other modules
export { createGridWithGeohash };
