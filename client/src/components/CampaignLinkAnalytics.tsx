/*
 * CAMPAIGN LINK ANALYTICS
 * Multi-channel performance tracking for a single campaign link
 */
import { CampaignLink, CampaignCategory, CampaignChannelMetrics } from '@/lib/campaignLinkData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react';

interface CampaignLinkAnalyticsProps {
  link: CampaignLink;
  onChannelClick?: (channel: CampaignChannelMetrics) => void;
}

const CHANNEL_COLORS: Record<CampaignCategory, string> = {
  'Social Media': '#3b82f6',
  'Email Outreach': '#10b981',
  'Mobile': '#f59e0b',
  'Article': '#8b5cf6',
  'Ads': '#ef4444',
};

export default function CampaignLinkAnalytics({ link, onChannelClick }: CampaignLinkAnalyticsProps) {
  // Prepare data for charts
  const channelData = link.channels.map(ch => ({
    name: ch.channel,
    clicks: ch.clicks,
    conversions: ch.conversions,
    revenue: ch.revenue,
    roi: ch.roi,
    ctr: ch.ctr,
  }));

  const roiData = link.channels.map(ch => ({
    channel: ch.channel,
    roi: ch.roi,
  }));

  const conversionData = link.channels.map(ch => ({
    channel: ch.channel,
    rate: ch.conversionRate,
  }));

  const revenueByChannel = link.channels.map(ch => ({
    name: ch.channel,
    value: ch.revenue,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{link.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{link.description}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase">Short Code</p>
            <p className="text-2xl font-mono font-bold text-blue-600">{link.shortCode}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Clicks</p>
              <p className="text-lg font-bold text-gray-900">{link.totalClicks.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Conversions</p>
              <p className="text-lg font-bold text-gray-900">{link.totalConversions.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Overall ROI</p>
              <p className="text-lg font-bold text-gray-900">{link.overallRoi.toFixed(1)}x</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Revenue</p>
              <p className="text-lg font-bold text-gray-900">${(link.totalRevenue / 1000).toFixed(1)}K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI by Channel */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI by Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="roi" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rate by Channel */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate by Channel (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByChannel}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${(value / 1000).toFixed(1)}K`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByChannel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[entry.name as CampaignCategory]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${(value as number / 1000).toFixed(1)}K`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Clicks vs Conversions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clicks vs Conversions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="clicks" fill="#3b82f6" />
              <Bar dataKey="conversions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Channel Performance Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Channel</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Clicks</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Impressions</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">CTR (%)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Conversions</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Conv. Rate (%)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Revenue</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">ROI</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg Time (s)</th>
              </tr>
            </thead>
            <tbody>
              {link.channels.map((channel, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => onChannelClick?.(channel)}>
                  <td className="py-3 px-4 font-medium text-gray-900">{channel.channel}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{channel.clicks.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{channel.impressions.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{channel.ctr.toFixed(2)}%</td>
                  <td className="text-right py-3 px-4 text-gray-700">{channel.conversions.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{channel.conversionRate.toFixed(2)}%</td>
                  <td className="text-right py-3 px-4 font-semibold text-gray-900">${(channel.revenue / 1000).toFixed(1)}K</td>
                  <td className="text-right py-3 px-4">
                    <span className={`font-semibold ${channel.roi > 4 ? 'text-green-600' : channel.roi > 3 ? 'text-blue-600' : 'text-gray-600'}`}>
                      {channel.roi.toFixed(1)}x
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-700">{channel.avgTimeOnSite}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
