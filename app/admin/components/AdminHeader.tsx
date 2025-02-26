'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function AdminHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call logout API
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        // Redirect to login page
        router.push('/admin/login');
        router.refresh();
      } else {
        console.error('Logout failed');
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Measurement Admin
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="relative">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin
                </span>
              </div>
            </div>
            
            <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>
            
            <motion.button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-1.5 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoggingOut ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-500/30 border-t-gray-500 rounded-full animate-spin"></div>
                  <span>Logging out...</span>
                </div>
              ) : (
                <>
                  <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                  Logout
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}