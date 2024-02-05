const generateRandomValue = () => Math.random().toFixed(2);

export const generateMockMetrics = () => {
  return {
    pollutionIndex: generateRandomValue(),
    trafficAccidentsProbability: generateRandomValue(),
    incidenceRatePandemicDiseases: generateRandomValue(),
    crimeIndex: generateRandomValue(),
    floodingProbability: generateRandomValue(),
    hurricaneProbability: generateRandomValue(),
  };
};