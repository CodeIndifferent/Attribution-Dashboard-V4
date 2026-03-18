/*
 * ANALYTICS DASHBOARD PAGE
 * Displays traffic and geographic data
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dailyActivityData } from '@/lib/dashboardSampleData';
import { Globe, Map, Navigation } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

const geoData = [
  { name: 'North America', value: 45 },
  { name: 'Europe', value: 25 },
  { name: 'Asia', value: 15 },
  { name: 'South America', value: 8 },
  { name: 'Africa', value: 4 },
  { name: 'Oceania', value: 3 },
];

export default function DashboardAnalytics() {
  return (
    <DashboardLayout title="Analytics & Geography" subtitle="Monitor global traffic distribution and user demographics">
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-gray-500 uppercase">Global Reach</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">142 Countries</p>
            <p className="text-xs text-gray-500 mt-1">Active user locations</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-4 h-4 text-green-600" />
              <p className="text-xs text-gray-500 uppercase">Top Region</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">North America</p>
            <p className="text-xs text-gray-500 mt-1">45% of total traffic</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-gray-500 uppercase">Avg Session Duration</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">4m 32s</p>
            <p className="text-xs text-gray-500 mt-1">Across all regions</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Geographic Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={geoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {geoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic Trend */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Trend by Region</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" name="Active Users" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
