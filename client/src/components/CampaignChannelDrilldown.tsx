/*
 * CAMPAIGN CHANNEL DRILL-DOWN COMPONENT - Vibrant dark orbital theme
 * Shows detailed marketing channel performance and campaign performance for a selected campaign
 */
import { useState } from 'react';
import { ArrowLeft, TrendingUp, DollarSign, Users, Target, Eye, Zap } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface CampaignChannelDrilldownProps {
  campaign: {
    id: string;
    name: string;
    channels: string | number;
    spend: number;
    revenue: number;
    conversions: number;
    roi: number;
    roas: number;
    cpa: number;
    status: string;
  };
  onBack: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-cyan-500/50 p-3 text-xs bg-slate-950/95 backdrop-blur-sm shadow-xl">
      <div className="font-semibold text-cyan-300 mb-2">{payload[0]?.payload?.channel || payload[0]?.payload?.day}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="text-blue-300">
          {entry.name}: <span className="font-mono text-cyan-400 font-bold">${(entry.value / 1000).toFixed(1)}K</span>
        </div>
      ))}
    </div>
  );
};

// Generate sample channel data for the campaign
const generateChannelData = (campaignName: string) => {
  const channels = ['Email', 'Social Media', 'Paid Ads', 'Organic', 'Referral', 'Direct'];
  const baseData = {
    'Email': { spend: 2000, revenue: 8500, conversions: 180, ctr: 4.2, cpc: 1.2, impressions: 45000 },
    'Social Media': { spend: 3500, revenue: 12000, conversions: 240, ctr: 3.8, cpc: 1.8, impressions: 65000 },
    'Paid Ads': { spend: 4200, revenue: 15800, conversions: 320, ctr: 5.1, cpc: 2.1, impressions: 78000 },
    'Organic': { spend: 0, revenue: 6200, conversions: 125, ctr: 2.1, cpc: 0, impressions: 125000 },
    'Referral': { spend: 800, revenue: 4100, conversions: 85, ctr: 1.9, cpc: 0.9, impressions: 35000 },
    'Direct': { spend: 500, revenue: 2400, conversions: 50, ctr: 1.2, cpc: 0.5, impressions: 25000 },
  };

  return channels.map(channel => {
    const data = baseData[channel as keyof typeof baseData];
    return {
      channel,
      spend: data.spend,
      revenue: data.revenue,
      conversions: data.conversions,
      ctr: data.ctr,
      cpc: data.cpc,
      impressions: data.impressions,
      roi: data.spend > 0 ? ((data.revenue - data.spend) / data.spend * 100).toFixed(1) : 'N/A',
      roas: data.spend > 0 ? (data.revenue / data.spend).toFixed(2) : 'N/A',
      cpa: data.conversions > 0 ? (data.spend / data.conversions).toFixed(2) : 'N/A',
    };
  });
};

// Generate daily trend data
const generateTrendData = () => {
  const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  return days.map(day => ({
    day,
    revenue: Math.floor(Math.random() * 3000) + 1000,
    conversions: Math.floor(Math.random() * 100) + 20,
    spend: Math.floor(Math.random() * 1500) + 500,
  }));
};

type TabType = 'channels' | 'performance';

export default function CampaignChannelDrilldown({ campaign, onBack }: CampaignChannelDrilldownProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('channels');
  const channelData = generateChannelData(campaign.name);
  const trendData = generateTrendData();

  const selectedChannelData = selectedChannel
    ? channelData.find(c => c.channel === selectedChannel)
    : null;

  const totalImpressions = channelData.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = channelData.reduce((sum, c) => sum + (c.impressions * c.ctr / 100), 0);
  const overallCTR = ((totalClicks / totalImpressions) * 100).toFixed(2);

  // Channel Performance Tab
  if (activeTab === 'channels') {
    return (
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-cyan-500/30">
          <button
            onClick={() => setActiveTab('channels')}
            className={`px-4 py-2 font-bold transition-all ${
              activeTab === 'channels'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-blue-300/60 hover:text-blue-300 border-b-2 border-transparent'
            }`}
          >
            Channel Performance
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2 font-bold transition-all ${
              activeTab === 'performance'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-blue-300/60 hover:text-blue-300 border-b-2 border-transparent'
            }`}
          >
            Campaign Performance
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blue-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all mb-4 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Campaigns
            </button>
            <h1 className="text-4xl font-black text-cyan-300 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{campaign.name}</h1>
            <p className="text-blue-300/70">Channel performance breakdown and analysis</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-300/60 mb-2 font-semibold">Campaign Status</div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              campaign.status === 'Active' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {campaign.status}
            </span>
          </div>
        </div>

        {/* Campaign Overview KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="rounded-lg border border-blue-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-blue-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold text-blue-400/70 uppercase tracking-wider">Total Spend</p>
            </div>
            <p className="text-2xl font-black text-blue-300">${(campaign.spend / 1000).toFixed(1)}K</p>
            <p className="text-xs text-blue-300/60 mt-2">Across all channels</p>
          </div>

          <div className="rounded-lg border border-green-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-green-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold text-green-400/70 uppercase tracking-wider">Total Revenue</p>
            </div>
            <p className="text-2xl font-black text-green-400">${(campaign.revenue / 1000).toFixed(1)}K</p>
            <p className="text-xs text-green-300/60 mt-2">From all channels</p>
          </div>

          <div className="rounded-lg border border-purple-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold text-purple-400/70 uppercase tracking-wider">ROI</p>
            </div>
            <p className="text-2xl font-black text-purple-400">{campaign.roi.toFixed(1)}x</p>
            <p className="text-xs text-purple-300/60 mt-2">Return on investment</p>
          </div>

          <div className="rounded-lg border border-orange-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-orange-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold text-orange-400/70 uppercase tracking-wider">Total Impressions</p>
            </div>
            <p className="text-2xl font-black text-orange-400">{(totalImpressions / 1000).toFixed(0)}K</p>
            <p className="text-xs text-orange-300/60 mt-2">Across all channels</p>
          </div>

          <div className="rounded-lg border border-cyan-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-cyan-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold text-cyan-400/70 uppercase tracking-wider">Overall CTR</p>
            </div>
            <p className="text-2xl font-black text-cyan-400">{overallCTR}%</p>
            <p className="text-xs text-cyan-300/60 mt-2">Click-through rate</p>
          </div>
        </div>

        {/* Channel Selection and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Channel List */}
          <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-48 h-48 bg-cyan-500 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-cyan-300 mb-4">Marketing Channels</h3>
              <div className="space-y-2">
                {channelData.map((channel) => (
                  <button
                    key={channel.channel}
                    onClick={() => setSelectedChannel(channel.channel)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedChannel === channel.channel
                        ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-800/30 border border-slate-700/50 text-blue-300 hover:bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold">{channel.channel}</div>
                    <div className="text-xs text-blue-300/60 mt-1">
                      Revenue: ${(channel.revenue / 1000).toFixed(1)}K | ROI: {channel.roi}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Channel Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedChannelData ? (
              <>
                {/* Channel KPIs */}
                <div className="rounded-lg border border-green-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-green-500 rounded-full blur-3xl" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-sm font-bold text-green-300 mb-5">{selectedChannelData.channel} Performance</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <p className="text-xs text-green-300/60 uppercase mb-2 font-semibold">Spend</p>
                        <p className="text-xl font-black text-green-400">${(selectedChannelData.spend / 1000).toFixed(1)}K</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <p className="text-xs text-green-300/60 uppercase mb-2 font-semibold">Revenue</p>
                        <p className="text-xl font-black text-green-400">${(selectedChannelData.revenue / 1000).toFixed(1)}K</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <p className="text-xs text-green-300/60 uppercase mb-2 font-semibold">ROI</p>
                        <p className="text-xl font-black text-green-400">{selectedChannelData.roi}%</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <p className="text-xs text-green-300/60 uppercase mb-2 font-semibold">ROAS</p>
                        <p className="text-xl font-black text-green-400">{selectedChannelData.roas}x</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <p className="text-xs text-green-300/60 uppercase mb-2 font-semibold">CPA</p>
                        <p className="text-xl font-black text-green-400">${selectedChannelData.cpa}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <p className="text-xs text-green-300/60 uppercase mb-2 font-semibold">Conversions</p>
                        <p className="text-xl font-black text-green-400">{selectedChannelData.conversions}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Channel Metrics */}
                <div className="rounded-lg border border-blue-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
                  <h3 className="text-sm font-bold text-blue-300 mb-5">Channel Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-blue-500/15">
                      <span className="text-blue-300/80">Impressions</span>
                      <span className="font-bold text-cyan-400">{(selectedChannelData.impressions / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-blue-500/15">
                      <span className="text-blue-300/80">Click-Through Rate (CTR)</span>
                      <span className="font-bold text-cyan-400">{selectedChannelData.ctr}%</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-blue-500/15">
                      <span className="text-blue-300/80">Cost Per Click (CPC)</span>
                      <span className="font-bold text-cyan-400">${selectedChannelData.cpc}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-300/80">Conversion Rate</span>
                      <span className="font-bold text-cyan-400">{((selectedChannelData.conversions / (selectedChannelData.impressions * selectedChannelData.ctr / 100)) * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-blue-500/30 p-6 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md text-center">
                <p className="text-blue-300/60">Select a channel to view detailed metrics</p>
              </div>
            )}
          </div>
        </div>

        {/* Channel Comparison Chart */}
        <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-cyan-300 mb-6">Channel Revenue Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="gradSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(14, 165, 233, 0.15)" vertical={false} />
                <XAxis dataKey="channel" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="revenue" fill="url(#gradRevenue)" name="Revenue" radius={[8, 8, 0, 0]} animationDuration={800} />
                <Bar dataKey="spend" fill="url(#gradSpend)" name="Spend" radius={[8, 8, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Performance Table */}
        <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5 px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-cyan-300">All Channels Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyan-500/15 bg-gradient-to-r from-blue-900/20 to-cyan-900/10">
                  <th className="text-left py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Channel</th>
                  <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Spend</th>
                  <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Revenue</th>
                  <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Conversions</th>
                  <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">ROI</th>
                  <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">ROAS</th>
                  <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">CPA</th>
                  <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">CTR</th>
                </tr>
              </thead>
              <tbody>
                {channelData.map((channel, idx) => (
                  <tr key={idx} className="border-b border-cyan-500/10 hover:bg-cyan-500/10 transition-all duration-200 group">
                    <td className="py-4 px-6 font-semibold text-cyan-100 group-hover:text-cyan-200">{channel.channel}</td>
                    <td className="text-right py-4 px-6 text-blue-300/80">${(channel.spend / 1000).toFixed(1)}K</td>
                    <td className="text-right py-4 px-6 font-bold text-green-400">${(channel.revenue / 1000).toFixed(1)}K</td>
                    <td className="text-right py-4 px-6 text-blue-300/80">{channel.conversions}</td>
                    <td className="text-right py-4 px-6 font-bold text-cyan-400">{channel.roi}%</td>
                    <td className="text-right py-4 px-6 font-bold text-purple-400">{channel.roas}x</td>
                    <td className="text-right py-4 px-6 text-blue-300/80">${channel.cpa}</td>
                    <td className="text-right py-4 px-6 text-blue-300/80">{channel.ctr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="rounded-lg border border-green-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-green-300 mb-6">7-Day Performance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorRevenueTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(16, 185, 129, 0.15)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={false} animationDuration={800} name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#3b82f6" strokeWidth={3} dot={false} animationDuration={800} name="Conversions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  // Campaign Performance Tab
  if (activeTab === 'performance') {
    return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-cyan-500/30">
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-2 font-bold transition-all ${
            activeTab === 'channels'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-blue-300/60 hover:text-blue-300 border-b-2 border-transparent'
          }`}
        >
          Channel Performance
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 font-bold transition-all ${
            activeTab === 'performance'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-blue-300/60 hover:text-blue-300 border-b-2 border-transparent'
          }`}
        >
          Campaign Performance
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blue-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all mb-4 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Campaigns
          </button>
          <h1 className="text-4xl font-black text-cyan-300 mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{campaign.name}</h1>
          <p className="text-blue-300/70">Campaign performance overview</p>
        </div>
      </div>

      {/* Campaign Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-blue-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-blue-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-blue-400/70 uppercase tracking-wider">Total Spend</p>
          </div>
          <p className="text-2xl font-black text-blue-300">${(campaign.spend / 1000).toFixed(1)}K</p>
        </div>

        <div className="rounded-lg border border-green-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-green-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-green-400/70 uppercase tracking-wider">Total Revenue</p>
          </div>
          <p className="text-2xl font-black text-green-400">${(campaign.revenue / 1000).toFixed(1)}K</p>
        </div>

        <div className="rounded-lg border border-purple-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-purple-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-purple-400/70 uppercase tracking-wider">Conversions</p>
          </div>
          <p className="text-2xl font-black text-purple-400">{campaign.conversions}</p>
        </div>

        <div className="rounded-lg border border-orange-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md hover:border-orange-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-orange-400/70 uppercase tracking-wider">ROAS</p>
          </div>
          <p className="text-2xl font-black text-orange-400">{campaign.roas.toFixed(2)}x</p>
        </div>
      </div>

      {/* Campaign Performance Metrics */}
      <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-cyan-300 mb-6">Campaign Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(14, 165, 233, 0.15)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={false} animationDuration={800} name="Revenue" />
              <Line type="monotone" dataKey="conversions" stroke="#3b82f6" strokeWidth={3} dot={false} animationDuration={800} name="Conversions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    );
  }
}
