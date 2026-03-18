/*
 * FINGERPRINTS DASHBOARD PAGE
 * Displays user fingerprints and device tracking
 */
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import UserFingerprintsDetail from './UserFingerprintsDetail';

export default function DashboardFingerprints() {
  const [, navigate] = useLocation();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <DashboardLayout title="User Fingerprints" subtitle="Device info, IP addresses, OS, and browser tracking">
      <UserFingerprintsDetail onBack={handleBack} />
    </DashboardLayout>
  );
}
