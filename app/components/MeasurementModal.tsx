"use client";

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../utils/ui';

interface MeasurementImage {
  name: string;
  image: string;
}

interface MeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: string;
  measurements: MeasurementImage[];
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function MeasurementModal({
  isOpen,
  onClose,
  selectedImage,
  measurements,
  onNavigate,
}: MeasurementModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const currentMeasurement = measurements.find(m => m.image === selectedImage);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        onNavigate('next');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute top-0 right-0 h-[40%] w-[40%] blur-[120px] rounded-full opacity-20"
              style={{background: 'var(--gradient-primary)'}}
            />
            <div 
              className="absolute bottom-0 left-0 h-[40%] w-[40%] blur-[120px] rounded-full opacity-20"
              style={{background: 'var(--gradient-secondary)'}}
            />
          </div>
          
          {/* Navigation buttons */}
          <motion.button
            className="absolute left-4 md:left-8 p-3 rounded-full glass hover:glass-hover text-white z-20"
            onClick={() => onNavigate('prev')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
          
          <motion.button
            className="absolute right-4 md:right-8 p-3 rounded-full glass hover:glass-hover text-white z-20"
            onClick={() => onNavigate('next')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ChevronRight size={24} />
          </motion.button>
          
          {/* Close button */}
          <motion.button
            className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full glass hover:glass-hover text-white z-20"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <X size={24} />
          </motion.button>
          
          {/* Main content */}
          <motion.div
            ref={modalRef}
            className="relative glass rounded-2xl overflow-hidden shadow-3d max-w-2xl w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
          >
            {/* Image */}
            <div className="relative aspect-square w-full p-8">
              <Image
                src={`/images/${selectedImage}.png`}
                alt={currentMeasurement?.name || 'Measurement'}
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Title Bar */}
            <div className="absolute bottom-0 left-0 right-0 glass py-4 px-6 text-center">
              <h3 className="text-lg font-medium text-white">{currentMeasurement?.name}</h3>
              
              {/* Navigation indicators */}
              <div className="flex justify-center mt-2 space-x-1.5">
                {measurements.map((m, i) => (
                  <div
                    key={m.image}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      m.image === selectedImage 
                        ? "bg-white scale-125" 
                        : "bg-white/30 hover:bg-white/50"
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}