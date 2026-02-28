"use client"

import { useState, useEffect } from 'react';
import { detectMultiSourceAnomalies, DetectedAnomaly, TimeSeriesData } from '@/lib/ml-anomaly-detection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const generateMockData = (points = 100): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  let value = 50;
  for (let i = 0; i < points; i++) {
    const date = new Date();
    date.setHours(date.getHours() - (points - i));
    value += (Math.random() - 0.5) * 2;
    if (i > 50 && i < 55) value += 10; // Anomaly
    if (i > 80 && i < 83) value -= 15; // Anomaly
    data.push({
      timestamp: date.toISOString(),
      value,
      source: 'sensor',
    });
  }
  return data;
};

export function AnomalyDetectionViewer() {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [anomalies, setAnomalies] = useState<DetectedAnomaly[]>([]);

  useEffect(() => {
    const mockData = generateMockData();
    setData(mockData);
    const detectedAnomalies = detectMultiSourceAnomalies(mockData);
    setAnomalies(detectedAnomalies);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomaly Detection Viewer</CardTitle>
        <CardDescription>Visualizing anomalies detected in time-series data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" name="Sensor Value" dot={false}/>
            {anomalies.map(anomaly => (
                <ReferenceDot
                    key={anomaly.timestamp}
                    x={anomaly.timestamp}
                    y={anomaly.value}
                    r={5}
                    fill="red"
                    stroke="white"
                />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <div>
          <h4 className="font-semibold mb-2">Detected Anomalies</h4>
          <div className="space-y-2">
            {anomalies.map(anomaly => (
              <div key={anomaly.timestamp} className="p-3 border rounded-md flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                    <p className="font-semibold">
                        {anomaly.type} anomaly detected at {new Date(anomaly.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{anomaly.explanation}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}>
                            Severity: {anomaly.severity}
                        </Badge>
                        <Badge variant="outline">Score: {anomaly.anomalyScore.toFixed(2)}</Badge>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
