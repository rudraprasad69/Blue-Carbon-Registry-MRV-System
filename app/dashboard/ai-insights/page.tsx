// app/dashboard/ai-insights/page.tsx

import BiomassPredictionModel from '@/components/biomass-prediction-model';

const AiInsightsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI/ML Insights</h1>
      <p className="mb-6 text-gray-600">
        Interact with our AI models to get predictions and insights on your projects.
      </p>
      <BiomassPredictionModel />
    </div>
  );
};

export default AiInsightsPage;
