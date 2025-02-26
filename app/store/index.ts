import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MeasurementType } from '../types';

// Define store types
interface MeasurementStore {
  // User preferences
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  
  // Recent measurements
  recentMeasurements: {
    id: string;
    date: string;
    type: MeasurementType;
    orderNumber: string;
    ebayUsername: string;
  }[];
  addRecentMeasurement: (measurement: {
    type: MeasurementType;
    orderNumber: string;
    ebayUsername: string;
  }) => void;
  clearRecentMeasurements: () => void;
  
  // UI state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Form data
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
  clearFormData: () => void;
  updateFormField: (key: string, value: any) => void;
}

// Create store with persistence
export const useStore = create<MeasurementStore>()(
  persist(
    (set) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // Recent measurements
      recentMeasurements: [],
      addRecentMeasurement: (measurement) => set((state) => ({
        recentMeasurements: [
          {
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString(),
            ...measurement
          },
          ...state.recentMeasurements.slice(0, 9) // Keep only the 10 most recent
        ]
      })),
      clearRecentMeasurements: () => set({ recentMeasurements: [] }),
      
      // UI state
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Form data
      formData: {},
      setFormData: (data) => set({ formData: data }),
      clearFormData: () => set({ formData: {} }),
      updateFormField: (key, value) => set((state) => ({
        formData: { ...state.formData, [key]: value }
      }))
    }),
    {
      name: 'measur-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);