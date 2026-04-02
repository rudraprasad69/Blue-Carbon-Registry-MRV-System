/**
 * NDVI Time Series Chart
 * 
 * Displays a time series chart of NDVI values over a given period.
 * Uses Recharts for rendering the chart.
 */

'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { type TimeSeriesPoint } from '@/lib/earth-engine-service'

interface NdviTimeSeriesChartProps {
  data: TimeSeriesPoint[]
}

const NdviTimeSeriesChart = ({ data }: NdviTimeSeriesChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-slate-500">
        No time series data available.
      </div>
    )
  }

  const formattedData = data.map(point => ({
    date: new Date(point.date).toLocaleDateString(),
    ndvi: point.value,
  }));

  return (
    <div className="w-full h-96 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">NDVI Time Series</h3>
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
            data={formattedData}
            margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[-1, 1]}/>
            <Tooltip
                contentStyle={{
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    color: '#e5e7eb',
                }}
            />
            <Legend wrapperStyle={{ color: '#e5e7eb' }}/>
            <Line
                type="monotone"
                dataKey="ndvi"
                stroke="#84cc16"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
            />
        </LineChart>
        </ResponsiveContainer>
    </div>
  )
}

export default NdviTimeSeriesChart
