/*
 * DASHBOARD NAVIGATION MENU
 * Provides access to all dashboard views
 */
import { useLocation } from 'wouter';
import { BarChart3, Users, TrendingUp, Globe, Home, Zap, Fingerprint, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  description: string;
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    path: '/',
    icon: Home,
    description: 'Dashboard overview',
  },
  {
    label: 'Campaigns',
    path: '/campaigns',
    icon: BarChart3,
    description: 'Campaign performance & ROI',
  },
  {
    label: 'Users & Sessions',
    path: '/users',
    icon: Users,
    description: 'User engagement metrics',
  },
  {
    label: 'Attribution',
    path: '/attribution',
    icon: TrendingUp,
    description: 'Multi-touch attribution models',
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: Globe,
    description: 'Traffic & geographic data',
  },
  {
    label: 'Fingerprints',
    path: '/fingerprints',
    icon: Fingerprint,
    description: 'User identity resolution',
  },
  {
    label: 'Journeys',
    path: '/journeys',
    icon: Map,
    description: 'User journey tracking',
  },
  {
    label: 'Orbital',
    path: '/orbital',
    icon: Zap,
    description: 'Real-time identity graph',
  },
];

export default function DashboardNav() {
  const [location, navigate] = useLocation();

  return (
    <nav className="w-64 border-r border-gray-200 bg-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900">Identity Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">Multi-channel analytics</p>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all text-left group',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className={cn(
                  'w-4 h-4 mt-0.5 shrink-0',
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                )} />
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    'text-sm font-medium',
                    isActive ? 'text-blue-600' : 'text-gray-900'
                  )}>
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="text-xs text-gray-500">
          <p className="font-medium text-gray-700 mb-1">Dashboard Stats</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Campaigns</span>
              <span className="font-semibold text-gray-900">24</span>
            </div>
            <div className="flex justify-between">
              <span>Users</span>
              <span className="font-semibold text-gray-900">284.7K</span>
            </div>
            <div className="flex justify-between">
              <span>Revenue</span>
              <span className="font-semibold text-gray-900">$487K</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
