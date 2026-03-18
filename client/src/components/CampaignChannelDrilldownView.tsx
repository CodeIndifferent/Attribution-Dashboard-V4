/*
 * CAMPAIGN CHANNEL DRILL-DOWN VIEW
 * Shows detailed conversion metrics for each channel (Twitter, Email, Publication)
 * when a growth campaign is clicked
 */
import { ArrowLeft, TrendingUp, DollarSign, Users, Target, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface ChannelMetrics {
  conversions: number;
  conversionRate: number;
  spend: number;
  revenue: number;
}

interface Campaign {
  id: string;
  name: string;
  type: string;
  channels: string[];
  metrics: {
    twitter: ChannelMetrics;
    email: ChannelMetrics;
    publication: ChannelMetrics;
  };
  totalConversions: number;
  totalRevenue: number;
  totalSpend: number;
  roas: number;
  trend: string;
  status: string;
}

interface CampaignChannelDrilldownViewProps {
  campaign: Campaign;
  onBack: () => void;
}

const CHANNEL_COLORS = {
  twitter: '#1DA1F2',
  email: '#10b981',
  publication: '#f59e0b',
};

// Generate detailed daily metrics for each channel
const generateChannelDailyData = (channelName: string) => {
  const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  const baseConversions = {
    twitter: 22,
    email: 45,
    publication: 13,
  };
  
  return days.map(day => ({
    day,
    conversions: baseConversions[channelName as keyof typeof baseConversions] + Math.floor(Math.random() * 10),
    revenue: Math.floor(Math.random() * 3000) + 1000,
    spend: Math.floor(Math.random() * 500) + 200,
  }));
};

// Generate demographic data by channel
const generateDemographicData = (channelName: string) => {
  const demographics = {
    twitter: [
      { segment: '18-24', value: 28, percentage: 18 },
      { segment: '25-34', value: 52, percentage: 33 },
      { segment: '35-44', value: 38, percentage: 24 },
      { segment: '45-54', value: 22, percentage: 14 },
      { segment: '55+', value: 16, percentage: 11 },
    ],
    email: [
      { segment: '18-24', value: 35, percentage: 11 },
      { segment: '25-34', value: 95, percentage: 30 },
      { segment: '35-44', value: 108, percentage: 35 },
      { segment: '45-54', value: 52, percentage: 17 },
      { segment: '55+', value: 28, percentage: 9 },
    ],
    publication: [
      { segment: '18-24', value: 8, percentage: 9 },
      { segment: '25-34', value: 22, percentage: 25 },
      { segment: '35-44', value: 35, percentage: 39 },
      { segment: '45-54', value: 18, percentage: 20 },
      { segment: '55+', value: 6, percentage: 7 },
    ],
  };
  
  return demographics[channelName as keyof typeof demographics] || [];
};

export default function CampaignChannelDrilldownView({ campaign, onBack }: CampaignChannelDrilldownViewProps) {
  const channels = [
    { name: 'twitter', label: 'Twitter', color: CHANNEL_COLORS.twitter, metrics: campaign.metrics.twitter },
    { name: 'email', label: 'Email', color: CHANNEL_COLORS.email, metrics: campaign.metrics.email },
    { name: 'publication', label: 'Publication', color: CHANNEL_COLORS.publication, metrics: campaign.metrics.publication },
  ];

  const channelComparison = channels.map(ch => ({
    channel: ch.label,
    conversions: ch.metrics.conversions,
    revenue: ch.metrics.revenue,
    spend: ch.metrics.spend,
    roi: ((ch.metrics.revenue - ch.metrics.spend) / ch.metrics.spend * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Campaigns
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{campaign.name}</h1>
          <p className="text-gray-600">Channel performance breakdown across Twitter, Email, and Publication</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">Campaign Type</div>
          <Badge className={`text-[10px] px-3 py-1 h-6 ${
            campaign.type === 'Promotion' 
              ? 'bg-orange-50 text-orange-700 border-orange-200' 
              : 'bg-purple-50 text-purple-700 border-purple-200'
          }`}>
            {campaign.type}
          </Badge>
        </div>
      </div>

      {/* Campaign Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-gray-500 uppercase">Total Conversions</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{campaign.totalConversions.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Across all channels</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-xs text-gray-500 uppercase">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">${(campaign.totalRevenue / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-500 mt-1">From all channels</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-purple-600" />
            <p className="text-xs text-gray-500 uppercase">Total Spend</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">${(campaign.totalSpend / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-500 mt-1">Marketing investment</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-orange-600" />
            <p className="text-xs text-gray-500 uppercase">ROAS</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{campaign.roas.toFixed(2)}x</p>
          <p className="text-xs text-gray-500 mt-1">Return on ad spend</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-xs text-gray-500 uppercase">Trend</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{campaign.trend}</p>
          <p className="text-xs text-gray-500 mt-1">Growth vs baseline</p>
        </div>
      </div>

      {/* Channel Comparison Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={channelComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="conversions" fill="#3b82f6" name="Conversions" />
            <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Channel Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <div key={channel.name} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }} />
              <h3 className="text-lg font-semibold text-gray-900">{channel.label}</h3>
            </div>

            {/* Channel KPIs */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-700">Conversions</span>
                <span className="font-semibold text-gray-900">{channel.metrics.conversions}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-700">Conversion Rate</span>
                <span className="font-semibold text-gray-900">{channel.metrics.conversionRate}%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-700">Spend</span>
                <span className="font-semibold text-gray-900">${(channel.metrics.spend / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-700">Revenue</span>
                <span className="font-semibold text-green-600">${(channel.metrics.revenue / 1000).toFixed(1)}K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">ROI</span>
                <span className="font-semibold text-blue-600">{((channel.metrics.revenue - channel.metrics.spend) / channel.metrics.spend * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Performance Badge */}
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: `${channel.color}20` }}>
              <BarChart3 className="w-4 h-4" style={{ color: channel.color }} />
              <span className="text-sm font-semibold" style={{ color: channel.color }}>
                {channel.metrics.conversions > 300 ? 'High Performer' : channel.metrics.conversions > 150 ? 'Good Performer' : 'Standard Performer'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Channel Daily Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <div key={`trend-${channel.name}`} className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">{channel.label} - 7 Day Trend</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={generateChannelDailyData(channel.name)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="conversions" stroke={channel.color} strokeWidth={2} name="Conversions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Demographics by Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {channels.map((channel) => {
          const demographicData = generateDemographicData(channel.name);
          return (
            <div key={`demo-${channel.name}`} className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">{channel.label} - Age Demographics</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={demographicData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ segment, percentage }) => `${segment}: ${percentage}%`}
                    outerRadius={80}
                    fill={channel.color}
                    dataKey="value"
                  >
                    {demographicData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={`${channel.color}${80 - index * 15}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Channel Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Channel</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Conversions</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Conv. Rate</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Spend</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Revenue</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">CPA</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">ROAS</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">ROI</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel) => {
                const cpa = channel.metrics.spend / channel.metrics.conversions;
                const roas = channel.metrics.revenue / channel.metrics.spend;
                const roi = ((channel.metrics.revenue - channel.metrics.spend) / channel.metrics.spend * 100);
                return (
                  <tr key={channel.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{channel.label}</td>
                    <td className="text-right py-3 px-4 text-gray-700">{channel.metrics.conversions}</td>
                    <td className="text-right py-3 px-4 text-gray-700">{channel.metrics.conversionRate}%</td>
                    <td className="text-right py-3 px-4 text-gray-700">${(channel.metrics.spend / 1000).toFixed(1)}K</td>
                    <td className="text-right py-3 px-4 font-semibold text-green-600">${(channel.metrics.revenue / 1000).toFixed(1)}K</td>
                    <td className="text-right py-3 px-4 text-gray-700">${cpa.toFixed(2)}</td>
                    <td className="text-right py-3 px-4 font-semibold text-blue-600">{roas.toFixed(2)}x</td>
                    <td className="text-right py-3 px-4 font-semibold text-gray-900">{roi.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
