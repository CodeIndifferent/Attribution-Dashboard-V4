/*
 * JOURNEYS DASHBOARD PAGE
 * Displays user journey tracking and cross-channel paths
 */
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import UserJourneysDetail from './UserJourneysDetail';

export default function DashboardJourneys() {
  const [, navigate] = useLocation();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <DashboardLayout title="User Journeys" subtitle="Cross-channel paths from campaign click to conversion">
      <UserJourneysDetail onBack={handleBack} />
    </DashboardLayout>
  );
}
