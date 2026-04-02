// components/biomass-prediction-model.tsx
'use client';

import { useState } from 'react';
import {
  getBiomassPrediction,
  BiomassPrediction,
} from '@/lib/biomass-prediction-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BiomassPredictionModel = () => {
  const [area, setArea] = useState<number>(100);
  const [prediction, setPrediction] = useState<BiomassPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePrediction = async () => {
    setLoading(true);
    setPrediction(null);
    const result = await getBiomassPrediction('proj-ai-1', area);
    setPrediction(result);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Biomass Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="area-input">Project Area (Hectares)</Label>
            <Input
              id="area-input"
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              placeholder="Enter area in hectares"
              className="w-[200px]"
            />
          </div>
          <Button onClick={handlePrediction} disabled={loading} className="w-[200px]">
            {loading ? 'Generating Prediction...' : 'Run Prediction Model'}
          </Button>

          {prediction && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Prediction Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Predicted Biomass:</strong> {prediction.predictedBiomass} tons
                </p>
                <p>
                  <strong>Confidence Level:</strong> {prediction.confidence * 100}%
                </p>
                <p>
                  <strong>Model Used:</strong> {prediction.modelUsed}
                </p>
                <p>
                  <strong>Prediction Date:</strong>{' '}
                  {new Date(prediction.predictionDate).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomassPredictionModel;
