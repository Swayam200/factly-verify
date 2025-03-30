
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LabelList 
} from 'recharts';
import { ChartBar, ExternalLink } from 'lucide-react';

interface Source {
  url: string;
  title: string;
  snippet?: string;
  reliability?: number;
}

interface SourcesChartProps {
  sources: Source[];
}

const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch (e) {
    return url;
  }
};

const COLORS = [
  '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', 
  '#6366F1', '#14B8A6', '#F97316', '#8B5CF6'
];

const SourcesChart: React.FC<SourcesChartProps> = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  // Group sources by domain
  const sourcesByDomain: Record<string, { count: number, sources: Source[] }> = {};
  sources.forEach(source => {
    const domain = extractDomain(source.url);
    if (!sourcesByDomain[domain]) {
      sourcesByDomain[domain] = { count: 0, sources: [] };
    }
    sourcesByDomain[domain].count += 1;
    sourcesByDomain[domain].sources.push(source);
  });

  // Convert to array and sort by count
  const data = Object.entries(sourcesByDomain)
    .map(([domain, { count, sources }], index) => ({
      name: domain,
      value: count,
      sources,
      color: COLORS[index % COLORS.length]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7); // Limit to top 7 sources for readability

  const config = {
    bar1: {
      theme: { light: "#8B5CF6", dark: "#A78BFA" }
    },
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-4 bg-popover border border-border rounded-lg shadow-lg">
          <p className="font-medium text-sm mb-1">{data.name}</p>
          <p className="text-sm font-semibold text-primary">{data.value} sources</p>
          
          {data.sources && data.sources.length > 0 && (
            <div className="mt-2 space-y-1.5 max-w-72">
              <p className="text-xs font-medium text-muted-foreground">Top sources:</p>
              {data.sources.slice(0, 3).map((source: Source, i: number) => (
                <div key={i} className="text-xs">
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary truncate"
                  >
                    {source.title.length > 40 ? `${source.title.substring(0, 40)}...` : source.title}
                    <ExternalLink size={10} />
                  </a>
                </div>
              ))}
              {data.sources.length > 3 && (
                <p className="text-xs text-muted-foreground">...and {data.sources.length - 3} more</p>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChartBar size={18} className="text-primary" />
            <CardTitle className="text-lg font-semibold">Source Analysis</CardTitle>
          </div>
          <span className="text-xs text-muted-foreground bg-secondary/40 py-1 px-2 rounded-full">
            {sources.length} total sources
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 mt-2">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 5, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tickLine={false}
                  axisLine={false}
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]}
                  barSize={32}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      fillOpacity={0.7}
                      strokeWidth={0}
                    />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="right" 
                    formatter={(value: number) => `${value}`}
                    style={{ fill: 'var(--foreground)', fontWeight: 500, fontSize: 13 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Hover over bars for source details and click-through links
        </p>
      </CardContent>
    </Card>
  );
};

export default SourcesChart;
