/*
 * User Fingerprints page with interactive identity graph showing conversion paths
 */
import { ArrowLeft } from "lucide-react";
import IdentityGraphInteractive from "@/components/IdentityGraphInteractive";

interface UserFingerprintsDetailProps {
  onBack: () => void;
}

export default function UserFingerprintsDetail({ onBack }: UserFingerprintsDetailProps) {
  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </button>

      {/* Hero banner */}
      <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-100 p-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-blue-600 uppercase tracking-widest">🔗 Identity Resolution</span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            User Fingerprints & Identity Graph
          </h2>
          <p className="text-sm text-gray-700 mt-1 max-w-lg">
            Visualize how fragmented digital activity is unified into persistent user identities. See conversion paths showing users who drop off after one channel and convert through another—all connected to the same person through device fingerprints, IP addresses, and behavioral signals.
          </p>
        </div>
      </div>

      {/* Identity Graph */}
      <IdentityGraphInteractive />
    </div>
  );
}
