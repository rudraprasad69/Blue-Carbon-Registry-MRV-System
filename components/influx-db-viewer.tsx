"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"

const generateDataPoint = () => ({
  time: new Date().toLocaleTimeString(),
  temperature: 25 + Math.random() * 2,
  salinity: 35 + Math.random() * 1,
});

export function InfluxDbViewer() {
  const [data, setData] = useState(() => Array.from({ length: 10 }, generateDataPoint));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(currentData => [...currentData.slice(1), generateDataPoint()]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>InfluxDB Time-Series Data Viewer</CardTitle>
        <CardDescription>
          Visualizing real-time sensor data from an InfluxDB database.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" domain={[24, 28]} />
            <YAxis yAxisId="right" orientation="right" domain={[34, 37]}/>
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature (°C)" />
            <Line yAxisId="right" type="monotone" dataKey="salinity" stroke="#82ca9d" name="Salinity (ppt)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
