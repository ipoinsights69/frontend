'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MotionCard from './MotionCard';
import IPOYearlyTrends from './IPOYearlyTrends';
import IPOPerformanceDistribution from './IPOPerformanceDistribution';

interface IpoMarketDashboardProps {
  performanceData: any;
  trendsData: any;
}

const IpoMarketDashboard: React.FC<IpoMarketDashboardProps> = ({ 
  performanceData,
  trendsData
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Dashboard header with filters
  const dashboardHeader = (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Analytics</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Insights and trends from the IPO market</p>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        className="w-full lg:w-auto"
      >
        <TabsList className="w-full lg:w-auto grid grid-cols-4 lg:flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );

  // Overview dashboard tab
  const renderOverviewTab = () => (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <MotionCard className="col-span-1" delay={0.1} gradient={false}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">IPO Volume Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendsData?.data || []}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </MotionCard>
      
      <MotionCard className="col-span-1" delay={0.2} gradient={false}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Success Rate by Industry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[
                  { name: 'Technology', rate: 75 },
                  { name: 'Healthcare', rate: 65 },
                  { name: 'Finance', rate: 60 },
                  { name: 'Consumer', rate: 55 },
                  { name: 'Energy', rate: 45 },
                ]}
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                <Bar 
                  dataKey="rate" 
                  fill="#8b5cf6" 
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </MotionCard>
      
      <MotionCard className="col-span-1 lg:col-span-2" delay={0.3} gradient={false}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Quarterly IPO Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { quarter: 'Q1 2023', count: 12, avgReturn: 15.2 },
                  { quarter: 'Q2 2023', count: 18, avgReturn: 22.5 },
                  { quarter: 'Q3 2023', count: 15, avgReturn: 10.8 },
                  { quarter: 'Q4 2023', count: 22, avgReturn: 5.3 },
                  { quarter: 'Q1 2024', count: 20, avgReturn: 8.7 },
                  { quarter: 'Q2 2024', count: 25, avgReturn: 12.1 },
                  { quarter: 'Q3 2024', count: 28, avgReturn: 18.4 },
                  { quarter: 'Q4 2024', count: 24, avgReturn: 14.9 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="quarter" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  name="Number of IPOs"
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="avgReturn" 
                  stroke="#10b981" 
                  name="Avg. Return (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </MotionCard>
    </motion.div>
  );

  // Trends dashboard tab
  const renderTrendsTab = () => (
    <motion.div 
      className="grid grid-cols-1 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <IPOYearlyTrends />
    </motion.div>
  );

  // Performance dashboard tab
  const renderPerformanceTab = () => (
    <motion.div 
      className="grid grid-cols-1 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <IPOPerformanceDistribution />
    </motion.div>
  );

  // Predictions dashboard tab (placeholder)
  const renderPredictionsTab = () => (
    <motion.div 
      className="grid grid-cols-1 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <MotionCard>
        <CardHeader>
          <CardTitle>IPO Market Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Coming Soon</h3>
              <p className="text-blue-600 dark:text-blue-400">
                Our predictive analysis engine is currently in development. 
                Soon you'll be able to see AI-powered forecasts for upcoming IPOs and market trends.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">+15%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Projected market growth</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">45</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expected IPOs next quarter</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">75%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI prediction accuracy</p>
              </div>
            </div>
          </div>
        </CardContent>
      </MotionCard>
    </motion.div>
  );

  return (
    <section 
      ref={ref} 
      className="mb-12 animate-slide-up"
      style={{ animationDelay: '0.1s' }}
    >
      {dashboardHeader}
      
      <div className="mt-4">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'trends' && renderTrendsTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
        {activeTab === 'predictions' && renderPredictionsTab()}
      </div>
    </section>
  );
};

export default IpoMarketDashboard; 