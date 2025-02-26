"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);
  
  // Handle mounting
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  if (!isMounted) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          
          {/* Dialog */}
          <motion.div
            className="relative bg-surface border border-border rounded-2xl shadow-lg max-w-md w-full overflow-hidden"
            style={{ background: 'var(--surface)' }}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Dialog header */}
            <div className="relative flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center bg-warning/10 text-warning p-2 rounded-full mr-3">
                  <AlertTriangle size={18} />
                </span>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <button 
                onClick={onCancel}
                className="text-foreground-secondary hover:text-foreground transition-colors rounded-full p-1"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Dialog content */}
            <div className="p-5">
              <p className="text-foreground-secondary">{message}</p>
            </div>
            
            {/* Dialog actions */}
            <div className="flex justify-end gap-3 p-5 pt-0">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-border hover:bg-surface-secondary transition-colors font-medium text-sm"
              >
                {cancelText}
              </button>
              
              <motion.button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors font-medium text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {confirmText}
              </motion.button>
            </div>
            
            {/* Bottom glow */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}