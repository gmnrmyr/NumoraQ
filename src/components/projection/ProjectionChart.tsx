
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProjectionChartProps {
  projectionData: any[];
  isPositiveProjection: boolean;
  currencySymbol: string;
}

export const ProjectionChart: React.FC<ProjectionChartProps> = ({
  projectionData,
  isPositiveProjection,
  currencySymbol
}) => {
  return (
    <div className="h-64 w-full mb-6 py-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={projectionData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="month" 
            label={{ 
              value: 'Months', 
              position: 'insideBottomRight', 
              offset: -5,
              fill: 'rgba(255,255,255,0.6)',
              fontSize: 12
            }}
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
          />
          <YAxis 
            label={{ 
              value: 'Balance', 
              angle: -90, 
              position: 'insideLeft',
              fill: 'rgba(255,255,255,0.6)',
              fontSize: 12
            }}
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid #333',
              borderRadius: 0,
              color: '#fff',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12
            }}
            formatter={(value) => [`${currencySymbol}${Number(value).toLocaleString()}`, 'Balance']}
            labelFormatter={(label) => `Month ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke={isPositiveProjection ? "#00ff00" : "#ff0066"} 
            strokeWidth={2}
            dot={{ r: 3, fill: isPositiveProjection ? "#00ff00" : "#ff0066" }}
            activeDot={{ r: 5, fill: isPositiveProjection ? "#00ff00" : "#ff0066" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
