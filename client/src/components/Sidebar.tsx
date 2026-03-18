/*
 * ORBITAL THEME: Dark sidebar with blue accents and glassmorphic design
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BarChart3, Users, Route, Target, Fingerprint, TrendingUp,
  Settings, ChevronLeft, ChevronRight, Bell, Zap, Orbit, Globe, Link2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const navItems = [
  { id: 'overview', icon: BarChart3, label: 'Campaign Overview', path: '/', badge: null },
  { id: 'campaigns', icon: Target, label: 'Campaigns', path: '/campaigns', badge: '8' },
  { id: 'users', icon: Users, label: 'Users & Sessions', path: '/users', badge: null },
  { id: 'attribution', icon: TrendingUp, label: 'Attribution', path: '/attribution', badge: null },
  { id: 'analytics', icon: Globe, label: 'Analytics', path: '/analytics', badge: null },
  { id: 'journeys', icon: Route, label: 'User Journeys', path: '/journeys', badge: null },
  { id: 'links', icon: Link2, label: 'Trackable Links', path: '/links', badge: 'NEW' },
  { id: 'orbital', icon: Orbit, label: 'Orbital Command', path: '/orbital', badge: null },
];

const bottomItems = [
  { id: 'alerts', icon: Bell, label: 'Alerts', path: '/alerts', badge: '2' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings', badge: null },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [location, navigate] = useLocation();

  const handleNavigate = (path: string, label: string) => {
    if (path === '/alerts' || path === '/settings') {
      toast.info('Feature coming soon', {
        description: `${label} panel is under development.`,
      });
      return;
    }
    navigate(path);
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen transition-all duration-300 ease-in-out shrink-0",
        "border-r border-blue-900/30 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-blue-900/20",
        collapsed && "justify-center px-0"
      )}>
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' }}>
            <Orbit className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-slate-950 animate-pulse" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-blue-100" style={{ fontFamily: 'Syne, sans-serif' }}>
              Orbital
            </div>
            <div className="text-[10px] text-blue-400/70 font-mono">Identity Platform</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path, item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-blue-900/40 text-blue-100 border border-blue-500/30"
                  : "text-blue-300/70 hover:text-blue-200 hover:bg-blue-900/20"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-blue-500" />
              )}
              <Icon className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4", isActive ? "text-blue-400" : "text-blue-400/50 group-hover:text-blue-400")} />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium truncate text-blue-100">
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge className="ml-auto text-[10px] px-1.5 py-0 h-4 bg-blue-500/30 text-blue-200 border-blue-400/30">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-blue-900/20 pt-3">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path, item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-blue-900/40 text-blue-100 border border-blue-500/30"
                  : "text-blue-300/70 hover:text-blue-200 hover:bg-blue-900/20"
              )}
            >
              <Icon className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4", isActive ? "text-blue-400" : "text-blue-400/50 group-hover:text-blue-400")} />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium truncate text-blue-100">{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-auto text-[10px] px-1.5 py-0 h-4 bg-red-500/30 text-red-200 border-red-400/30">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-blue-500/30 bg-slate-900 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:border-blue-400/50 transition-all z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
