/*
 * USER WEB3 ACTIVITY PAGE - Vibrant dark orbital theme
 * Displays Web3 wallet, DeFi positions, and blockchain activity
 */
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Wallet, TrendingUp, DollarSign, Zap, Copy, ExternalLink, AlertCircle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserWeb3ActivityProps {
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

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-cyan-500/50 p-3 text-xs bg-slate-950/95 backdrop-blur-sm shadow-xl">
      <div className="font-semibold text-cyan-300 mb-2">{payload[0]?.payload?.date || payload[0]?.payload?.name}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="text-blue-300">
          {entry.name}: <span className="font-mono text-cyan-400 font-bold">${entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function UserWeb3Activity({ user }: UserWeb3ActivityProps) {
  // Generate sample Web3 data
  const wallets = [
    {
      address: '0x742d35Cc6634C0532925a3b844Bc7e7595f2e7e7',
      chain: 'Ethereum',
      balance: 2.45,
      usdValue: 5420.75,
      transactions: 247,
      verified: true,
    },
    {
      address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
      chain: 'Polygon',
      balance: 1250.5,
      usdValue: 1850.25,
      transactions: 89,
      verified: true,
    },
  ];

  const defiPositions = [
    {
      platform: 'Aave',
      protocol: 'Lending',
      totalValue: 3200,
      apy: 5.2,
      riskLevel: 'low',
      startedAt: '2025-12-15',
      assets: ['USDC', 'USDT'],
    },
    {
      platform: 'Uniswap V3',
      protocol: 'DEX',
      totalValue: 2150,
      apy: 8.5,
      riskLevel: 'medium',
      startedAt: '2026-01-20',
      assets: ['ETH/USDC', 'DAI/USDC'],
    },
    {
      platform: 'Curve Finance',
      protocol: 'Stablecoin DEX',
      totalValue: 1800,
      apy: 6.3,
      riskLevel: 'low',
      startedAt: '2026-02-10',
      assets: ['3Crv', 'crvUSD'],
    },
  ];

  const portfolioHistory = [
    { date: '2026-03-10', value: 8200, ethPrice: 2100 },
    { date: '2026-03-11', value: 8450, ethPrice: 2150 },
    { date: '2026-03-12', value: 8900, ethPrice: 2200 },
    { date: '2026-03-13', value: 8650, ethPrice: 2180 },
    { date: '2026-03-14', value: 9200, ethPrice: 2250 },
    { date: '2026-03-15', value: 9450, ethPrice: 2280 },
    { date: '2026-03-16', value: 9870, ethPrice: 2320 },
  ];

  const tokenHoldings = [
    { symbol: 'ETH', name: 'Ethereum', balance: 2.45, value: 5687.5, percentage: 28 },
    { symbol: 'USDC', name: 'USD Coin', balance: 2500, value: 2500, percentage: 12 },
    { symbol: 'DAI', name: 'Dai Stablecoin', balance: 1800, value: 1800, percentage: 9 },
    { symbol: 'MATIC', name: 'Polygon', balance: 5000, value: 3750, percentage: 18 },
    { symbol: 'AAVE', name: 'Aave', balance: 12.5, value: 2812.5, percentage: 14 },
    { symbol: 'UNI', name: 'Uniswap', balance: 45.2, value: 2260, percentage: 11 },
  ];

  const transactionHistory = [
    { date: '2026-03-16', type: 'Swap', from: 'USDC', to: 'ETH', amount: 1000, value: 0.43, status: 'Success' },
    { date: '2026-03-15', type: 'Deposit', asset: 'USDC', amount: 2500, value: 2500, status: 'Success' },
    { date: '2026-03-14', type: 'Withdraw', asset: 'ETH', amount: 0.5, value: 1160, status: 'Success' },
    { date: '2026-03-13', type: 'Stake', asset: 'MATIC', amount: 1000, value: 750, status: 'Success' },
    { date: '2026-03-12', type: 'Swap', from: 'DAI', to: 'USDC', amount: 500, value: 500, status: 'Success' },
  ];

  const totalPortfolioValue = 20271.5;
  const portfolioChange = 1250.75;
  const portfolioChangePercent = 6.58;

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="rounded-lg border border-purple-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-purple-900/20 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-purple-300">{user.name}</h2>
                  <p className="text-sm text-purple-300/70">Web3 Portfolio</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-green-400">${totalPortfolioValue.toLocaleString()}</div>
              <div className={`text-xs font-bold mt-1 ${portfolioChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)} ({portfolioChangePercent.toFixed(2)}%)
              </div>
            </div>
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="text-[10px] text-purple-300/60 uppercase mb-1 font-bold">Wallets</div>
              <div className="text-sm font-mono text-purple-300">{wallets.length}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="text-[10px] text-purple-300/60 uppercase mb-1 font-bold">DeFi Positions</div>
              <div className="text-sm font-mono text-purple-300">{defiPositions.length}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="text-[10px] text-purple-300/60 uppercase mb-1 font-bold">Total Transactions</div>
              <div className="text-sm font-mono text-purple-300">425</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="text-[10px] text-purple-300/60 uppercase mb-1 font-bold">Risk Level</div>
              <div className="text-sm font-mono text-orange-400">Moderate</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <div className="text-[10px] text-purple-300/60 uppercase mb-1 font-bold">Experience</div>
              <div className="text-sm font-mono text-green-400">Advanced</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-purple-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-purple-400/70 uppercase">Portfolio Value</p>
          </div>
          <p className="text-2xl font-black text-purple-300">${totalPortfolioValue.toLocaleString()}</p>
          <p className="text-xs text-purple-300/60 mt-2">All chains</p>
        </div>

        <div className="rounded-lg border border-green-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-green-400/70 uppercase">30-Day Yield</p>
          </div>
          <p className="text-2xl font-black text-green-400">$487.50</p>
          <p className="text-xs text-green-300/60 mt-2">DeFi earnings</p>
        </div>

        <div className="rounded-lg border border-cyan-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-cyan-400/70 uppercase">Avg APY</p>
          </div>
          <p className="text-2xl font-black text-cyan-300">6.67%</p>
          <p className="text-xs text-cyan-300/60 mt-2">Across positions</p>
        </div>

        <div className="rounded-lg border border-orange-500/30 p-5 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-bold text-orange-400/70 uppercase">Unique Tokens</p>
          </div>
          <p className="text-2xl font-black text-orange-400">{tokenHoldings.length}</p>
          <p className="text-xs text-orange-300/60 mt-2">Holdings</p>
        </div>
      </div>

      {/* Portfolio Value Chart */}
      <div className="rounded-lg border border-purple-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-purple-300">Portfolio Value Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolioHistory} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="rgba(168, 85, 247, 0.15)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(148, 163, 184, 0.8)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={3} dot={false} animationDuration={800} name="Portfolio Value" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Wallets */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-purple-300 px-6">Connected Wallets</h3>
        {wallets.map((wallet, idx) => (
          <div key={idx} className="rounded-lg border border-cyan-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-bold text-cyan-300">{wallet.chain}</h4>
                  {wallet.verified && (
                    <Badge className="text-[9px] px-2 py-0.5 h-4 bg-green-500/20 text-green-400 border-green-500/30 font-bold">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-[10px] font-mono text-blue-300/70 bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
                    {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                  </code>
                  <button className="p-1 hover:bg-cyan-500/20 rounded transition-all">
                    <Copy className="w-3 h-3 text-cyan-400/60 hover:text-cyan-400" />
                  </button>
                  <a href="#" className="p-1 hover:bg-cyan-500/20 rounded transition-all">
                    <ExternalLink className="w-3 h-3 text-cyan-400/60 hover:text-cyan-400" />
                  </a>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-cyan-400">${wallet.usdValue.toLocaleString()}</div>
                <div className="text-xs text-cyan-300/60 font-semibold">{wallet.balance} {wallet.chain === 'Ethereum' ? 'ETH' : 'MATIC'}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-cyan-500/15">
              <div>
                <div className="text-[10px] text-cyan-300/60 font-semibold">Transactions</div>
                <div className="text-sm font-mono text-cyan-300">{wallet.transactions}</div>
              </div>
              <div>
                <div className="text-[10px] text-cyan-300/60 font-semibold">First Tx</div>
                <div className="text-sm font-mono text-cyan-300">2025-11-20</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DeFi Positions */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-green-300 px-6">Active DeFi Positions</h3>
        {defiPositions.map((position, idx) => (
          <div key={idx} className="rounded-lg border border-green-500/30 p-6 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-green-500 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-bold text-green-300">{position.platform}</h4>
                    <Badge className={`text-[9px] px-2 py-0.5 h-4 font-bold ${
                      position.riskLevel === 'low'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {position.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <p className="text-xs text-green-300/60">{position.protocol}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-green-400">${position.totalValue.toLocaleString()}</div>
                  <div className="text-xs text-green-400 font-bold">{position.apy.toFixed(2)}% APY</div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-green-500/15">
                <span className="text-[10px] text-green-300/60 font-semibold">Assets:</span>
                {position.assets.map((asset, i) => (
                  <Badge key={i} className="text-[9px] px-2 py-0.5 h-4 bg-slate-800/50 text-green-400 border-slate-700/50 font-bold">
                    {asset}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Token Holdings */}
      <div className="rounded-lg border border-cyan-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-cyan-300">Token Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-500/15 bg-gradient-to-r from-blue-900/20 to-cyan-900/10">
                <th className="text-left py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Token</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Balance</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">Value</th>
                <th className="text-right py-4 px-6 font-bold text-cyan-300 uppercase tracking-wider">% Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {tokenHoldings.map((token, idx) => (
                <tr key={idx} className="border-b border-cyan-500/10 hover:bg-cyan-500/10 transition-all">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-cyan-300">{token.symbol}</div>
                      <div className="text-xs text-cyan-300/60">{token.name}</div>
                    </div>
                  </td>
                  <td className="text-right py-4 px-6 text-cyan-300 font-mono">{token.balance.toLocaleString()}</td>
                  <td className="text-right py-4 px-6 font-bold text-green-400">${token.value.toLocaleString()}</td>
                  <td className="text-right py-4 px-6 text-blue-300/80">{token.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-lg border border-orange-500/30 overflow-hidden bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-orange-500/20 bg-gradient-to-r from-slate-900/80 to-slate-900/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-orange-300">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-orange-500/15 bg-gradient-to-r from-orange-900/20 to-red-900/10">
                <th className="text-left py-4 px-6 font-bold text-orange-300 uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-6 font-bold text-orange-300 uppercase tracking-wider">Type</th>
                <th className="text-left py-4 px-6 font-bold text-orange-300 uppercase tracking-wider">Details</th>
                <th className="text-right py-4 px-6 font-bold text-orange-300 uppercase tracking-wider">Value</th>
                <th className="text-center py-4 px-6 font-bold text-orange-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map((tx, idx) => (
                <tr key={idx} className="border-b border-orange-500/10 hover:bg-orange-500/10 transition-all">
                  <td className="py-4 px-6 text-orange-300/80 text-xs">{tx.date}</td>
                  <td className="py-4 px-6">
                    <Badge className="text-[9px] px-2 py-0.5 h-4 bg-slate-800/50 text-orange-400 border-slate-700/50 font-bold">
                      {tx.type}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-orange-300/80 text-xs">
                    {tx.type === 'Swap' ? `${tx.from} → ${tx.to}` : `${tx.asset}`}
                  </td>
                  <td className="text-right py-4 px-6 font-bold text-green-400">${tx.value.toLocaleString()}</td>
                  <td className="text-center py-4 px-6">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
