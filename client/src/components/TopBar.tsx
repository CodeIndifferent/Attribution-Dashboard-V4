/*
 * TOP BAR - Dark orbital theme with glassmorphic design
 */
import { useState } from "react";
import { Search, Calendar, RefreshCw, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const dateRanges = ['Last 24h', 'Last 7d', 'Last 30d', 'Last 90d', 'Custom'];

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const [selectedRange, setSelectedRange] = useState('Last 30d');
  const [showRanges, setShowRanges] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-blue-900/20 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur-md shrink-0">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-blue-100 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-blue-300/70 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400/60" />
          <Input
            placeholder="Search campaigns..."
            className="pl-9 pr-4 h-8 w-52 text-xs bg-blue-900/20 border-blue-500/20 text-blue-100 placeholder:text-blue-400/40 focus:border-blue-500/40 focus:bg-blue-900/30"
          />
        </div>

        {/* Date range */}
        <div className="relative">
          <button
            onClick={() => setShowRanges(!showRanges)}
            className="flex items-center gap-2 h-8 px-3 rounded-lg text-xs text-blue-300 border border-blue-500/20 bg-blue-900/20 hover:bg-blue-900/30 hover:border-blue-500/40 transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{selectedRange}</span>
            <ChevronDown className={cn("w-3 h-3 transition-transform", showRanges && "rotate-180")} />
          </button>
          {showRanges && (
            <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-blue-500/20 overflow-hidden z-50 bg-slate-900/95 backdrop-blur-md shadow-xl">
              {dateRanges.map(range => (
                <button
                  key={range}
                  onClick={() => { setSelectedRange(range); setShowRanges(false); }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs transition-colors",
                    range === selectedRange
                      ? "text-blue-300 bg-blue-900/30 border-l-2 border-blue-500"
                      : "text-blue-300/70 hover:text-blue-200 hover:bg-blue-900/20"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-blue-500/20 bg-blue-900/20 hover:bg-blue-900/30 text-blue-400 hover:text-blue-300 transition-all"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
        </button>

        {/* Export */}
        <Button
          size="sm"
          className="h-8 px-3 text-xs gap-1.5 bg-blue-600/80 hover:bg-blue-600 text-blue-100 border border-blue-500/30"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>

        {/* Live badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] text-cyan-300 font-mono font-medium">LIVE</span>
        </div>
      </div>
    </header>
  );
}
