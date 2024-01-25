// Imports from geohash: Geohash is a public domain geocode system invented in 2008 by Gustavo Niemeyer and (similar work in 1966) G. Schimpf. It is a hierarchical spatial data structure which subdivides space into buckets of grid shape, which is one of the many applications of what is known as a Z-order curve, and generally space-filling curves.
// ngGeohash is a geohash library for AngularJS. It provides a service and a filter.
import geohash from 'ngeohash';


function createGridWithGeohash(latStart, lonStart, latEnd, lonEnd, stepMeters) {
    // Conversion factor from meters to degrees latitude
    const metersInDegreeLat = 111320; 
    // Convert latitude start point from degrees to radians
    const radiansLat = (latStart * Math.PI) / 180;
    // Conversion factor from meters to degrees longitude, adjusted for latitude
    const metersInDegreeLon = metersInDegreeLat * Math.cos(radiansLat);

    // Calculate step size in degrees for latitude and longitude
    const stepDegreesLat = stepMeters / metersInDegreeLat;
    const stepDegreesLon = stepMeters / metersInDegreeLon;

    // Arrays to store calculated latitudes and longitudes
    let latitudes = [];
    let longitudes = [];
    // Array to store grid points with geohash
    let gridPointsWithGeohash = [];

    // Populate latitudes array within the specified range
    for (let lat = latStart; lat < latEnd; lat += stepDegreesLat) {
        latitudes.push(lat);
    }
    // Populate longitudes array within the specified range
    for (let lon = lonStart; lon < lonEnd; lon += stepDegreesLon) {
        longitudes.push(lon);
    }

    // Combine latitudes and longitudes to create grid points and calculate geohash
    latitudes.forEach(lat => {
        longitudes.forEach(lon => {
            // Calculate the center point of each grid square
            const centerLat = lat + stepDegreesLat / 2;
            const centerLon = lon + stepDegreesLon / 2;
            // Generate geohash for the center point
            const geohashKey = geohash.encode(centerLat, centerLon);
            // Add the grid point with its geohash to the array
            gridPointsWithGeohash.push({ lat, lon, geohash: geohashKey });
        });
    });

    // Return the array of grid points with their corresponding geohashes
    return gridPointsWithGeohash;
}

// Export the function for use in other modules
export { createGridWithGeohash };

