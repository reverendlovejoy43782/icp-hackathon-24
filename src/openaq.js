import axios from 'axios';

const fetchAirQualityData = async (latitude, longitude) => {
  const API_KEY = process.env.REACT_APP_OPENAQ_API_KEY;
  const radius = 10000; // Search radius in meters

  try {
    const response = await axios.get(`https://api.openaq.org/v2/measurements`, {
      params: {
        parameter: 'pm25',
        coordinates: `${latitude},${longitude}`,
        radius: radius,
        limit: 1,
        order_by: 'distance',
        api_key: API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    return null;
  }
};

export default fetchAirQualityData;
