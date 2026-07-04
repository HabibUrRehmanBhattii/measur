"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

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
  cancelText = "Abort",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Panel — slides up from bottom on mobile, centered on desktop */}
          <motion.div
            className="relative w-full max-w-lg mx-4 mb-0 sm:mb-0 bg-[var(--surface-elevated)] border border-[var(--border-strong)] rounded-t-lg sm:rounded-lg overflow-hidden shadow-2xl"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--signal)] to-[var(--primary)]" />

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center bg-[var(--warning)]/10 text-[var(--warning)] p-1.5 rounded-sm">
                  <AlertTriangle size={16} />
                </span>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider">{title}</h3>
              </div>
              <button
                onClick={onCancel}
                className="text-foreground-secondary hover:text-foreground transition-colors p-1 rounded-sm hover:bg-[var(--border)]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <p className="font-data text-sm text-foreground-secondary mb-4">{message}</p>

              {/* Spec sheet grid */}
              <div className="border border-[var(--border)] rounded-sm overflow-hidden">
                <div className="bg-[var(--background)] px-3 py-2 border-b border-[var(--border)]">
                  <span className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary">SPEZIFIKATIONEN</span>
                </div>
                <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
                  {/* Render spec rows — the parent passes message; we show a generic confirmation */}
                  <div className="col-span-2 bg-[var(--surface-elevated)] p-3 font-data text-xs text-foreground-secondary text-center">
                    Bitte bestätige die Übertragung der Messwerte.
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 p-5 pt-0">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 rounded-sm border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors font-data text-xs uppercase tracking-wider"
              >
                {cancelText}
              </button>
              <motion.button
                onClick={onConfirm}
                className="px-5 py-2.5 rounded-sm bg-[var(--signal)] text-[var(--background)] font-data text-xs uppercase tracking-wider font-bold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {confirmText}
              </motion.button>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--signal)]/40 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
