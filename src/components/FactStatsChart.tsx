
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FactCheckResult } from '@/context/FactCheckContext';

interface FactStatsChartProps {
  results: FactCheckResult[];
  className?: string;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6b7280'];

const FactStatsChart: React.FC<FactStatsChartProps> = ({ results, className }) => {
  if (!results || results.length === 0) {
    return null;
  }
  
  // Count results by status
  const statusCounts = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Convert to array for chart
  const data = [
    { name: 'True', value: statusCounts['true'] || 0, color: COLORS[0] },
    { name: 'False', value: statusCounts['false'] || 0, color: COLORS[1] },
    { name: 'Neutral', value: statusCounts['neutral'] || 0, color: COLORS[2] },
    { name: 'Unknown', value: statusCounts['unknown'] || 0, color: COLORS[3] }
  ].filter(item => item.value > 0);
  
  // Generate confidence average
  const averageConfidence = results.length 
    ? Math.round((results.reduce((acc, result) => acc + result.confidenceScore, 0) / results.length) * 100) 
    : 0;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Fact Check Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-around gap-4">
          <div className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground mb-2">Results Distribution</p>
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} checks`, 'Count']}
                    contentStyle={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="stats grid grid-cols-2 gap-4">
            <div className="stat bg-secondary/30 p-4 rounded-md text-center">
              <div className="stat-title text-xs text-muted-foreground">Total Checks</div>
              <div className="stat-value text-2xl font-bold">{results.length}</div>
            </div>
            
            <div className="stat bg-secondary/30 p-4 rounded-md text-center">
              <div className="stat-title text-xs text-muted-foreground">Avg. Confidence</div>
              <div className="stat-value text-2xl font-bold">{averageConfidence}%</div>
            </div>
            
            <div className="stat bg-secondary/30 p-4 rounded-md text-center">
              <div className="stat-title text-xs text-muted-foreground">True Claims</div>
              <div className="stat-value text-2xl font-bold text-result-true">{statusCounts['true'] || 0}</div>
            </div>
            
            <div className="stat bg-secondary/30 p-4 rounded-md text-center">
              <div className="stat-title text-xs text-muted-foreground">False Claims</div>
              <div className="stat-value text-2xl font-bold text-result-false">{statusCounts['false'] || 0}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FactStatsChart;
