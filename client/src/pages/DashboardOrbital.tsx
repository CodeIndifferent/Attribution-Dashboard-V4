/*
 * ORBITAL DASHBOARD PAGE
 * Real-time identity resolution and multi-channel attribution
 */
import DashboardLayout from '@/components/DashboardLayout';
import OrbitalDashboard from './OrbitalDashboard';

export default function DashboardOrbitalPage() {
  return (
    <DashboardLayout title="Orbital Command Center" subtitle="Real-time identity resolution and multi-channel attribution">
      <OrbitalDashboard />
    </DashboardLayout>
  );
}
