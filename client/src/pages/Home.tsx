/*
 * IDENTITY RESOLUTION DASHBOARD - OVERVIEW
 * - Dark orbital theme with glassmorphic components
 * - Real-time ROI tracking across all acquisition channels
 */
import { useLocation, useRoute } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import OverviewPanelLight from "@/components/OverviewPanelLight";
import ConversionFlowchart from "@/components/ConversionFlowchart";
import CampaignDetail from "@/pages/CampaignDetail";

export default function Home() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/campaign/:campaignId");
  const campaignId = match ? params?.campaignId : null;

  const handleBackFromCampaign = () => {
    setLocation('/campaigns');
  };

  if (campaignId) {
    return (
      <DashboardLayout title="Campaign Details" subtitle="Session-level data and user journeys">
        <CampaignDetail campaignId={campaignId} onBack={handleBackFromCampaign} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Campaign Overview" 
      subtitle="Real-time ROI tracking across all acquisition channels"
    >
      <div className="space-y-6">
        <OverviewPanelLight />
        <ConversionFlowchart />
      </div>
    </DashboardLayout>
  );
}
