/*
 * Orbital Command Center Dashboard
 * 6 navigation panels: Overview, Identity Graph, User Profiles, User Journeys, Attribution, Geography
 */
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrbitalIdentityGraph from "@/components/OrbitalIdentityGraphInteractive";
import OrbitalKPICards from "@/components/OrbitalKPICards";
import OrbitalEventFeed from "@/components/OrbitalEventFeed";
import OrbitalAttributionPanel from "@/components/OrbitalAttributionPanel";
import OrbitalGeographyPanel from "@/components/OrbitalGeographyPanel";
import UsersSessionsPanel from "@/components/UsersSessionsPanel";
import UserJourneysDetail from "@/pages/UserJourneysDetail";
import JourneyCommandCenter from "@/components/JourneyCommandCenter";
import { Network, BarChart3, Users, Map, TrendingUp, Globe } from "lucide-react";

export default function OrbitalDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUserJourneys, setShowUserJourneys] = useState(false);

  if (showUserJourneys) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setShowUserJourneys(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blue-300 hover:text-blue-100 hover:bg-blue-900/30 transition-all"
        >
          ← Back to Dashboard
        </button>
        <UserJourneysDetail onBack={() => setShowUserJourneys(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hero Banner */}
      <div className="relative rounded-lg overflow-hidden border border-blue-900/30 bg-gradient-to-r from-slate-900 via-blue-900/20 to-slate-900 p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-6 h-6 text-blue-400" />
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">🛰️ Orbital Command Center</span>
          </div>
          <h1 className="text-4xl font-extrabold text-blue-100 leading-tight mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Identity Resolution Platform
          </h1>
          <p className="text-sm text-blue-300/80 max-w-2xl">
            Real-time identity resolution, multi-channel attribution, and unified user journey tracking across Web2 and Web3.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 rounded-lg border border-blue-900/30 bg-slate-900/50 p-1">
          <TabsTrigger
            value="overview"
            className="rounded-md data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-100 data-[state=active]:shadow-lg text-blue-300 hover:text-blue-100"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="graph"
            className="rounded-md data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-100 data-[state=active]:shadow-lg text-blue-300 hover:text-blue-100"
          >
            <Network className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Graph</span>
          </TabsTrigger>
          <TabsTrigger
            value="profiles"
            className="rounded-md data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-100 data-[state=active]:shadow-lg text-blue-300 hover:text-blue-100"
          >
            <Users className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Profiles</span>
          </TabsTrigger>
          <TabsTrigger
            value="journeys"
            className="rounded-md data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-100 data-[state=active]:shadow-lg text-blue-300 hover:text-blue-100"
          >
            <Map className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Journeys</span>
          </TabsTrigger>
          <TabsTrigger
            value="attribution"
            className="rounded-md data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-100 data-[state=active]:shadow-lg text-blue-300 hover:text-blue-100"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Attribution</span>
          </TabsTrigger>
          <TabsTrigger
            value="geography"
            className="rounded-md data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-100 data-[state=active]:shadow-lg text-blue-300 hover:text-blue-100"
          >
            <Globe className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Geography</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Panel */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <OrbitalKPICards />
          <OrbitalEventFeed />
        </TabsContent>

        {/* Identity Graph Panel - Interactive with campaign drill-down */}
        <TabsContent value="graph" className="mt-4">
          <OrbitalIdentityGraph />
        </TabsContent>

        {/* User Profiles Panel */}
        <TabsContent value="profiles" className="mt-4">
          <UsersSessionsPanel />
        </TabsContent>

        {/* User Journeys Panel */}
        <TabsContent value="journeys" className="mt-4 space-y-5">
          <JourneyCommandCenter />

          {/* Link to detailed user profiles */}
          <button
            onClick={() => setShowUserJourneys(true)}
            className="w-full p-4 rounded-lg border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-blue-900/10 hover:border-blue-400/50 transition-all text-left group"
          >
            <div className="text-sm font-semibold text-blue-200 mb-1 group-hover:text-blue-100 transition-colors">View Individual User Profiles →</div>
            <p className="text-xs text-blue-300/70">Explore complete user profiles with Web2/Web3 integration, wallet addresses, and DeFi activity</p>
          </button>
        </TabsContent>

        {/* Attribution Panel */}
        <TabsContent value="attribution" className="mt-4">
          <OrbitalAttributionPanel />
        </TabsContent>

        {/* Geography Panel */}
        <TabsContent value="geography" className="mt-4">
          <OrbitalGeographyPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
