/*
 * Orbital Identity Intelligence Command Center - Showcase Landing Page
 * Hero section, feature highlights, interactive demo, and call-to-action
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Network, Zap, Globe, TrendingUp, Shield, Gauge, 
  ChevronRight, Star, Users, BarChart3, MapPin, Cpu
} from "lucide-react";

export default function Showcase() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-400" />
            <span className="text-lg font-extrabold text-cyan-50" style={{ fontFamily: 'Syne, sans-serif' }}>
              Orbital
            </span>
          </div>
          <Button
            onClick={() => setLocation('/orbital')}
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-lg"
          >
            Launch Dashboard →
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-cyan-500/30 mb-6">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-cyan-300">Real-time Identity Resolution</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-200 to-emerald-300 mb-6 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              Unify Your User Identity
            </h1>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              The Orbital Identity Intelligence Command Center maps fragmented digital activity into persistent user identities. Track users across sessions, devices, and channels to unlock true ROI for every acquisition campaign.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => setLocation('/orbital')}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-slate-950 font-bold px-8 py-3 rounded-lg text-lg"
              >
                Explore Dashboard <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/20 px-8 py-3 rounded-lg text-lg"
              >
                View Documentation
              </Button>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16">
            {[
              { label: 'Identities Resolved', value: '284K+', icon: Users },
              { label: 'Resolution Rate', value: '84.9%', icon: Gauge },
              { label: 'Global Coverage', value: '8 Regions', icon: Globe },
              { label: 'Avg Confidence', value: '94.2%', icon: Shield },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="glass-card p-6 rounded-xl glow-blue">
                  <Icon className="w-5 h-5 text-cyan-400 mb-3" />
                  <div className="text-3xl font-extrabold text-cyan-300 font-mono mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-cyan-50 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Powerful Identity Resolution
            </h2>
            <p className="text-lg text-slate-400">Everything you need to understand and track your users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Network,
                title: 'Interactive Identity Graph',
                description: 'Physics-based visualization showing multi-touch attribution paths and cross-channel journeys with real-time particle effects.',
                color: 'glow-blue',
              },
              {
                icon: BarChart3,
                title: 'Campaign Attribution',
                description: 'Track ROAS, conversion rates, and revenue by channel. Understand which campaigns truly drive conversions.',
                color: 'glow-amber',
              },
              {
                icon: Globe,
                title: 'Geographic Intelligence',
                description: 'Interactive world map showing user distribution, revenue per location, and conversion hotspots globally.',
                color: 'glow-emerald',
              },
              {
                icon: Cpu,
                title: 'Device Fingerprinting',
                description: 'Collect and correlate device info, IP addresses, OS, browser, and unique fingerprints to resolve identities.',
                color: 'glow-blue',
              },
              {
                icon: TrendingUp,
                title: 'Live KPI Dashboard',
                description: 'Real-time count-up animations showing 284K identities, 84.9% resolution rate, and 30-day trends.',
                color: 'glow-emerald',
              },
              {
                icon: Users,
                title: 'User Journey Tracking',
                description: 'Follow complete user paths from first touchpoint to conversion. See drop-offs and optimize funnel.',
                color: 'glow-amber',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className={`glass-card p-6 rounded-xl ${feature.color} group hover:scale-105 transition-transform`}>
                  <Icon className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-bold text-cyan-100 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-cyan-50 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Real-World Use Cases
            </h2>
            <p className="text-lg text-slate-400">See how companies leverage Orbital for identity resolution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'E-commerce Conversion Tracking',
                description: 'A fashion retailer runs a Twitter campaign. Users click the ad, leave, then return organically. Orbital identifies these are the same person and attributes the conversion to Twitter, showing true ROI.',
                metrics: ['85% accurate attribution', '3.2x ROAS improvement', '42% higher LTV'],
              },
              {
                title: 'SaaS Customer Acquisition',
                description: 'Track which marketing channels drive trial signups, feature adoption, and paid conversions. Understand the complete journey from awareness to revenue.',
                metrics: ['94.2% resolution rate', '8 touchpoints tracked', '67% cross-device match'],
              },
              {
                title: 'Multi-Channel Attribution',
                description: 'Resolve identities across email, Google Ads, Meta, Twitter, and direct visits. See which channels work best together in conversion paths.',
                metrics: ['284K identities resolved', '5 channels integrated', '30-day trend analysis'],
              },
              {
                title: 'Fraud Detection & Prevention',
                description: 'Identify suspicious patterns when the same device/IP appears with multiple identities. Flag high-risk accounts before conversion.',
                metrics: ['Real-time detection', '99.1% confidence', 'Device + IP matching'],
              },
            ].map((useCase, idx) => (
              <div key={idx} className="glass-card p-8 rounded-xl glow-blue">
                <h3 className="text-xl font-bold text-cyan-100 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {useCase.title}
                </h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {useCase.description}
                </p>
                <div className="space-y-2">
                  {useCase.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                      <Star className="w-4 h-4 text-amber-400" />
                      {metric}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-5xl font-extrabold text-cyan-50 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
            Ready to Unify Your User Identity?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Launch the Orbital Identity Intelligence Command Center and start tracking true ROI across all your acquisition channels.
          </p>
          <Button
            onClick={() => setLocation('/orbital')}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-slate-950 font-bold px-10 py-4 rounded-lg text-lg"
          >
            Launch Dashboard Now <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/30 py-12 px-6 bg-slate-950/50">
        <div className="max-w-6xl mx-auto text-center text-slate-400 text-sm">
          <p>© 2026 Orbital Identity Intelligence. All rights reserved.</p>
          <p className="mt-2">Unifying digital identity across Web2 and Web3.</p>
        </div>
      </footer>
    </div>
  );
}
