"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check } from "lucide-react";
import { cn } from "../utils/ui";

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
  type = "number",
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
  const [justValid, setJustValid] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const isValid = value && !error;

  // Flash --signal on valid entry
  useEffect(() => {
    if (isValid) {
      setJustValid(true);
      const t = setTimeout(() => setJustValid(false), 600);
      return () => clearTimeout(t);
    }
  }, [isValid, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setTooltipVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className={cn(
            "font-data text-[11px] uppercase tracking-atelier transition-colors duration-200",
            focused ? "text-[var(--signal)]" : "text-foreground-secondary"
          )}
        >
          {label}
          {required && <span className="text-[var(--error)] ml-1">*</span>}
          {units && (
            <span className="normal-case tracking-normal ml-1.5 text-foreground-secondary/50">
              [{units}]
            </span>
          )}
        </label>

        {/* Valid tick */}
        <motion.div
          initial={false}
          animate={{ opacity: justValid ? 1 : 0, scale: justValid ? 1 : 0.5 }}
          className="text-[var(--signal)]"
        >
          {isValid && <Check size={14} />}
        </motion.div>
      </div>

      {/* Input area */}
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "—"}
          required={required}
          min={min}
          max={max}
          autoComplete={autocomplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "w-full bg-transparent border-b-2 pb-2.5 pt-1",
            "font-data text-2xl tabular-nums",
            "focus:outline-none transition-colors duration-300",
            "placeholder:text-foreground-secondary/30",
            "dark:text-white text-foreground",
            error
              ? "border-[var(--error)]"
              : justValid
              ? "border-[var(--signal)]"
              : focused
              ? "border-[var(--border-strong)]"
              : "border-[var(--border)]"
          )}
        />

        {/* Range hint line */}
        {!error && min !== undefined && max !== undefined && (
          <div className="mt-1.5 flex justify-between font-data text-[9px] text-foreground-secondary/40 uppercase tracking-wider">
            <span>min {min}</span>
            <span>max {max}</span>
          </div>
        )}
      </div>

      {/* Tooltip toggle + content */}
      {tooltip && (
        <div className="relative mt-2" ref={tooltipRef}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setTooltipVisible(!tooltipVisible);
            }}
            className={cn(
              "font-data text-[10px] uppercase tracking-wider transition-colors",
              tooltipVisible ? "text-[var(--signal)]" : "text-foreground-secondary/50 hover:text-foreground-secondary"
            )}
          >
            {tooltipVisible ? "▾ info" : "▸ info"}
          </button>

          {tooltipVisible && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 font-data text-[11px] leading-relaxed text-foreground-secondary border-l-2 border-[var(--border-strong)] pl-3"
            >
              {tooltip}
            </motion.div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-1.5 font-data text-[11px] text-[var(--error)]"
        >
          <AlertTriangle size={12} />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
}
