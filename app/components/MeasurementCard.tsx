"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '../utils/ui';
import { FormInput } from './FormInput';

interface MeasurementCardProps {
  name: string;
  image: string;
  value: string;
  onChange: (value: string) => void;
  description: string;
  min: number;
  max: number;
  error?: string | null;
  onClick?: () => void;
  className?: string;
}

export function MeasurementCard({
  name,
  image,
  value,
  onChange,
  description,
  min,
  max,
  error,
  onClick,
  className,
}: MeasurementCardProps) {
  const [hovering, setHovering] = useState(false);
  
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } },
    hover: { 
      y: -5, 
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
      transition: { type: 'spring', stiffness: 300, damping: 10 }
    }
  };
  
  const imageVariants = {
    initial: { scale: 0.9, opacity: 0.8 },
    hover: { 
      scale: 1.05, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 10 }
    }
  };
  
  return (
    <motion.div
      className={cn(
        "card glass hover:glass-hover rounded-2xl p-5 relative overflow-hidden",
        error ? "border-error" : "border-border",
        "dark:bg-black/20 dark:border-white/10 dark:hover:border-white/20",
        className
      )}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
    >
      {/* Background gradient */}
      <div 
        className="absolute -inset-px rounded-2xl opacity-10 transition-opacity"
        style={{
          background: 'var(--gradient-primary)',
          opacity: hovering ? 0.15 : 0.05
        }}
      />
      
      {/* Card Content */}
      <div className="relative z-10">
        {/* Image */}
        <div 
          className="relative w-full h-32 mb-4 cursor-pointer rounded-xl overflow-hidden"
          onClick={onClick}
        >
          <motion.div 
            className="w-full h-full"
            variants={imageVariants}
          >
            <Image 
              src={`/images/${image}.png`}
              alt={name}
              fill
              className="object-contain p-2"
            />
          </motion.div>
          
          {/* Hover overlay */}
          <motion.div 
            className="absolute inset-0 bg-primary/10 backdrop-blur-sm opacity-0 flex items-center justify-center"
            animate={{ opacity: hovering ? 0.3 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/80 dark:bg-black/50 rounded-full p-2 shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
          </motion.div>
        </div>
        
        {/* Title */}
        <h3 className="text-md font-medium mb-3 text-center">{name}</h3>
        
        {/* Input field */}
        <FormInput
          id={`measurement-${name}`}
          label=""
          type="number"
          value={value}
          onChange={onChange}
          tooltip={description}
          min={min}
          max={max}
          units="cm"
          error={error}
          className="mt-1"
        />
      </div>
    </motion.div>
  );
}