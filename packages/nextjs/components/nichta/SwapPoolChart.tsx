'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
export default function SwapPoolChart() {
  // Dummy data for the chart
  const data = [
    { name: 'Jan', price: 400 },
    { name: 'Feb', price: 300 },
    { name: 'Mar', price: 600 },
    { name: 'Apr', price: 800 },
    { name: 'May', price: 500 },
    { name: 'Jun', price: 900 },
    { name: 'Jul', price: 1000 },
  ];
  return (
    <div>
      <div className="w-full h-[400px] p-4 bg-base-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
        <div className="w-full h-[calc(100%-2rem)]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#A0AEC0' }}
                axisLine={{ stroke: '#4A5568' }}
                tickLine={{ stroke: '#4A5568' }}
              />
              <YAxis
                tick={{ fill: '#A0AEC0' }}
                axisLine={{ stroke: '#4A5568' }}
                tickLine={{ stroke: '#4A5568' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A202C',
                  borderColor: '#2D3748',
                  borderRadius: '0.5rem',
                }}
                itemStyle={{ color: '#E2E8F0' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4299E1"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Token Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
