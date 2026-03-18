/*
 * CAMPAIGN PERFORMANCE - GROWTH CAMPAIGNS
 * Displays company growth campaigns (promotions, product launches) with channel-specific conversion analytics
 * Shows performance metrics across Twitter, Email, and Publications to help identify which channel performs best
 */
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Target, TrendingUp, ChevronRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CampaignChannelDrilldownView from './CampaignChannelDrilldownView';

// Growth campaigns: promotions, product launches, etc.
const growthCampaigns = [
  {
    id: 'summer_promo_2024',
    name: 'Summer Sale 2024',
    type: 'Promotion',
    channels: ['Twitter', 'Email', 'Publication'],
    metrics: {
      twitter: { conversions: 156, conversionRate: 4.2, spend: 2500, revenue: 8900 },
      email: { conversions: 312, conversionRate: 8.7, spend: 800, revenue: 12400 },
      publication: { conversions: 89, conversionRate: 2.1, spend: 1200, revenue: 4500 },
    },
    totalConversions: 557,
    totalRevenue: 25800,
    totalSpend: 4500,
    roas: 5.73,
    trend: '+24%',
    status: 'Active',
  },
  {
    id: 'product_launch_q1',
    name: 'Product Launch Q1',
    type: 'Launch',
    channels: ['Twitter', 'Email', 'Publication'],
    metrics: {
      twitter: { conversions: 234, conversionRate: 5.8, spend: 3200, revenue: 14200 },
      email: { conversions: 428, conversionRate: 11.2, spend: 1500, revenue: 18900 },
      publication: { conversions: 145, conversionRate: 3.4, spend: 2100, revenue: 7800 },
    },
    totalConversions: 807,
    totalRevenue: 40900,
    totalSpend: 6800,
    roas: 6.01,
    trend: '+31%',
    status: 'Active',
  },
  {
    id: 'black_friday_2024',
    name: 'Black Friday Campaign',
    type: 'Promotion',
    channels: ['Twitter', 'Email', 'Publication'],
    metrics: {
      twitter: { conversions: 423, conversionRate: 6.1, spend: 4200, revenue: 22100 },
      email: { conversions: 612, conversionRate: 13.5, spend: 2200, revenue: 31500 },
      publication: { conversions: 267, conversionRate: 4.8, spend: 3100, revenue: 14200 },
    },
    totalConversions: 1302,
    totalRevenue: 67800,
    totalSpend: 9500,
    roas: 7.14,
    trend: '+42%',
    status: 'Completed',
  },
  {
    id: 'holiday_flash_sale',
    name: 'Holiday Flash Sale',
    type: 'Promotion',
    channels: ['Twitter', 'Email', 'Publication'],
    metrics: {
      twitter: { conversions: 198, conversionRate: 4.9, spend: 2800, revenue: 11200 },
      email: { conversions: 356, conversionRate: 9.8, spend: 1100, revenue: 16800 },
      publication: { conversions: 124, conversionRate: 2.8, spend: 1500, revenue: 6200 },
    },
    totalConversions: 678,
    totalRevenue: 34200,
    totalSpend: 5400,
    roas: 6.33,
    trend: '+18%',
    status: 'Active',
  },
  {
    id: 'new_feature_announcement',
    name: 'New Feature Release',
    type: 'Launch',
    channels: ['Twitter', 'Email', 'Publication'],
    metrics: {
      twitter: { conversions: 289, conversionRate: 5.2, spend: 3100, revenue: 13400 },
      email: { conversions: 512, conversionRate: 10.6, spend: 1800, revenue: 22100 },
      publication: { conversions: 178, conversionRate: 3.9, spend: 1900, revenue: 8700 },
    },
    totalConversions: 979,
    totalRevenue: 44200,
    totalSpend: 6800,
    roas: 6.50,
    trend: '+28%',
    status: 'Active',
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-xs bg-white shadow-md">
      <div className="font-semibold text-gray-900 mb-2">{payload[0]?.payload?.name}</div>
      <div className="text-gray-600">ROAS: <span className="font-mono text-gray-900">{payload[0]?.payload?.roas}x</span></div>
    </div>
  );
};

interface CampaignPerformanceClickableProps {
  onCampaignClick?: (campaignId: string) => void;
}

export default function CampaignPerformanceClickable({ onCampaignClick }: CampaignPerformanceClickableProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const handleCampaignClick = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    onCampaignClick?.(campaignId);
  };

  const selectedCampaign = selectedCampaignId
    ? growthCampaigns.find(c => c.id === selectedCampaignId)
    : null;

  if (selectedCampaign) {
    return (
      <CampaignChannelDrilldownView
        campaign={selectedCampaign}
        onBack={() => setSelectedCampaignId(null)}
      />
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
          Growth Campaigns
        </h2>
        <p className="text-sm text-gray-500 ml-2">Promotions, launches, and special campaigns</p>
      </div>

      {/* ROAS Chart */}
      <div className="rounded-lg border border-gray-200 p-5 bg-white">
        <div className="flex items-center gap-2.5 mb-5">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
            ROAS by Campaign
          </span>
          <span className="text-[10px] text-gray-500 ml-auto">Return on Ad Spend across all channels</span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={growthCampaigns} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              angle={-30}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 9 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="roas" name="ROAS" radius={[4, 4, 0, 0]}>
              {growthCampaigns.map((_, i) => (
                <Cell key={i} fill={`oklch(${0.55 + i * 0.03} 0.22 ${250 + i * 12})`} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-200">
          <Target className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
            Campaign Performance by Channel
          </span>
          <span className="text-[10px] text-gray-500 ml-auto">Click any row to view channel breakdown (Twitter, Email, Publication)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['Campaign', 'Type', 'Channels', 'Conversions', 'Revenue', 'Spend', 'ROAS', 'Trend', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider first:px-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {growthCampaigns.map((campaign, i) => (
                <tr
                  key={i}
                  onClick={() => handleCampaignClick(campaign.id)}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5">
                    <div>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{campaign.name}</span>
                      <p className="text-xs text-gray-500 mt-0.5">ID: {campaign.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge className={`text-[10px] px-2 py-0.5 h-5 ${
                      campaign.type === 'Promotion' 
                        ? 'bg-orange-50 text-orange-700 border-orange-200' 
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {campaign.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      {campaign.channels.map(ch => (
                        <Badge key={ch} className="text-[9px] px-1.5 py-0.5 h-4 bg-blue-50 text-blue-700 border-blue-200">
                          {ch}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-semibold text-gray-900">{campaign.totalConversions.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-mono text-green-600 font-semibold">${(campaign.totalRevenue / 1000).toFixed(1)}K</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono text-gray-700">${(campaign.totalSpend / 1000).toFixed(1)}K</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${Math.min((campaign.roas / 8) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-700 w-8">{campaign.roas.toFixed(2)}x</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono text-green-600 font-semibold">{campaign.trend}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel Performance Legend */}
      <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
        <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Channel Performance Breakdown</p>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <p className="font-semibold text-gray-900 mb-1">Twitter</p>
            <p className="text-gray-600">Social media reach and engagement for growth campaigns</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Email</p>
            <p className="text-gray-600">Direct outreach to subscribers with highest conversion rates</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Publication</p>
            <p className="text-gray-600">Blog posts, articles, and press releases for brand awareness</p>
          </div>
        </div>
      </div>
    </div>
  );
}
