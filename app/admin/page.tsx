import { Suspense } from 'react';
import StatsCards from '@/app/admin/components/StatsCards';
import RecentMeasurements from '@/app/admin/components/RecentMeasurements';
import AdminChart from '@/app/admin/components/AdminChart';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>
      
      <Suspense fallback={<div>Loading stats...</div>}>
        <StatsCards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<div>Loading chart...</div>}>
          <AdminChart />
        </Suspense>

        <Suspense fallback={<div>Loading recent measurements...</div>}>
          <RecentMeasurements />
        </Suspense>
      </div>
    </div>
  );
}



