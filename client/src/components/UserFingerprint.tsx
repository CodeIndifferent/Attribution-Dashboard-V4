/*
 * REDESIGN: User fingerprint tracking showing device info, IP, OS, browser
 */
import { useState } from "react";
import { Fingerprint, ChevronDown, ChevronRight, Monitor, Globe, Database, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FingerprintData {
  id: string;
  userId: string;
  deviceType: string;
  os: string;
  browser: string;
  ipAddress: string;
  confidence: number;
  firstSeen: string;
  lastSeen: string;
  sessions: number;
  conversions: number;
}

const fingerprintData: FingerprintData[] = [
  {
    id: 'fp1',
    userId: 'user_2847',
    deviceType: 'MacBook Pro 16"',
    os: 'macOS 14.2',
    browser: 'Chrome 121.0',
    ipAddress: '203.45.128.92',
    confidence: 98,
    firstSeen: '2024-01-15',
    lastSeen: '2024-03-16',
    sessions: 47,
    conversions: 3,
  },
  {
    id: 'fp2',
    userId: 'user_2847',
    deviceType: 'iPhone 15 Pro',
    os: 'iOS 17.3',
    browser: 'Safari',
    ipAddress: '203.45.129.15',
    confidence: 94,
    firstSeen: '2024-02-01',
    lastSeen: '2024-03-16',
    sessions: 23,
    conversions: 1,
  },
  {
    id: 'fp3',
    userId: 'user_3124',
    deviceType: 'Dell XPS 15',
    os: 'Windows 11',
    browser: 'Firefox 123.0',
    ipAddress: '192.168.1.45',
    confidence: 87,
    firstSeen: '2024-01-20',
    lastSeen: '2024-03-14',
    sessions: 31,
    conversions: 2,
  },
  {
    id: 'fp4',
    userId: 'user_3124',
    deviceType: 'Samsung Galaxy S24',
    os: 'Android 14',
    browser: 'Chrome Mobile',
    ipAddress: '192.168.1.46',
    confidence: 91,
    firstSeen: '2024-02-10',
    lastSeen: '2024-03-15',
    sessions: 18,
    conversions: 1,
  },
];

function FingerprintRow({ fp }: { fp: FingerprintData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className={cn(
          "border-b border-gray-100 cursor-pointer transition-colors",
          expanded ? "bg-blue-50" : "hover:bg-gray-50"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2">
            {expanded
              ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              : <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
            <div>
              <div className="text-sm font-medium text-gray-900">{fp.deviceType}</div>
              <div className="text-[11px] text-gray-500 font-mono">{fp.ipAddress}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-xs text-gray-700">{fp.os}</span>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <span className="text-xs text-gray-700">{fp.browser}</span>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-600"
                style={{ width: `${fp.confidence}%` }}
              />
            </div>
            <span className="text-xs font-mono text-gray-700 w-8">{fp.confidence}%</span>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-700">{fp.sessions}</span>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <Badge className="text-[10px] px-2 py-0.5 h-5 bg-green-50 text-green-700 border-green-200">
            {fp.conversions} conv.
          </Badge>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-gray-100 bg-blue-50">
          <td colSpan={6} className="px-5 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">First Seen</div>
                <div className="text-sm font-mono text-gray-900">{fp.firstSeen}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Last Seen</div>
                <div className="text-sm font-mono text-gray-900">{fp.lastSeen}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">User ID</div>
                <div className="text-sm font-mono text-gray-900">{fp.userId}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Fingerprint ID</div>
                <div className="text-sm font-mono text-gray-900">{fp.id}</div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function UserFingerprint() {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-200">
        <Fingerprint className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
          User Fingerprints & Sessions
        </span>
        <Badge className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200">
          {fingerprintData.length} tracked
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {['Device & IP', 'Operating System', 'Browser', 'Confidence', 'Sessions', 'Conversions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider first:px-5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fingerprintData.map(fp => (
              <FingerprintRow key={fp.id} fp={fp} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
