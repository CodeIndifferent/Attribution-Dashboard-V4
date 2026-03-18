/*
 * OVERVIEW PANEL - Dark orbital theme with glassmorphic design
 */
import CampaignROI from "./CampaignROI";
import CampaignPerformance from "./CampaignPerformance";
import CrossChannelJourney from "./CrossChannelJourney";
import { BarChart3 } from "lucide-react";

export default function OverviewPanelLight() {
  return (
    <div className="space-y-5">
      {/* Hero banner */}
      <div className="relative rounded-lg overflow-hidden border border-blue-500/20 bg-gradient-to-r from-slate-900/40 via-blue-900/20 to-slate-900/40 backdrop-blur-md p-6">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Campaign ROI Tracking</span>
          </div>
          <h2 className="text-2xl font-extrabold text-blue-100 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            User Acquisition Performance
          </h2>
          <p className="text-sm text-blue-300/80 mt-1 max-w-lg">
            Track campaign performance across all channels. Identify which campaigns drive real conversions and measure true ROI with cross-device user fingerprinting.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <CampaignROI />

      {/* Campaign Performance */}
      <CampaignPerformance />

      {/* Cross-Channel Journey */}
      <CrossChannelJourney />
    </div>
  );
}
