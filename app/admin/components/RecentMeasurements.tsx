'use client';

import { useEffect, useState } from 'react';

interface Measurement {
  id: string;
  customerName: string;
  type: string;
  status: string;
  date: string;
}

export default function RecentMeasurements() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.recentMeasurements) {
          setMeasurements(data.recentMeasurements);
        }
      })
      .catch(error => console.error('Error fetching measurements:', error));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Recent Measurements
        </h3>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {measurements.map((measurement, index) => (
              <li key={index} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {measurement.customerName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {measurement.type}
                    </p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      measurement.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {measurement.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}