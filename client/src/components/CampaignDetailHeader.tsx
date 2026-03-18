/*
 * Campaign detail header showing overview metrics
 */
import { ArrowLeft, TrendingUp, Users, Target, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CampaignDrilldown } from "@/lib/campaignDrilldownData";

interface CampaignDetailHeaderProps {
  campaign: CampaignDrilldown;
  onBack: () => void;
}

export default function CampaignDetailHeader({ campaign, onBack }: CampaignDetailHeaderProps) {
  const channelColors: Record<string, string> = {
    'Twitter': '#1DA1F2',
    'Google': '#4285F4',
    'Meta': '#1877F2',
    'Email': '#10b981',
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Campaigns
      </button>

      {/* Header */}
      <div className="rounded-lg border border-gray-200 p-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                {campaign.campaignName}
              </h1>
              <Badge
                className="text-[10px] px-2 py-0.5 h-5 text-white border-0"
                style={{ backgroundColor: channelColors[campaign.channel] || '#6b7280' }}
              >
                {campaign.channel}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {campaign.dateRange.start} to {campaign.dateRange.end}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600" style={{ fontFamily: 'Syne, sans-serif' }}>
              {campaign.conversionRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600 mt-0.5">Conversion Rate</div>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Total Sessions</span>
            </div>
            <div className="text-lg font-bold text-gray-900">{campaign.totalSessions.toLocaleString()}</div>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Converted</span>
            </div>
            <div className="text-lg font-bold text-green-600">{campaign.convertedSessions.toLocaleString()}</div>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Abandoned</span>
            </div>
            <div className="text-lg font-bold text-amber-600">{campaign.abandonedSessions.toLocaleString()}</div>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Avg Duration</span>
            </div>
            <div className="text-lg font-bold text-purple-600">{Math.round(campaign.avgSessionDuration / 60)}m {campaign.avgSessionDuration % 60}s</div>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3.5 h-3.5 text-cyan-600" />
              <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">Avg Touchpoints</span>
            </div>
            <div className="text-lg font-bold text-cyan-600">{campaign.avgTouchpoints.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
