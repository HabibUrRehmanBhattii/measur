"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

interface SuccessAnimationProps {
  message?: string;
  subMessage?: string;
  onComplete?: () => void;
  redirectText?: string;
  onRedirect?: () => void;
}

export default function SuccessAnimation({
  message,
  subMessage,
  onComplete,
  redirectText,
  onRedirect,
}: SuccessAnimationProps) {
  const { lang } = useLanguage();
  const s = translations.success[lang];
  const [transferProgress, setTransferProgress] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const resolvedMessage = message ?? s.defaultMsg;
  const resolvedSubMessage = subMessage ?? s.defaultSub;
  const resolvedRedirectText = redirectText ?? s.back;

  // Animate the data-transfer bar filling, then reveal the lock message
  useEffect(() => {
    const interval = setInterval(() => {
      setTransferProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 8;
      });
    }, 60);

    const msgTimer = setTimeout(() => setShowMessage(true), 700);
    const completeTimer = setTimeout(() => onComplete?.(), 3500);

    return () => { clearInterval(interval); clearTimeout(msgTimer); clearTimeout(completeTimer); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative max-w-md w-full mx-4"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <div className="border border-[var(--border-strong)] rounded-sm overflow-hidden bg-[var(--surface-elevated)]">
          {/* Top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--signal)] to-[var(--success)]" />

          <div className="p-8">
            {/* Telemetry lock — SVG circle draws itself */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  {/* Track */}
                  <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" strokeWidth="3" />
                  {/* Draw arc */}
                  <motion.circle
                    cx="40" cy="40" r="34"
                    fill="none"
                    stroke="var(--signal)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 34}
                    initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ rotate: -90, transformOrigin: "center" }}
                  />
                </svg>
                {/* Center lock icon */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 400 }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Data transfer bar */}
            <div className="mb-4">
              <div className="flex justify-between font-data text-[10px] uppercase tracking-atelier text-foreground-secondary mb-1.5">
                <span>{s.dataTransfer}</span>
                <span>{Math.min(transferProgress, 100)}%</span>
              </div>
              <div className="h-1 w-full bg-[var(--border)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--signal)]"
                  animate={{ width: `${Math.min(transferProgress, 100)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Message — revealed after transfer completes */}
            <AnimatePresence>
              {showMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center mb-6"
                >
                  <h3 className="font-display text-xl font-bold uppercase tracking-wide mb-1">{resolvedMessage}</h3>
                  <p className="font-data text-sm text-foreground-secondary">{resolvedSubMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Redirect */}
            {onRedirect && (
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: showMessage ? 1 : 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={onRedirect}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[var(--border-strong)] hover:border-[var(--signal)] transition-colors font-data text-xs uppercase tracking-wider"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{resolvedRedirectText}</span>
                  <ArrowRight size={14} />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
