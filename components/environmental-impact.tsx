"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const impactData = [
  { name: 'CO2 Sequestration', value: 17500, fill: 'var(--color-primary)' },
  { name: 'Biodiversity Index', value: 7.8, fill: 'var(--color-accent)' },
  { name: 'Water Quality Score', value: 8.2, fill: 'var(--color-chart-1)' },
  { name: 'Community Jobs Created', value: 5470, fill: 'var(--color-chart-2)' },
];

export function EnvironmentalImpact() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Impact Reporting</CardTitle>
        <CardDescription>
          Comprehensive reporting on the environmental and social impacts of projects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={impactData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Impact Value" />
            </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
