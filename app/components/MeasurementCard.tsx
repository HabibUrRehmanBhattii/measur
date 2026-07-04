"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "../utils/ui";
import { FormInput } from "./FormInput";

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

  return (
    <motion.div
      className={cn(
        "scan-line relative rounded-sm border bg-[var(--surface-elevated)] p-6 overflow-hidden",
        error ? "border-[var(--error)]" : "border-[var(--border)]",
        "hover:border-[var(--border-strong)] transition-colors duration-300",
        className
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
    >
      {/* Top signal line is handled by .scan-line::after */}

      <div className="relative z-10">
        {/* Reference image with tape-measure overlay */}
        <div
          className="relative w-full h-56 mb-5 cursor-pointer rounded-sm overflow-hidden bg-[var(--background)]/30"
          onClick={onClick}
        >
          <motion.div
            className="w-full h-full"
            animate={{ opacity: hovering ? 0.8 : 0.55 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={`/images/${image}`}
              alt={name}
              fill
              className="object-contain p-2"
            />
          </motion.div>

          {/* Tape-measure line that draws when value is entered */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="10"
              y1="85"
              x2="90"
              y2="85"
              stroke="var(--signal)"
              strokeWidth="0.8"
              strokeDasharray="2 1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: value ? 1 : 0,
                opacity: value ? 0.7 : 0,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>

          {/* Hover magnifier */}
          <motion.div
            className="absolute inset-0 bg-[var(--primary)]/5 flex items-center justify-center"
            animate={{ opacity: hovering ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-[var(--surface)]/80 backdrop-blur-sm rounded-full p-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-secondary">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="font-data text-sm font-medium text-center mb-4 text-foreground">
          {name}
        </h3>

        {/* Industrial input */}
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
        />
      </div>

      {/* Corner bracket accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[var(--border)]" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[var(--border)]" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[var(--border)]" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[var(--border)]" />
    </motion.div>
  );
}
