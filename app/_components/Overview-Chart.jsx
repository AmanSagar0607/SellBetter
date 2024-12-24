"use client";

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-lg">
        <p className="label font-semibold text-white">{`Date: ${label}`}</p>
        <p className="text-pink-400">{`Earnings: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

export function OverviewChart({ data }) {
  const [opacity, setOpacity] = useState({
    earnings: 1,
  });

  const chartData = data.dailyEarnings.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    earnings: parseFloat(item.total),
  }));

  const handleMouseEnter = (o) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 0.5 });
  };

  const handleMouseLeave = (o) => {
    const { dataKey } = o;
    setOpacity({ ...opacity, [dataKey]: 1 });
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="date"
            stroke="#888888"
            tick={{ fill: '#888888' }}
            tickLine={{ stroke: '#888888' }}
          />
          <YAxis
            stroke="#888888"
            tick={{ fill: '#888888' }}
            tickLine={{ stroke: '#888888' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="#ec4899"
            strokeWidth={2}
            dot={{ r: 4, fill: "#ec4899" }}
            activeDot={{ r: 8 }}
            opacity={opacity.earnings}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}