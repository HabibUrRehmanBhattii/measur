'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalMeasurements: number;
  pendingMeasurements: number;
  completedMeasurements: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    totalMeasurements: 0,
    pendingMeasurements: 0,
    completedMeasurements: 0,
  });

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Total Measurements
        </h3>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          {stats.totalMeasurements}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Pending
        </h3>
        <p className="mt-2 text-3xl font-bold text-yellow-500">
          {stats.pendingMeasurements}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Completed
        </h3>
        <p className="mt-2 text-3xl font-bold text-green-500">
          {stats.completedMeasurements}
        </p>
      </div>
    </div>
  );
}