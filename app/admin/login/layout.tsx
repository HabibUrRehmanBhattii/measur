// Special layout for login page that explicitly doesn't have auth check
// This bypasses the auth check in the parent admin layout

import { Suspense } from 'react';

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      {children}
    </Suspense>
  );
}