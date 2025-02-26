"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface SuccessAnimationProps {
  message?: string;
  subMessage?: string;
  onComplete?: () => void;
  redirectText?: string;
  onRedirect?: () => void;
}

export default function SuccessAnimation({ 
  message = "Success!", 
  subMessage = "Your measurements have been submitted successfully.", 
  onComplete,
  redirectText = "Back to Home",
  onRedirect
}: SuccessAnimationProps) {
  
  // Auto-dismiss after 4 seconds if onComplete is provided
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (onComplete) {
      timer = setTimeout(() => {
        onComplete();
      }, 4000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative max-w-md w-full mx-4"
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 10 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30 
          }}
        >
          {/* Success Card */}
          <div className="glass border border-success/20 rounded-2xl overflow-hidden shadow-lg">
            {/* Top accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-primary via-success to-accent" />
            
            <div className="p-8">
              {/* Icon section */}
              <div className="flex justify-center mb-6">
                <motion.div
                  className="relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {/* Background glow */}
                  <div className="absolute inset-0 blur-xl rounded-full scale-150" 
                    style={{background: 'var(--success)', opacity: '0.2'}}
                  />
                  
                  {/* Icon with animated background */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <motion.div 
                      className="absolute inset-0 bg-success/30 rounded-full"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 0.3, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.3 }}
                    >
                      <CheckCircle size={36} className="text-white" strokeWidth={2.5} />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
              
              {/* Animated particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ 
                      x: `${Math.random() * 100}%`, 
                      y: `${Math.random() * 100}%`, 
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{ 
                      y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  >
                    <Sparkles 
                      size={10 + Math.random() * 15} 
                      className="text-success opacity-70" 
                    />
                  </motion.div>
                ))}
              </div>
              
              {/* Message */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold mb-2 text-foreground">{message}</h3>
                <p className="text-foreground-secondary">{subMessage}</p>
              </motion.div>
              
              {/* Actions */}
              {onRedirect && (
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.button
                    onClick={onRedirect}
                    className="flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{redirectText}</span>
                    <ArrowRight size={16} className="ml-2" />
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}