/*
 * Enhanced User Journeys page - Vibrant dark orbital theme
 * Full profile drill-down including Web2/Web3 integration
 */
import { useState } from "react";
import { usersData } from "@/lib/userData";
import { getWeb3Profile } from "@/lib/web3Data";
import IdentityGraphInteractive from "@/components/IdentityGraphInteractive";
import Web2Web3Profile from "@/components/Web2Web3Profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Network, User as UserIcon, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserJourneysDetailProps {
  onBack: () => void;
}

export default function UserJourneysDetail({ onBack }: UserJourneysDetailProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("graph");

  const selectedUser = selectedUserId ? usersData.find(u => u.userId === selectedUserId) : null;
  const selectedWeb3 = selectedUserId ? getWeb3Profile(selectedUserId) : null;

  if (selectedUser && selectedWeb3) {
    return (
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => setSelectedUserId(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blue-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to User List
        </button>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-lg border border-cyan-500/30 bg-slate-900/40 p-1 backdrop-blur-md">
            <TabsTrigger
              value="graph"
              className="rounded-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border data-[state=active]:border-cyan-500/50 data-[state=active]:shadow-lg text-blue-300/60 hover:text-blue-300 transition-all"
            >
              <Network className="w-4 h-4 mr-2" />
              Conversion Paths
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="rounded-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border data-[state=active]:border-cyan-500/50 data-[state=active]:shadow-lg text-blue-300/60 hover:text-blue-300 transition-all"
            >
              <UserIcon className="w-4 h-4 mr-2" />
              Full Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="graph" className="mt-6">
            <IdentityGraphInteractive />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Web2Web3Profile user={selectedUser} web3Profile={selectedWeb3} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-blue-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </button>

      {/* Hero banner */}
      <div className="relative rounded-lg overflow-hidden border border-cyan-500/30 bg-gradient-to-r from-slate-900/60 via-blue-900/20 to-slate-900/60 backdrop-blur-md p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Network className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">User Journey Analysis</span>
          </div>
          <h2 className="text-3xl font-black text-cyan-300 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            User Journeys & Profiles
          </h2>
          <p className="text-sm text-blue-300/80 mt-2 max-w-lg">
            Select a user to view their complete journey from acquisition through conversion, including Web2 activity and Web3 wallet integration with DeFi positions.
          </p>
        </div>
      </div>

      {/* User List */}
      <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
        <div className="px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-cyan-300" style={{ fontFamily: 'Syne, sans-serif' }}>
            Select a User
          </span>
        </div>
        <div className="divide-y divide-cyan-500/10">
          {usersData.map(user => {
            const web3Profile = getWeb3Profile(user.userId);
            return (
              <div
                key={user.userId}
                onClick={() => setSelectedUserId(user.userId)}
                className="p-5 hover:bg-cyan-500/10 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-cyan-500 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono font-bold text-cyan-300 group-hover:text-cyan-200">{user.userId}</span>
                      <span className="text-sm text-blue-300/80">{user.name}</span>
                    </div>
                    <div className="text-xs text-blue-300/60 font-mono mb-3">{user.email}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="text-[9px] px-2.5 py-1 h-5 bg-slate-800/50 text-blue-300 border-slate-700/50 font-semibold">
                        {user.primaryLocation.city}
                      </Badge>
                      <Badge className="text-[9px] px-2.5 py-1 h-5 bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-semibold">
                        {user.totalSessions} sessions
                      </Badge>
                      <Badge className="text-[9px] px-2.5 py-1 h-5 bg-green-500/20 text-green-400 border-green-500/30 font-semibold">
                        ${user.totalSpent.toFixed(2)}
                      </Badge>
                      {web3Profile && (
                        <Badge className="text-[9px] px-2.5 py-1 h-5 bg-purple-500/20 text-purple-400 border-purple-500/30 font-semibold">
                          💰 ${web3Profile.totalWeb3Value.toFixed(0)} Web3
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-sm font-bold text-cyan-300 group-hover:text-cyan-200">{user.acquisitionCampaign}</div>
                    <div className="text-xs text-blue-300/60 mt-2 font-semibold">{user.totalTransactions} purchases</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
