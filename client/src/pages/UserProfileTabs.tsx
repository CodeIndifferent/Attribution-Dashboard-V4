/*
 * USER PROFILE TABS - Vibrant dark orbital theme
 * Tabbed interface for Overview, Web2 Activity, and Web3 Activity
 */
import { useState } from 'react';
import { Globe, Wallet, Eye } from 'lucide-react';
import UserOverview from './UserOverview';
import UserWeb2Activity from './UserWeb2Activity';
import UserWeb3Activity from './UserWeb3Activity';

interface UserProfileTabsProps {
  user: {
    name: string;
    email: string;
    location: string;
    device: string;
    sessions: number;
    conversions: number;
    revenue: number;
    status: string;
  };
}

type TabType = 'overview' | 'web2' | 'web3';

export default function UserProfileTabs({ user }: UserProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    {
      id: 'overview' as TabType,
      label: 'Overview',
      icon: Eye,
      color: 'cyan',
    },
    {
      id: 'web2' as TabType,
      label: 'Web2 Activity',
      icon: Globe,
      color: 'green',
    },
    {
      id: 'web3' as TabType,
      label: 'Web3 Activity',
      icon: Wallet,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-1 p-1 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const colorClasses = {
              cyan: isActive ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'text-cyan-300/60 hover:text-cyan-300 border-transparent',
              green: isActive ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'text-green-300/60 hover:text-green-300 border-transparent',
              purple: isActive ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'text-purple-300/60 hover:text-purple-300 border-transparent',
            };

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 font-semibold text-sm ${colorClasses[tab.color as keyof typeof colorClasses]}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === 'overview' && <UserOverview user={user} />}
        {activeTab === 'web2' && <UserWeb2Activity user={user} />}
        {activeTab === 'web3' && <UserWeb3Activity user={user} />}
      </div>
    </div>
  );
}
