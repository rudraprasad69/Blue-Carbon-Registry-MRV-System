"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const priceData = [
    { name: 'Jan', price: 12.5 },
    { name: 'Feb', price: 13.2 },
    { name: 'Mar', price: 14.1 },
    { name: 'Apr', price: 13.8 },
    { name: 'May', price: 15.2 },
    { name: 'Jun', price: 16.1 },
];

export function PriceDiscovery() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Discovery Mechanism</CardTitle>
        <CardDescription>
            Real-time price discovery through transparent order books.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[10, 20]}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" name="Carbon Credit Price (USD)" />
            </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
