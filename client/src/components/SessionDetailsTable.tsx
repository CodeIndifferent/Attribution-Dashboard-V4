/*
 * Session details table with expandable user journey and fingerprint info
 */
import { useState } from "react";
import { ChevronDown, ChevronRight, MapPin, Smartphone, Globe, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserSession } from "@/lib/campaignDrilldownData";

interface SessionDetailsTableProps {
  sessions: UserSession[];
}

function SessionRow({ session, isExpanded, onToggle }: { session: UserSession; isExpanded: boolean; onToggle: () => void }) {
  const statusColor = session.status === 'converted' ? 'text-green-600' : session.status === 'abandoned' ? 'text-amber-600' : 'text-blue-600';
  const statusBg = session.status === 'converted' ? 'bg-green-50' : session.status === 'abandoned' ? 'bg-amber-50' : 'bg-blue-50';

  return (
    <>
      <tr
        className={cn(
          "border-b border-gray-100 cursor-pointer transition-colors",
          isExpanded ? "bg-blue-50" : "hover:bg-gray-50"
        )}
        onClick={onToggle}
      >
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2">
            {isExpanded
              ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              : <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
            <div>
              <div className="text-sm font-medium text-gray-900">{session.userName}</div>
              <div className="text-[11px] text-gray-500 font-mono">{session.sessionId}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-700">{session.deviceType}</span>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <span className="text-xs text-gray-700">{session.os}</span>
        </td>
        <td className="px-4 py-3.5">
          <span className="text-xs text-gray-700">{session.browser}</span>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-600"
                style={{ width: `${session.fingerprint.confidence}%` }}
              />
            </div>
            <span className="text-xs font-mono text-gray-700 w-8">{session.fingerprint.confidence}%</span>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <span className="text-xs font-mono text-gray-700">{session.touchpoints.length}</span>
        </td>
        <td className="px-4 py-3.5">
          <Badge
            className={cn(
              "text-[10px] px-2 py-0.5 h-5 border",
              session.status === 'converted'
                ? "bg-green-50 text-green-700 border-green-200"
                : session.status === 'abandoned'
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
            )}
          >
            {session.status === 'converted' ? '✓ Converted' : session.status === 'abandoned' ? '✕ Abandoned' : '○ Active'}
          </Badge>
        </td>
        {session.status === 'converted' && (
          <td className="px-4 py-3.5">
            <span className="text-xs font-mono text-green-600 font-semibold">${session.conversionValue?.toFixed(2)}</span>
          </td>
        )}
      </tr>

      {isExpanded && (
        <tr className="border-b border-gray-100 bg-blue-50">
          <td colSpan={8} className="px-5 py-5">
            <div className="space-y-5">
              {/* Fingerprint info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 font-medium">IP Address</div>
                  <div className="text-sm font-mono text-gray-900">{session.ipAddress}</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 font-medium">User ID</div>
                  <div className="text-sm font-mono text-gray-900">{session.userId}</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 font-medium">Linked Devices</div>
                  <div className="text-sm font-mono text-gray-900">{session.fingerprint.linkedDevices}</div>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 font-medium">Linked Emails</div>
                  <div className="text-sm font-mono text-gray-900">{session.fingerprint.linkedEmails}</div>
                </div>
              </div>

              {/* User journey timeline */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">User Journey Timeline</h4>
                <div className="space-y-2">
                  {session.touchpoints.map((tp, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-gray-200">
                      <div className="flex flex-col items-center gap-1 pt-0.5">
                        {tp.event === 'Purchase' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : tp.event === 'Exit' ? (
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                        {i < session.touchpoints.length - 1 && (
                          <div className="w-0.5 h-6 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-gray-900">{tp.event}</span>
                          <Badge className="text-[9px] px-1.5 py-0 h-4 bg-gray-100 text-gray-700 border-gray-200">
                            {tp.channel}
                          </Badge>
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono mb-1">{tp.timestamp}</div>
                        {tp.pageUrl && (
                          <div className="text-[10px] text-gray-500 font-mono truncate flex items-center gap-1">
                            <Globe className="w-3 h-3 text-gray-400 shrink-0" />
                            {tp.pageUrl}
                          </div>
                        )}
                        {tp.duration > 0 && (
                          <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                            {Math.round(tp.duration / 60)}m {tp.duration % 60}s
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function SessionDetailsTable({ sessions }: SessionDetailsTableProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
          Session Details
        </span>
        <Badge className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200">
          {sessions.length} sessions
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {['User', 'Device', 'OS', 'Browser', 'Fingerprint', 'Touchpoints', 'Status', 'Revenue'].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                    i === 0 && "px-5",
                    h === 'Revenue' && "hidden md:table-cell"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <SessionRow
                key={session.sessionId}
                session={session}
                isExpanded={expandedSessionId === session.sessionId}
                onToggle={() => setExpandedSessionId(expandedSessionId === session.sessionId ? null : session.sessionId)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
