"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface FailureAnimationProps {
  message?: string;
  onComplete?: () => void;
}

export default function FailureAnimation({ message, onComplete }: FailureAnimationProps = {}) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30 
          }}
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 blur-2xl rounded-full scale-[2]" style={{background: 'var(--error)', opacity: '0.2'}}></div>
          
          {/* Error circle with gradient */}
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-full shadow-lg flex items-center justify-center"
              style={{background: 'linear-gradient(135deg, #EF4444, #DC2626)'}}
            >
              {/* Pulse animation */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{background: 'var(--error)', opacity: 0.4}}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.2, 0.4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
              
              {/* Shake effect for the error icon */}
              <motion.div
                initial={{ rotate: -30, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  delay: 0.2
                }}
                // Add shake animation when visible
                whileInView={{
                  x: [0, -4, 4, -4, 4, 0],
                  transition: {
                    delay: 0.5,
                    duration: 0.5,
                    ease: "easeInOut"
                  }
                }}
              >
                <X size={36} strokeWidth={3} className="text-white" />
              </motion.div>
            </div>
          </div>
          
          {/* Error text */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 mt-8 text-center w-64"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="font-medium text-lg text-white">Error</div>
            <div className="text-sm text-white/80 mt-1">
              {message || "Something went wrong. Please try again."}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}