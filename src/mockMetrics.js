const generateRandomValue = (min, max) => {
    return (Math.random() * (max - min) + min).toFixed(2);
  };
  
  export const generateMockMetrics = () => {
    return {
      pollutionIndex: generateRandomValue(0, 0.35),
      trafficAccidentsProbability: generateRandomValue(0, 0.35),
      incidenceRatePandemicDiseases: generateRandomValue(0, 0.35),
      // Generating crimeIndex within the range of 0.2 to 0.7
      crimeIndex: generateRandomValue(0.2, 0.7),
      floodingProbability: generateRandomValue(0, 0.35),
      hurricaneProbability: generateRandomValue(0, 0.35),
    };
  };