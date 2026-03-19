/*
 * AI CHATBOT WIDGET
 * Floating icon on bottom-right that opens a chat panel.
 * Responds to natural-language queries about campaigns, links, users, and attribution.
 */
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, ChevronDown, RotateCcw, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockTrackableLinks } from '@/lib/trackableLinkData';
import { mockCampaignLinks } from '@/lib/campaignLinkData';
import { usersData } from '@/lib/userData';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  typing?: boolean;
}

// ─── Suggested prompts ────────────────────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  'Which campaign has the highest ROI?',
  'Show me top performing trackable links',
  'What is the overall conversion rate?',
  'Which channel drives the most revenue?',
  'How many active users do we have?',
  'What are the top user segments?',
  'Show me campaign spend vs revenue',
  'Which link has the best supercookie resolution?',
];

// ─── Data helpers ─────────────────────────────────────────────────────────────
function getTopCampaignByROI() {
  const all = mockCampaignLinks.flatMap(l => l.channels);
  const best = all.reduce((a, b) => (b.roi > a.roi ? b : a), all[0]);
  return best;
}

function getOverallStats() {
  const totalClicks   = mockTrackableLinks.reduce((s, l) => s + l.totalClicks, 0);
  const totalConv     = mockTrackableLinks.reduce((s, l) => s + l.totalConversions, 0);
  const totalRevenue  = mockTrackableLinks.reduce((s, l) => s + l.totalRevenue, 0);
  const totalSpend    = mockTrackableLinks.reduce((s, l) => s + l.campaigns.reduce((cs, c) => cs + c.spend, 0), 0);
  const avgROI        = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0';
  const cvr           = totalClicks > 0 ? ((totalConv / totalClicks) * 100).toFixed(1) : '0';
  return { totalClicks, totalConv, totalRevenue, totalSpend, avgROI, cvr };
}

function getTopLinks() {
  return [...mockTrackableLinks]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 3);
}

function getChannelBreakdown() {
  const map: Record<string, { revenue: number; conversions: number; spend: number }> = {};
  mockTrackableLinks.forEach(link => {
    link.channelMetrics.forEach(ch => {
      if (!map[ch.channel]) map[ch.channel] = { revenue: 0, conversions: 0, spend: 0 };
      map[ch.channel].revenue      += ch.revenue;
      map[ch.channel].conversions  += ch.conversions;
      // LinkChannelMetrics has no spend field; approximate from campaigns
      const chSpend = link.campaigns
        .filter(c => c.channel === ch.channel)
        .reduce((s, c) => s + c.spend, 0);
      map[ch.channel].spend += chSpend;
    });
  });
  return Object.entries(map)
    .map(([channel, d]) => ({ channel, ...d, roi: d.spend > 0 ? (d.revenue / d.spend).toFixed(2) : '0' }))
    .sort((a, b) => b.revenue - a.revenue);
}

function getActiveUsers() {
  return usersData.filter(u => u.lastSeen);
}

function getTopUsersByRevenue() {
  return [...usersData].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 3);
}

function getSupercookieStats() {
  const avg = mockTrackableLinks.reduce((s, l) => s + l.supercookieResolutionRate, 0) / mockTrackableLinks.length;
  const best = [...mockTrackableLinks].sort((a, b) => b.supercookieResolutionRate - a.supercookieResolutionRate)[0];
  return { avg: avg.toFixed(1), best };
}

// ─── Response engine ──────────────────────────────────────────────────────────
function generateResponse(input: string): string {
  const q = input.toLowerCase().trim();

  // ── ROI queries ──
  if (q.includes('roi') || q.includes('return on investment')) {
    const stats = getOverallStats();
    const topLinks = getTopLinks();
    const channels = getChannelBreakdown();
    const topCh = channels[0];
    return `**Platform ROI Summary**\n\nOverall platform ROI is **${stats.avgROI}x** across all active campaigns.\n\n**Top Links by ROI:**\n${topLinks.map((l, i) => {
      const spend = l.campaigns.reduce((s, c) => s + c.spend, 0);
      const roi = spend > 0 ? (l.totalRevenue / spend).toFixed(2) : 'N/A';
      return `${i + 1}. **${l.name}** (${l.shortCode}) — ${roi}x ROI · $${l.totalRevenue.toLocaleString()} revenue`;
    }).join('\n')}\n\n**Best Channel:** ${topCh.channel} at **${topCh.roi}x ROI** generating $${topCh.revenue.toLocaleString()} revenue from $${topCh.spend.toLocaleString()} spend.`;
  }

  // ── Trackable links ──
  if (q.includes('trackable link') || q.includes('link performance') || q.includes('top link') || q.includes('best link')) {
    const links = getTopLinks();
    return `**Top Trackable Links by Revenue**\n\n${links.map((l, i) => {
      const spend = l.campaigns.reduce((s, c) => s + c.spend, 0);
      const roi = spend > 0 ? (l.totalRevenue / spend).toFixed(2) : 'N/A';
      return `**${i + 1}. ${l.name}** (\`${l.shortCode}\`)\n   • Clicks: ${l.totalClicks.toLocaleString()} · Conversions: ${l.totalConversions.toLocaleString()}\n   • Revenue: $${l.totalRevenue.toLocaleString()} · ROI: ${roi}x\n   • Supercookie Resolution: ${l.supercookieResolutionRate}%\n   • Status: ${l.status}`;
    }).join('\n\n')}\n\nAll ${mockTrackableLinks.length} links are tracked with SDK integration and supercookie resolution enabled.`;
  }

  // ── Conversion rate ──
  if (q.includes('conversion rate') || q.includes('cvr') || q.includes('convert')) {
    const stats = getOverallStats();
    const channels = getChannelBreakdown();
    return `**Conversion Rate Analysis**\n\nOverall platform CVR: **${stats.cvr}%**\n\n• Total Clicks: ${stats.totalClicks.toLocaleString()}\n• Total Conversions: ${stats.totalConv.toLocaleString()}\n• Revenue per Conversion: $${(stats.totalRevenue / stats.totalConv).toFixed(2)}\n\n**CVR by Channel:**\n${channels.map(ch => {
      const cvr = ch.conversions > 0 ? ((ch.conversions / (ch.revenue / 50)) * 100).toFixed(1) : '—';
      return `• ${ch.channel}: ${ch.conversions.toLocaleString()} conversions · $${ch.revenue.toLocaleString()} revenue`;
    }).join('\n')}`;
  }

  // ── Channel / revenue ──
  if (q.includes('channel') || q.includes('revenue') || q.includes('spend') || q.includes('best channel')) {
    const channels = getChannelBreakdown();
    const stats = getOverallStats();
    return `**Channel Performance Breakdown**\n\nTotal Revenue: **$${stats.totalRevenue.toLocaleString()}** · Total Spend: **$${stats.totalSpend.toLocaleString()}**\n\n${channels.map((ch, i) => `${i + 1}. **${ch.channel}**\n   Revenue: $${ch.revenue.toLocaleString()} · Spend: $${ch.spend.toLocaleString()} · ROI: ${ch.roi}x · Conversions: ${ch.conversions.toLocaleString()}`).join('\n\n')}\n\n**Top Channel:** ${channels[0].channel} drives the most revenue at $${channels[0].revenue.toLocaleString()} with a ${channels[0].roi}x ROI.`;
  }

  // ── Users / active users ──
  if (q.includes('active user') || q.includes('how many user') || q.includes('user count') || q.includes('total user')) {
    const active = getActiveUsers();
    const topUsers = getTopUsersByRevenue();
    return `**User Overview**\n\n• Total Tracked Users: **${usersData.length}**\n• Active Users: **${active.length}** (${((active.length / usersData.length) * 100).toFixed(0)}%)\n• Total Sessions: ${usersData.reduce((s, u) => s + u.totalSessions, 0).toLocaleString()}\n• Avg CVR: ${(usersData.reduce((s, u) => s + u.conversionRate, 0) / usersData.length).toFixed(1)}%\n\n**Top Users by Revenue:**\n${topUsers.map((u, i) => `${i + 1}. **${u.name}** — $${u.totalSpent.toFixed(0)} · ${u.totalSessions} sessions · ${u.conversionRate}% CVR`).join('\n')}`;
  }

  // ── User segments ──
  if (q.includes('segment') || q.includes('top user') || q.includes('high value') || q.includes('best user')) {
    const topUsers = getTopUsersByRevenue();
    const avgSpend = usersData.reduce((s, u) => s + u.totalSpent, 0) / usersData.length;
    return `**User Segments**\n\nAvg Revenue per User: **$${avgSpend.toFixed(0)}**\n\n**High-Value Users (Top 3):**\n${topUsers.map((u, i) => {
      const city = u.primaryLocation.city;
      return `${i + 1}. **${u.name}** (${city})\n   Revenue: $${u.totalSpent.toFixed(0)} · Sessions: ${u.totalSessions} · Devices: ${u.devices.length} · CVR: ${u.conversionRate}%\n   Acquired via: ${u.acquisitionCampaign}`;
    }).join('\n\n')}\n\nUsers with 2+ devices show **60% higher ROI** due to cross-device supercookie resolution.`;
  }

  // ── Spend / budget ──
  if (q.includes('spend') || q.includes('budget') || q.includes('cost')) {
    const stats = getOverallStats();
    const links = mockTrackableLinks;
    return `**Campaign Spend Summary**\n\nTotal Platform Spend: **$${stats.totalSpend.toLocaleString()}**\nTotal Revenue Generated: **$${stats.totalRevenue.toLocaleString()}**\nOverall ROAS: **${stats.avgROI}x**\n\n**Spend by Link:**\n${links.map(l => {
      const spend = l.campaigns.reduce((s, c) => s + c.spend, 0);
      return `• **${l.name}**: $${spend.toLocaleString()} spend → $${l.totalRevenue.toLocaleString()} revenue`;
    }).join('\n')}\n\nFor every $1 spent, the platform generates **$${stats.avgROI}** in revenue.`;
  }

  // ── Supercookie / fingerprint ──
  if (q.includes('supercookie') || q.includes('fingerprint') || q.includes('resolution') || q.includes('identity')) {
    const sc = getSupercookieStats();
    return `**Supercookie & Identity Resolution**\n\nAvg Resolution Rate: **${sc.avg}%** across all links\n\n**Best Performing Link:**\n• ${sc.best.name} (\`${sc.best.shortCode}\`) — **${sc.best.supercookieResolutionRate}%** resolution rate\n\n**How it works:**\nWhen a user clicks a trackable link, the Lucia SDK fires and connects their browser cookie to the persistent supercookie. This enables:\n• Cross-device identity matching\n• Full journey attribution from first click to last conversion\n• True ROI measurement even when users switch devices\n\nUsers resolved via supercookie show **2.4x higher** conversion rates than unresolved sessions.`;
  }

  // ── Campaign summary ──
  if (q.includes('campaign') || q.includes('all campaign') || q.includes('campaign list') || q.includes('campaign performance')) {
    const allCampaigns = mockTrackableLinks.flatMap(l => l.campaigns.map(c => ({ ...c, linkName: l.name })));
    const active = allCampaigns.filter(c => c.status === 'Active');
    const totalSpend = allCampaigns.reduce((s, c) => s + c.spend, 0);
    const totalRev = allCampaigns.reduce((s, c) => s + c.revenue, 0);
    const top3 = [...allCampaigns].sort((a, b) => b.roi - a.roi).slice(0, 3);
    return `**Campaign Overview**\n\n• Total Campaigns: **${allCampaigns.length}** (${active.length} active)\n• Total Spend: **$${totalSpend.toLocaleString()}**\n• Total Revenue: **$${totalRev.toLocaleString()}**\n• Platform ROAS: **${(totalRev / totalSpend).toFixed(2)}x**\n\n**Top 3 Campaigns by ROI:**\n${top3.map((c, i) => `${i + 1}. **${c.campaignName}** (${c.linkName})\n   ROI: ${c.roi}x · Revenue: $${c.revenue.toLocaleString()} · Spend: $${c.spend.toLocaleString()} · Conv: ${c.conversions.toLocaleString()}`).join('\n\n')}`;
  }

  // ── Attribution ──
  if (q.includes('attribution') || q.includes('first touch') || q.includes('last touch') || q.includes('linear') || q.includes('time decay')) {
    return `**Attribution Model Insights**\n\nThe Lucia Attribution system supports 4 models:\n\n1. **First Touch** — 100% credit to the first interaction. Best for measuring awareness campaigns. Avg revenue/touch: $142\n\n2. **Last Touch** — 100% credit to the final conversion event. Best for measuring bottom-funnel campaigns. Avg revenue/touch: $198\n\n3. **Linear** — Equal credit across all touchpoints. Best for understanding the full journey. Avg touches: 3.2 per conversion\n\n4. **Time Decay** — More credit to recent touchpoints. Best for short sales cycles. 40% weight on last 24hrs\n\n**Recommendation:** For your current campaign mix, **Linear attribution** provides the most accurate ROI picture since users average 3.2 touchpoints before converting.\n\nSupercookie resolution enables cross-device attribution — users who switch devices are still correctly attributed.`;
  }

  // ── Journey ──
  if (q.includes('journey') || q.includes('path') || q.includes('funnel') || q.includes('drop')) {
    return `**User Journey & Funnel Analysis**\n\n**Platform Conversion Funnel:**\n• Link Click → Landing Page: **82%** retention\n• Landing → Product View: **64%** retention (18% drop-off)\n• Product View → Cart: **41%** retention (23% drop-off)\n• Cart → Checkout: **28%** retention (13% drop-off)\n• Checkout → Purchase: **11.2%** final CVR\n\n**Biggest Drop-off:** Product View → Cart (23%). Recommendation: Add social proof and urgency signals on product pages.\n\n**Top Conversion Path:**\nEmail → Landing → Product → Checkout → Purchase\n• 847 users · $312 avg revenue · 18.4% CVR\n\n**Cross-Device Journeys:** 34% of converting users switch devices at least once. Supercookie resolution ensures these are correctly attributed.`;
  }

  // ── Help / what can you do ──
  if (q.includes('help') || q.includes('what can you') || q.includes('what do you') || q.includes('capabilities')) {
    return `**Lucia AI — What I Can Help With**\n\nI have full access to your dashboard data and can answer questions about:\n\n📊 **Campaigns** — performance, spend, revenue, ROI, status\n🔗 **Trackable Links** — clicks, conversions, supercookie resolution\n👥 **Users** — segments, top users, session data, CVR\n📍 **Attribution** — model comparisons, first/last touch, linear\n🌍 **Channels** — Email, Social, Paid Ads, Organic, Influencer\n🔮 **Identity** — supercookie resolution, cross-device matching\n📈 **Funnels** — conversion paths, drop-off points, journey analysis\n\n**Try asking:**\n• "Which campaign has the best ROI?"\n• "Show me top performing links"\n• "What's our conversion rate by channel?"\n• "How many active users do we have?"\n• "Explain our attribution model"`;
  }

  // ── Greeting ──
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q === 'yo' || q === 'sup') {
    const stats = getOverallStats();
    return `**Hello! I'm Lucia AI** 👋\n\nYour attribution intelligence assistant. Here's a quick snapshot of your platform:\n\n• Total Revenue: **$${stats.totalRevenue.toLocaleString()}**\n• Conversions: **${stats.totalConv.toLocaleString()}** (${stats.cvr}% CVR)\n• Platform ROI: **${stats.avgROI}x**\n• Active Links: **${mockTrackableLinks.filter(l => l.status === 'Active').length}**\n\nWhat would you like to explore today? You can ask me about campaigns, users, attribution models, or conversion funnels.`;
  }

  // ── Default fallback ──
  const stats = getOverallStats();
  return `I can help you analyze your attribution data. Here's your current platform summary:\n\n• **Revenue:** $${stats.totalRevenue.toLocaleString()} · **Spend:** $${stats.totalSpend.toLocaleString()} · **ROI:** ${stats.avgROI}x\n• **Conversions:** ${stats.totalConv.toLocaleString()} · **CVR:** ${stats.cvr}%\n• **Active Links:** ${mockTrackableLinks.filter(l => l.status === 'Active').length} · **Users:** ${usersData.length}\n\nTry asking about campaigns, trackable links, users, attribution models, or conversion funnels. Type **"help"** to see everything I can do.`;
}

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
function renderText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold + inline code
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="text-cyan-200 font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={j} className="px-1 py-0.5 rounded text-[10px] bg-slate-700/60 text-amber-300 font-mono">{part.slice(1, -1)}</code>;
      }
      return <span key={j}>{part}</span>;
    });
    return (
      <span key={i}>
        {parts}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('flex gap-2.5 group', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
        isUser ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
      )}>
        {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
      </div>

      {/* Bubble */}
      <div className={cn(
        'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed relative',
        isUser
          ? 'bg-gradient-to-br from-blue-600/80 to-indigo-700/80 text-white rounded-tr-sm border border-blue-500/30'
          : 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-slate-200 rounded-tl-sm border border-cyan-500/20'
      )}>
        {msg.typing ? (
          <div className="flex items-center gap-1 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap">{renderText(msg.text)}</div>
            {!isUser && (
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-700/50"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
              </button>
            )}
          </>
        )}
        <div className={cn('text-[9px] mt-1 opacity-50', isUser ? 'text-right text-blue-200' : 'text-slate-500')}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Chatbot Component ───────────────────────────────────────────────────
export default function AIChatbot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: "Hi! I'm **Lucia AI**, your attribution intelligence assistant.\n\nI have full access to your campaign data, trackable links, user analytics, and attribution models. Ask me anything about your marketing performance.\n\nTry: *\"Which campaign has the highest ROI?\"* or *\"Show me top performing links\"*",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput]     = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [unread, setUnread]   = useState(0);
  const messagesEndRef         = useRef<HTMLDivElement>(null);
  const inputRef               = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setUnread(0);
    }
  }, [open]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    setShowSuggestions(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    const typingMsg: Message = {
      id: 'typing',
      role: 'assistant',
      text: '',
      timestamp: new Date(),
      typing: true,
    };

    setMessages(prev => [...prev, userMsg, typingMsg]);
    setInput('');

    // Simulate AI thinking delay (600–1200ms)
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const response = generateResponse(text);
      setMessages(prev => [
        ...prev.filter(m => m.id !== 'typing'),
        { id: Date.now().toString(), role: 'assistant', text: response, timestamp: new Date() },
      ]);
      setIsTyping(false);
      if (!open) setUnread(n => n + 1);
    }, delay);

    setIsTyping(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      text: "Conversation cleared. How can I help you analyze your attribution data?\n\nAsk me about campaigns, trackable links, users, attribution models, or conversion funnels.",
      timestamp: new Date(),
    }]);
    setShowSuggestions(true);
    setUnread(0);
  };

  return (
    <>
      {/* ── Chat Panel ── */}
      <div className={cn(
        'fixed bottom-20 right-5 z-50 w-[380px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30 transition-all duration-300 origin-bottom-right',
        open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none',
        'bg-gradient-to-b from-slate-900/98 to-slate-950/98 backdrop-blur-xl'
      )} style={{ height: '520px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/90 to-slate-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                Lucia AI
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-500">Attribution Intelligence</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              title="Clear conversation"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700/50">
          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Suggested prompts */}
          {showSuggestions && messages.length <= 1 && (
            <div className="space-y-2">
              <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Suggested questions</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.slice(0, 6).map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:bg-cyan-500/15 hover:text-cyan-300 hover:border-cyan-500/30 transition-all text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-cyan-500/20 bg-gradient-to-r from-slate-900/90 to-slate-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about campaigns, users, ROI…"
              disabled={isTyping}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:bg-slate-800/90 transition-all disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0',
                input.trim() && !isTyping
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800/60 text-slate-600 cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[9px] text-slate-700 mt-1.5 text-center">Lucia AI · Powered by Lucia Attribution Platform</p>
        </div>
      </div>

      {/* ── Floating Trigger Button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'fixed bottom-5 right-5 z-50 w-13 h-13 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 group',
          open
            ? 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/50 rotate-0'
            : 'bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-400/30 hover:scale-110 hover:shadow-cyan-500/30'
        )}
        style={{ width: '52px', height: '52px' }}
        title="Lucia AI Assistant"
      >
        {open ? (
          <X className="w-5 h-5 text-slate-300" />
        ) : (
          <MessageCircle className="w-5 h-5 text-white" />
        )}

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg">
            {unread}
          </span>
        )}

        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl border-2 border-cyan-400/40 animate-ping pointer-events-none" />
        )}
      </button>
    </>
  );
}
