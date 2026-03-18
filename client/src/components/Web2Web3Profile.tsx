/*
 * Web2/Web3 integrated user profile - Vibrant dark orbital theme
 * Showing location, performance, fingerprints, and crypto assets
 */
import { useState } from "react";
import { Globe, Wallet, TrendingUp, DollarSign, Zap, AlertCircle, Copy, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/userData";
import { Web3Profile, Wallet as Web3Wallet } from "@/lib/web3Data";
import { cn } from "@/lib/utils";

interface Web2Web3ProfileProps {
  user: User;
  web3Profile: Web3Profile;
}

export default function Web2Web3Profile({ user, web3Profile }: Web2Web3ProfileProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const riskColors = {
    conservative: 'bg-green-500/20 text-green-400 border-green-500/30',
    moderate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    aggressive: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const experienceColors = {
    beginner: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    intermediate: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    advanced: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <div className="space-y-6">
      {/* Web2 Profile Header */}
      <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-black text-cyan-300" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {user.name}
                </h2>
                <Badge className="text-[10px] px-2.5 py-1 h-5 bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-bold">
                  {user.userId}
                </Badge>
              </div>
              <div className="text-sm text-blue-300/70 font-mono">{user.email}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-green-400" style={{ fontFamily: 'Syne, sans-serif' }}>
                ${user.totalSpent.toFixed(2)}
              </div>
              <div className="text-xs text-blue-300/60 mt-1 font-semibold">Total Spent (Web2)</div>
            </div>
          </div>

          {/* Web2 Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all">
              <div className="text-[10px] text-blue-300/60 uppercase tracking-wider mb-1 font-bold">Location</div>
              <div className="text-sm font-mono text-cyan-300">{user.primaryLocation.city}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all">
              <div className="text-[10px] text-blue-300/60 uppercase tracking-wider mb-1 font-bold">Sessions</div>
              <div className="text-sm font-mono text-cyan-300">{user.totalSessions}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all">
              <div className="text-[10px] text-blue-300/60 uppercase tracking-wider mb-1 font-bold">Transactions</div>
              <div className="text-sm font-mono text-cyan-300">{user.totalTransactions}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all">
              <div className="text-[10px] text-blue-300/60 uppercase tracking-wider mb-1 font-bold">Acquisition</div>
              <div className="text-sm font-mono text-cyan-300">{user.acquisitionCampaign}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all">
              <div className="text-[10px] text-blue-300/60 uppercase tracking-wider mb-1 font-bold">Account Age</div>
              <div className="text-sm font-mono text-cyan-300">
                {Math.round((new Date('2024-03-16').getTime() - new Date(user.firstSeen).getTime()) / (1000 * 60 * 60 * 24))} days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Web3 Portfolio Overview */}
      <div className="rounded-lg border border-purple-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-purple-900/20 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold text-purple-300" style={{ fontFamily: 'Syne, sans-serif' }}>
                Web3 Portfolio
              </h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-purple-400" style={{ fontFamily: 'Syne, sans-serif' }}>
                ${web3Profile.totalWeb3Value.toFixed(2)}
              </div>
              <div className="text-xs text-purple-300/60 font-semibold">Total Assets</div>
            </div>
          </div>

          {/* Risk & Experience */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={cn("p-3 rounded-lg border", riskColors[web3Profile.riskProfile])}>
              <div className="text-[10px] uppercase tracking-wider mb-1 font-bold">Risk Profile</div>
              <div className="text-sm font-bold capitalize">{web3Profile.riskProfile}</div>
            </div>
            <div className={cn("p-3 rounded-lg border", experienceColors[web3Profile.defiExperience])}>
              <div className="text-[10px] uppercase tracking-wider mb-1 font-bold">DeFi Experience</div>
              <div className="text-sm font-bold capitalize">{web3Profile.defiExperience}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="text-[10px] text-blue-300/60 uppercase tracking-wider mb-1 font-bold">Favorite Chain</div>
              <div className="text-sm font-bold text-cyan-300">{web3Profile.favoriteChain}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="text-[10px] text-blue-300/60 uppercase tracking-wider mb-1 font-bold">Wallets</div>
              <div className="text-sm font-bold text-cyan-300">{web3Profile.wallets.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallets & Assets */}
      <div className="space-y-4">
        {web3Profile.wallets.map((wallet, idx) => (
          <div key={wallet.walletAddress} className="rounded-lg border border-green-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-1/4 w-48 h-48 bg-green-500 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-bold text-green-300">{wallet.label}</h4>
                    <Badge className="text-[9px] px-2 py-0.5 h-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-bold">
                      {wallet.chain}
                    </Badge>
                    {wallet.verified && (
                      <Badge className="text-[9px] px-2 py-0.5 h-4 bg-green-500/20 text-green-400 border-green-500/30 font-bold">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] font-mono text-blue-300/70 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
                      {wallet.walletAddress.slice(0, 10)}...{wallet.walletAddress.slice(-8)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(wallet.walletAddress)}
                      className="p-1 hover:bg-green-500/20 rounded transition-all"
                      title="Copy address"
                    >
                      <Copy className="w-3 h-3 text-green-400/60 hover:text-green-400" />
                    </button>
                    <a
                      href={`https://etherscan.io/address/${wallet.walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-green-500/20 rounded transition-all"
                      title="View on Etherscan"
                    >
                      <ExternalLink className="w-3 h-3 text-green-400/60 hover:text-green-400" />
                    </a>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-green-400" style={{ fontFamily: 'Syne, sans-serif' }}>
                    ${wallet.totalAssetValue.toFixed(2)}
                  </div>
                  <div className="text-xs text-green-300/60 font-semibold">Total Value</div>
                </div>
              </div>

              {/* Wallet Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5 pb-5 border-b border-green-500/15">
                <div>
                  <div className="text-[10px] text-green-300/60 mb-1 font-semibold">Transactions</div>
                  <div className="text-sm font-mono text-green-400">{wallet.totalTransactions}</div>
                </div>
                <div>
                  <div className="text-[10px] text-green-300/60 mb-1 font-semibold">Volume</div>
                  <div className="text-sm font-mono text-green-400">${(wallet.totalVolume / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <div className="text-[10px] text-green-300/60 mb-1 font-semibold">First Tx</div>
                  <div className="text-sm font-mono text-green-400">{wallet.firstTransaction}</div>
                </div>
                <div>
                  <div className="text-[10px] text-green-300/60 mb-1 font-semibold">Last Tx</div>
                  <div className="text-sm font-mono text-green-400">{wallet.lastTransaction}</div>
                </div>
              </div>

              {/* Tokens */}
              <div className="mb-5">
                <h5 className="text-xs font-bold text-green-300 uppercase tracking-wider mb-3">Holdings</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {wallet.tokens.map(token => (
                    <div key={token.symbol} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-mono font-bold text-green-400">{token.symbol}</div>
                          <div className="text-[10px] text-blue-300/60">{token.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-green-400">${token.value.toFixed(2)}</div>
                          <div className="text-[10px] text-blue-300/60">{token.balance.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DeFi Positions */}
              {wallet.defiPositions.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-orange-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    DeFi Positions
                  </h5>
                  <div className="space-y-3">
                    {wallet.defiPositions.map((position, i) => (
                      <div key={i} className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:border-orange-500/50 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-xs font-bold text-orange-400">{position.platform}</div>
                            <div className="text-[10px] text-orange-300/60">{position.protocol}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-orange-400">${position.totalValue.toFixed(2)}</div>
                            {position.apy && (
                              <div className="text-[10px] text-green-400 font-bold">{position.apy.toFixed(2)}% APY</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn(
                            "text-[9px] px-2 py-0.5 h-4 border font-bold",
                            position.riskLevel === 'low'
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : position.riskLevel === 'medium'
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                          )}>
                            {position.riskLevel.toUpperCase()} RISK
                          </Badge>
                          <span className="text-[10px] text-blue-300/60">Since {position.startedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Web2/Web3 Integration Summary */}
      <div className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-cyan-300" style={{ fontFamily: 'Syne, sans-serif' }}>
              Unified Identity Summary
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/50 transition-all">
              <div className="text-[10px] text-cyan-300/60 uppercase tracking-wider mb-2 font-bold">Web2 LTV</div>
              <div className="text-lg font-black text-cyan-400">${user.lifetimeValue.toFixed(2)}</div>
              <div className="text-[10px] text-cyan-300/60 mt-1 font-semibold">{user.totalTransactions} purchases</div>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/50 transition-all">
              <div className="text-[10px] text-purple-300/60 uppercase tracking-wider mb-2 font-bold">Web3 Assets</div>
              <div className="text-lg font-black text-purple-400">${web3Profile.totalWeb3Value.toFixed(2)}</div>
              <div className="text-[10px] text-purple-300/60 mt-1 font-semibold">{web3Profile.wallets.length} wallets</div>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 hover:border-green-500/50 transition-all">
              <div className="text-[10px] text-green-300/60 uppercase tracking-wider mb-2 font-bold">Total Value</div>
              <div className="text-lg font-black text-green-400">${(user.lifetimeValue + web3Profile.totalWeb3Value).toFixed(2)}</div>
              <div className="text-[10px] text-green-300/60 mt-1 font-semibold">Web2 + Web3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
