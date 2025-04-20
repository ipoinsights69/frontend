'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface PerformanceData {
  range: string;
  year: number | null;
  total_ipos: number;
  average_listing_gains: number;
  distribution: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
    brackets: {
      above_100: number;
      "50_to_100": number;
      "20_to_50": number;
      "0_to_20": number;
      "neg_20_to_0": number;
      below_neg_20: number;
    };
  };
  exchange_performance: Record<string, {
    count: number;
    total_gains: number;
    avg_gains: number;
    positive: number;
    negative: number;
  }>;
  top_performers: Array<{
    ipo_name: string;
    listing_gains_numeric: number;
  }>;
  bottom_performers: Array<{
    ipo_name: string;
    listing_gains_numeric: number;
  }>;
}

const COLORS = ['#10b981', '#ef4444', '#d1d5db'];
const BRACKET_COLORS = {
  above_100: '#4ade80',
  "50_to_100": '#10b981', 
  "20_to_50": '#60a5fa',
  "0_to_20": '#93c5fd',
  "neg_20_to_0": '#fca5a5',
  below_neg_20: '#ef4444'
};

const BRACKET_LABELS: Record<string, string> = {
  above_100: 'Above 100%',
  "50_to_100": '50% to 100%',
  "20_to_50": '20% to 50%',
  "0_to_20": '0% to 20%',
  "neg_20_to_0": '0% to -20%',
  below_neg_20: 'Below -20%'
};

const IPOPerformanceDistribution = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats/performance');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setPerformanceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching performance data');
        console.error('Error fetching performance distribution:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !performanceData) {
    return (
      <div className="h-[300px] flex items-center justify-center text-red-500">
        Error loading data: {error || 'No data available'}
      </div>
    );
  }

  const { distribution } = performanceData;

  // Prepare data for pie chart
  const pieData = [
    { name: 'Positive', value: distribution.positive },
    { name: 'Negative', value: distribution.negative },
    { name: 'Neutral', value: distribution.neutral }
  ];

  // Prepare data for bracket chart
  const bracketData = Object.entries(distribution.brackets).map(([key, value]) => ({
    name: BRACKET_LABELS[key] || key,
    value: value,
    color: BRACKET_COLORS[key as keyof typeof BRACKET_COLORS] || '#94a3b8'
  })).sort((a, b) => {
    // Custom sort to ensure the brackets appear in logical order
    const order = ['Above 100%', '50% to 100%', '20% to 50%', '0% to 20%', '0% to -20%', 'Below -20%'];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">IPO Listing Performance Distribution</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2 text-center">Overall Success Rate</p>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} IPOs`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#10b981] mr-1"></div>
                <span>Positive ({distribution.positive} IPOs)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#ef4444] mr-1"></div>
                <span>Negative ({distribution.negative} IPOs)</span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2 text-center">Listing Day Returns Distribution</p>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bracketData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={90} />
                  <Tooltip formatter={(value: number) => [`${value} IPOs`, 'Count']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {bracketData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-lg font-medium">Average Listing Day Return: <span className={performanceData.average_listing_gains >= 0 ? 'text-green-600' : 'text-red-600'}>
            {performanceData.average_listing_gains.toFixed(2)}%
          </span></p>
          <p className="text-sm text-gray-500 mt-1">Based on {performanceData.total_ipos} IPOs</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IPOPerformanceDistribution;