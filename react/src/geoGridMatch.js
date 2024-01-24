import { gridPoints } from './gridGenerator';

function findNearestSquare(lat, lon) {
    let closestPointIndex = null;
    let minDistance = Infinity;

    gridPoints.forEach((point, index) => {
        const distance = Math.sqrt((point.lat - lat) ** 2 + (point.lon - lon) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
            closestPointIndex = index;
        }
    });

    return closestPointIndex;
}

export { findNearestSquare };
