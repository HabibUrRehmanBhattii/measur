"use client";

import { motion } from 'framer-motion';
import { cn } from '../utils/ui';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ 
  fullScreen = true, 
  size = 'md',
  className 
}: LoadingSpinnerProps = {}) {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };
  
  const spinnerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };
  
  if (fullScreen) {
    return (
      <motion.div 
        className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <LoaderContent size={size} className={className} />
      </motion.div>
    );
  }
  
  return <LoaderContent size={size} className={className} />;
}

function LoaderContent({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };
  
  const innerSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  const borderSizeClasses = {
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4'
  };
  
  return (
    <motion.div
      className="relative"
      variants={{
        initial: { opacity: 0, scale: 0.8 },
        animate: { 
          opacity: 1, 
          scale: 1,
          transition: { duration: 0.4, ease: "easeOut" }
        },
        exit: { 
          opacity: 0, 
          scale: 0.8,
          transition: { duration: 0.3, ease: "easeIn" }
        }
      }}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Outer glow effect */}
      <div className="absolute inset-0 blur-xl rounded-full scale-150" style={{background: 'var(--primary)', opacity: '0.15'}}></div>
      
      {/* Main spinner */}
      <div className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size]
      )}>
        <div className={cn(
          "absolute w-full h-full rounded-full",
          borderSizeClasses[size]
        )} style={{borderColor: 'var(--primary)', opacity: '0.2'}}></div>
        
        <div className={cn(
          "absolute w-full h-full rounded-full border-t-transparent animate-spin",
          borderSizeClasses[size]
        )} style={{borderColor: 'var(--primary)'}}></div>
        
        {/* Inner pulse with improved gradient */}
        <div className={cn(
          "rounded-full animate-pulse-gentle",
          innerSizeClasses[size]
        )} style={{background: 'var(--gradient-primary)'}}></div>
        
        {/* Animated dots */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{background: 'var(--primary)', opacity: 0.8}}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.2, 1],
                rotate: [0, 360],
                x: Math.cos(i * (Math.PI * 2 / 3)) * (size === 'sm' ? 10 : size === 'md' ? 15 : 20),
                y: Math.sin(i * (Math.PI * 2 / 3)) * (size === 'sm' ? 10 : size === 'md' ? 15 : 20),
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
