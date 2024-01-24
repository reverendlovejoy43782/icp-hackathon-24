// Function to calculate the boundaries of the area based on central coordinates and distance
function calculateBoundaries(lat, lon, distance) {
    const metersInDegreeLat = 111320; // Conversion factor from meters to degrees for latitude
    const radiansLat = (lat * Math.PI) / 180;
    const metersInDegreeLon = metersInDegreeLat * Math.cos(radiansLat); // Conversion for longitude

    const deltaLat = distance / metersInDegreeLat;
    const deltaLon = distance / metersInDegreeLon;

    return [lat - deltaLat, lon - deltaLon, lat + deltaLat, lon + deltaLon];
}

// Function to create a grid within given latitude and longitude boundaries
function createGrid(latStart, lonStart, latEnd, lonEnd, stepMeters) {
    const metersInDegreeLat = 111320; // Conversion factor for latitude
    const radiansLat = (latStart * Math.PI) / 180;
    const metersInDegreeLon = metersInDegreeLat * Math.cos(radiansLat); // Conversion for longitude

    const stepDegreesLat = stepMeters / metersInDegreeLat;
    const stepDegreesLon = stepMeters / metersInDegreeLon;

    let latitudes = [];
    for (let lat = latStart; lat < latEnd; lat += stepDegreesLat) {
        latitudes.push(lat);
    }

    let longitudes = [];
    for (let lon = lonStart; lon < lonEnd; lon += stepDegreesLon) {
        longitudes.push(lon);
    }

    let gridPoints = [];
    latitudes.forEach(lat => {
        longitudes.forEach(lon => {
            gridPoints.push({ lat, lon });
        });
    });

    return gridPoints;
}

// Example usage
const centralLat = 52.392926;
const centralLon = 13.092025;
const [latStart, lonStart, latEnd, lonEnd] = calculateBoundaries(centralLat, centralLon, 2000);
const gridPoints = createGrid(latStart, lonStart, latEnd, lonEnd, 500);

export { calculateBoundaries, createGrid, gridPoints };
