/*
 * Campaign detail page showing session-level data and user journeys
 */
import { useMemo } from "react";
import { getCampaignDrilldown } from "@/lib/campaignDrilldownData";
import CampaignDetailHeader from "@/components/CampaignDetailHeader";
import SessionDetailsTable from "@/components/SessionDetailsTable";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { Users, TrendingUp, Target } from "lucide-react";

interface CampaignDetailProps {
  campaignId: string;
  onBack: () => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 p-2 text-xs bg-white shadow-md">
      <div className="font-semibold text-gray-900">{payload[0]?.payload?.name}</div>
      <div className="text-gray-600">Count: <span className="font-mono text-gray-900">{payload[0]?.value}</span></div>
    </div>
  );
};

export default function CampaignDetail({ campaignId, onBack }: CampaignDetailProps) {
  const campaign = getCampaignDrilldown(campaignId);

  const sessionStatusData = useMemo(() => {
    if (!campaign) return [];
    return [
      { name: 'Converted', value: campaign.convertedSessions, color: '#10b981' },
      { name: 'Abandoned', value: campaign.abandonedSessions, color: '#f59e0b' },
      { name: 'Active', value: campaign.activeSessions, color: '#3b82f6' },
    ];
  }, [campaign]);

  const touchpointDistribution = useMemo(() => {
    if (!campaign) return [];
    const distribution: Record<string, number> = {};
    campaign.sessions.forEach(session => {
      session.touchpoints.forEach(tp => {
        distribution[tp.event] = (distribution[tp.event] || 0) + 1;
      });
    });
    return Object.entries(distribution)
      .map(([event, count]) => ({ name: event, count }))
      .sort((a, b) => b.count - a.count);
  }, [campaign]);

  if (!campaign) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Campaign not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <CampaignDetailHeader campaign={campaign} onBack={onBack} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Session Status Pie Chart */}
        <div className="rounded-lg border border-gray-200 p-5 bg-white">
          <div className="flex items-center gap-2.5 mb-4">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
              Session Status
            </span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sessionStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name} ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sessionStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Touchpoint Distribution */}
        <div className="rounded-lg border border-gray-200 p-5 bg-white">
          <div className="flex items-center gap-2.5 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
              Touchpoint Distribution
            </span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={touchpointDistribution} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fill: 'rgba(0,0,0,0.5)', fontSize: 9 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Session Details Table */}
      <SessionDetailsTable sessions={campaign.sessions} />

      {/* Drop-off Analysis */}
      <div className="rounded-lg border border-gray-200 p-5 bg-white">
        <div className="flex items-center gap-2.5 mb-4">
          <Target className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
            Drop-off Analysis
          </span>
        </div>
        <div className="space-y-2">
          {campaign.abandonedSessions > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div>
                <div className="text-sm font-medium text-amber-900">
                  {campaign.abandonedSessions} sessions abandoned
                </div>
                <div className="text-xs text-amber-700 mt-0.5">
                  {((campaign.abandonedSessions / campaign.totalSessions) * 100).toFixed(1)}% of total traffic
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-amber-600">
                  {((campaign.abandonedSessions / campaign.totalSessions) * 100).toFixed(1)}%
                </div>
                <div className="text-[10px] text-amber-700">Drop-off Rate</div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
            <div>
              <div className="text-sm font-medium text-green-900">
                {campaign.convertedSessions} sessions converted
              </div>
              <div className="text-xs text-green-700 mt-0.5">
                Successfully completed the purchase journey
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                {campaign.conversionRate.toFixed(1)}%
              </div>
              <div className="text-[10px] text-green-700">Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
