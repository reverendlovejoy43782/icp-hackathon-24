import numpy as np
from .grid_generator import create_grid, calculate_boundaries

def find_nearest_square(grid_points, lat, lon):
    closest_point = None
    min_distance = float('inf')

    for number, (grid_lat, grid_lon) in grid_points.items():
        distance = np.sqrt((grid_lat - lat) ** 2 + (grid_lon - lon) ** 2)
        if distance < min_distance:
            min_distance = distance
            closest_point = number

    return closest_point

# You can also move the grid generation logic here if you plan to reuse it.
def generate_grid():
    central_lat, central_lon = 52.392926, 13.092025
    lat_start, lon_start, lat_end, lon_end = calculate_boundaries(central_lat, central_lon, 2000)
    grid_points = create_grid(lat_start, lon_start, lat_end, lon_end, 500)
    numbered_grid_points = {i: grid_points[i] for i in range(len(grid_points))}
    return numbered_grid_points
