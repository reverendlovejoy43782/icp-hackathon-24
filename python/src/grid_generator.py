import numpy as np

# Function to calculate the boundaries of the area based on central coordinates and distance
def calculate_boundaries(lat, lon, distance):
    meters_in_degree_lat = 111320  # Conversion factor from meters to degrees for latitude
    meters_in_degree_lon = 111320 * np.cos(np.radians(lat))  # Conversion factor for longitude, adjusted for latitude

    # Calculate the latitude and longitude increments for the given distance
    delta_lat = distance / meters_in_degree_lat
    delta_lon = distance / meters_in_degree_lon

    # Return the coordinates for the square's boundaries
    return lat - delta_lat, lon - delta_lon, lat + delta_lat, lon + delta_lon

# Function to create a grid within given latitude and longitude boundaries
def create_grid(lat_start, lon_start, lat_end, lon_end, step_meters):
    meters_in_degree_lat = 111320  # Conversion factor from meters to degrees for latitude
    meters_in_degree_lon = 111320 * np.cos(np.radians(lat_start))  # Conversion factor for longitude, adjusted for latitude

    # Calculate the step size in degrees for each grid square
    step_degrees_lat = step_meters / meters_in_degree_lat
    step_degrees_lon = step_meters / meters_in_degree_lon

    # Create arrays of latitude and longitude values using numpy
    latitudes = np.arange(lat_start, lat_end, step_degrees_lat)
    longitudes = np.arange(lon_start, lon_end, step_degrees_lon)

    # Generate grid points (latitude, longitude pairs)
    grid_points = [(lat, lon) for lat in latitudes for lon in longitudes]
    return grid_points

# Central geolocation coordinates
central_lat, central_lon = 52.392926, 13.092025
print(f"Central Geolocation: {central_lat}, {central_lon}")

# Define the boundaries of the area (4000m x 4000m area, 2000 meters from the center)
lat_start, lon_start, lat_end, lon_end = calculate_boundaries(central_lat, central_lon, 2000)
print(f"Area Boundaries:\nLatitude Start: {lat_start}\nLatitude End: {lat_end}\nLongitude Start: {lon_start}\nLongitude End: {lon_end}")

# Create the grid with 500x500 meters numbered squares
grid_points = create_grid(lat_start, lon_start, lat_end, lon_end, 500)
numbered_grid_points = {i: grid_points[i] for i in range(len(grid_points))}
print(f"Number of Grid Points: {len(numbered_grid_points)}")

# Print grid points with numbers
for number, point in numbered_grid_points.items():
    print(f"Square {number}: {point}")