// lib/biomass-prediction-service.ts

export interface BiomassPrediction {
  projectId: string;
  predictedBiomass: number; // in tons
  confidence: number; // 0 to 1
  predictionDate: string;
  modelUsed: string;
}

export const getBiomassPrediction = async (
  projectId: string,
  area: number // in hectares
): Promise<BiomassPrediction> => {
  console.log(`Generating biomass prediction for project ${projectId} with area ${area} ha...`);
  // Simulate a call to a complex ML model
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock prediction logic
  const predictedBiomass = area * (20 + Math.random() * 10); // e.g., 20-30 tons per hectare
  const confidence = 0.85 + Math.random() * 0.1; // 85% - 95% confidence

  const prediction: BiomassPrediction = {
    projectId,
    predictedBiomass: parseFloat(predictedBiomass.toFixed(2)),
    confidence: parseFloat(confidence.toFixed(2)),
    predictionDate: new Date().toISOString(),
    modelUsed: 'BioPred-v1.2',
  };

  console.log(`Prediction generated for project ${projectId}:`, prediction);
  return prediction;
};
