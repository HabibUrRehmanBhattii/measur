"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { cn } from '../utils/ui';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  tooltip?: string;
  error?: string | null;
  min?: number;
  max?: number;
  units?: string;
  className?: string;
  autocomplete?: string;
}

export function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  tooltip,
  error,
  min,
  max,
  units,
  className,
  autocomplete,
}: FormInputProps) {
  const [focused, setFocused] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Handle tooltip positioning
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setTooltipVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className={cn("relative", className)}>
      <label 
        htmlFor={id}
        className={cn(
          "block text-sm font-medium mb-2 transition-colors",
          focused ? "text-primary" : "text-foreground"
        )}
      >
        {label}
        {required && <span className="text-error ml-1">*</span>}
        
        {tooltip && (
          <button
            type="button"
            className={cn(
              "ml-1.5 p-0.5 rounded-full inline-flex items-center justify-center transition-colors",
              tooltipVisible ? "text-primary bg-primary/10" : "text-foreground-secondary hover:text-primary"
            )}
            onClick={(e) => {
              e.preventDefault();
              setTooltipVisible(!tooltipVisible);
            }}
            aria-label="Show information"
          >
            <Info size={14} />
          </button>
        )}
      </label>
      
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          autoComplete={autocomplete}
          className={cn(
            "w-full px-3 py-2.5 rounded-xl transition-all duration-200",
            "bg-surface border border-border text-foreground dark:text-white",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none",
            "dark:bg-black/30 dark:border-white/20 dark:focus:border-primary-light",
            units && "pr-10",
            error ? "border-error focus:border-error focus:ring-error/20" : "",
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        
        {units && (
          <div 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary text-sm pointer-events-none"
          >
            {units}
          </div>
        )}
        
        {/* Input validation state */}
        {value && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-success"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM7 11.4L3.6 8L5 6.6L7 8.6L11 4.6L12.4 6L7 11.4Z" fill="currentColor"/>
            </svg>
          </motion.div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-error"
        >
          {error}
        </motion.div>
      )}
      
      {/* Tooltip */}
      {tooltipVisible && tooltip && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="absolute z-10 left-0 mt-1 p-3 w-full max-w-xs bg-surface-secondary backdrop-blur-lg rounded-lg border border-border shadow-lg"
        >
          <div className="text-xs text-foreground-secondary">{tooltip}</div>
        </motion.div>
      )}
    </div>
  );
}