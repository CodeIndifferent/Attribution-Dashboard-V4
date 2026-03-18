/*
 * User drill-down table with expandable rows showing devices, sessions, and transactions
 */
import { useState } from "react";
import { ChevronDown, ChevronRight, Smartphone, Clock, DollarSign, MapPin, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User, Device, SessionRecord, Transaction } from "@/lib/userData";

interface UserDrilldownTableProps {
  users: User[];
}

function DeviceRow({ device }: { device: Device }) {
  return (
    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-gray-200 mb-2">
      <Smartphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-900">{device.type}</div>
        <div className="text-[10px] text-gray-600 mt-1 space-y-0.5">
          <div><span className="font-medium">OS:</span> {device.os} {device.osVersion}</div>
          <div><span className="font-medium">Browser:</span> {device.browser} {device.browserVersion}</div>
          <div><span className="font-medium">Resolution:</span> {device.screenResolution}</div>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>Sessions: {device.sessionCount}</span>
          </div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-xs text-gray-600 font-mono">{device.firstSeen}</div>
        <div className="text-[10px] text-gray-500">First seen</div>
      </div>
    </div>
  );
}

function SessionRow({ session }: { session: SessionRecord }) {
  return (
    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-gray-200 mb-2">
      <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-900">{session.timestamp}</span>
          <Badge className={cn(
            "text-[9px] px-1.5 py-0 h-4 border",
            session.status === 'completed'
              ? "bg-green-50 text-green-700 border-green-200"
              : session.status === 'abandoned'
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
          )}>
            {session.status}
          </Badge>
        </div>
        <div className="text-[10px] text-gray-600 space-y-0.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span>{session.location.city}, {session.location.country}</span>
          </div>
          <div><span className="font-medium">Campaign:</span> {session.campaignSource}</div>
          <div><span className="font-medium">Duration:</span> {Math.round(session.duration / 60)}m {session.duration % 60}s</div>
          <div><span className="font-medium">Events:</span> {session.events} | <span className="font-medium">Pages:</span> {session.pageViews}</div>
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  return (
    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white border border-gray-200 mb-2">
      <DollarSign className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-900">{transaction.timestamp}</span>
          <Badge className={cn(
            "text-[9px] px-1.5 py-0 h-4 border",
            transaction.status === 'completed'
              ? "bg-green-50 text-green-700 border-green-200"
              : transaction.status === 'pending'
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-red-50 text-red-700 border-red-200"
          )}>
            {transaction.status}
          </Badge>
        </div>
        <div className="text-[10px] text-gray-600 space-y-0.5">
          <div className="font-semibold text-green-600">${transaction.amount.toFixed(2)} {transaction.currency}</div>
          <div><span className="font-medium">Product:</span> {transaction.product}</div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span>{transaction.location.city}, {transaction.location.country}</span>
          </div>
          <div><span className="font-medium">Campaign:</span> {transaction.campaignSource}</div>
        </div>
      </div>
    </div>
  );
}

function UserRow({ user, isExpanded, onToggle }: { user: User; isExpanded: boolean; onToggle: () => void }) {
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
              <div className="text-sm font-mono font-bold text-gray-900">{user.userId}</div>
              <div className="text-[10px] text-gray-500">{user.name}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-700">{user.primaryLocation.city}</span>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <span className="text-xs font-mono text-gray-700">{user.totalSessions}</span>
        </td>
        <td className="px-4 py-3.5">
          <span className="text-xs font-mono text-gray-700">{user.devices.length}</span>
        </td>
        <td className="px-4 py-3.5">
          <span className="text-xs font-mono text-gray-700">{user.totalTransactions}</span>
        </td>
        <td className="px-4 py-3.5">
          <span className="text-xs font-mono text-green-600 font-semibold">${user.totalSpent.toFixed(2)}</span>
        </td>
        <td className="px-4 py-3.5">
          <Badge className="text-[10px] px-2 py-0.5 h-5 bg-blue-50 text-blue-700 border-blue-200">
            {user.acquisitionCampaign}
          </Badge>
        </td>
        <td className="px-4 py-3.5">
          <span className="text-xs font-mono text-gray-700">{user.firstSeen}</span>
        </td>
      </tr>

      {isExpanded && (
        <tr className="border-b border-gray-100 bg-blue-50">
          <td colSpan={8} className="px-5 py-5">
            <div className="space-y-5">
              {/* Devices */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  Devices ({user.devices.length})
                </h4>
                <div className="space-y-2">
                  {user.devices.map(device => (
                    <DeviceRow key={device.deviceId} device={device} />
                  ))}
                </div>
              </div>

              {/* Sessions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Session History ({user.sessions.length})
                </h4>
                <div className="space-y-2">
                  {user.sessions.map(session => (
                    <SessionRow key={session.sessionId} session={session} />
                  ))}
                </div>
              </div>

              {/* Transactions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Transaction History ({user.transactions.length})
                </h4>
                <div className="space-y-2">
                  {user.transactions.map(transaction => (
                    <TransactionRow key={transaction.transactionId} transaction={transaction} />
                  ))}
                </div>
              </div>

              {/* User Journey Summary */}
              <div className="p-3 rounded-lg bg-white border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">User Journey Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                  <div>
                    <span className="text-gray-600">Acquisition</span>
                    <div className="font-mono text-gray-900">{user.acquisitionCampaign}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Lifetime Value</span>
                    <div className="font-mono text-green-600 font-semibold">${user.lifetimeValue.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Conversion Rate</span>
                    <div className="font-mono text-gray-900">{user.conversionRate.toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Account Age</span>
                    <div className="font-mono text-gray-900">{Math.round((new Date('2024-03-16').getTime() - new Date(user.firstSeen).getTime()) / (1000 * 60 * 60 * 24))} days</div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function UserDrilldownTable({ users }: UserDrilldownTableProps) {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
          Users & Sessions
        </span>
        <Badge className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200">
          {users.length} users
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {['User ID', 'Location', 'Sessions', 'Devices', 'Transactions', 'Total Spent', 'Acquisition', 'First Seen'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider first:px-5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <UserRow
                key={user.userId}
                user={user}
                isExpanded={expandedUserId === user.userId}
                onToggle={() => setExpandedUserId(expandedUserId === user.userId ? null : user.userId)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
