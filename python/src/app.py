from flask import Flask, render_template, request, jsonify
import sys
import os

# Adjust the path to include the 'src' directory where your modules are
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.geo_grid_match import find_nearest_square, generate_grid
from src.grid_generator import calculate_boundaries, create_grid

app = Flask(__name__, template_folder='../templates')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/send_location', methods=['POST'])
def receive_location():
    data = request.get_json()
    lat = data['latitude']
    lon = data['longitude']

    
    numbered_grid_points = generate_grid()
    nearest_square = find_nearest_square(numbered_grid_points, lat, lon)
    print(f"The nearest square number for the geolocation is: {nearest_square}")

    return jsonify({"status": "success", "nearest_square": nearest_square})

if __name__ == '__main__':
    app.run(debug=True)
