import { Suspense } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import AdminLoadingState from '@/app/admin/loading';
import { requireAuth } from '@/app/utils/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  await requireAuth();
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Suspense fallback={<AdminLoadingState />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
