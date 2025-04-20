'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface YearlyStats {
  year: number;
  count: number;
  avg_listing_gains: number;
  positive_listings: number;
  negative_listings: number;
  total_applications: number;
  ipo_size_total: number;
}

const IPOYearlyTrends = () => {
  const [yearlyData, setYearlyData] = useState<YearlyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<'count' | 'gains' | 'applications'>('count');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats/yearly');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setYearlyData(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching yearly data');
        console.error('Error fetching yearly trends:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Format data for specific metric views
  const getChartData = () => {
    switch (activeMetric) {
      case 'count':
        return yearlyData.map(year => ({
          year: year.year,
          'Total IPOs': year.count,
        }));
      case 'gains':
        return yearlyData.map(year => ({
          year: year.year,
          'Average Listing Gains (%)': parseFloat(year.avg_listing_gains.toFixed(2)),
          'Positive Listings': year.positive_listings,
          'Negative Listings': year.negative_listings,
        }));
      case 'applications':
        return yearlyData.map(year => ({
          year: year.year,
          'Total Applications': year.total_applications,
        }));
      default:
        return yearlyData;
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center text-red-500">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Tabs defaultValue="count" onValueChange={(value) => setActiveMetric(value as any)}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">IPO Market Trends (2020-2025)</h3>
            <TabsList>
              <TabsTrigger value="count">Yearly Count</TabsTrigger>
              <TabsTrigger value="gains">Listing Gains</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="count" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}`, 'Total IPOs']}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="Total IPOs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="gains" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="Average Listing Gains (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="Positive Listings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="Negative Listings" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="applications" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()}`, 'Total Applications']}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="Total Applications" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IPOYearlyTrends; 