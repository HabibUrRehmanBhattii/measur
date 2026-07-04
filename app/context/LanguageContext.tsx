"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Lang } from "../lib/translations";

const STORAGE_KEY = "measur-lang";
const SEEN_KEY = "measur-lang-seen";

type ShowPicker = "unknown" | "yes" | "no";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Re-open the language picker splash. */
  showLanguagePicker: () => void;
  /** True until localStorage has been read — components can use this to avoid SSR flash. */
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "de",
  setLang: () => {},
  showLanguagePicker: () => {},
  ready: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");
  const [showPicker, setShowPicker] = useState<ShowPicker>("unknown");
  const [ready, setReady] = useState(false);

  // Mount: read localStorage once
  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(SEEN_KEY);
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "de" || saved === "en") {
        setLangState(saved);
        setShowPicker(seen === "1" ? "no" : "yes");
      } else {
        setShowPicker("yes");
      }
    } catch {
      setShowPicker("yes");
    }
    setReady(true);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {}
    // Update <html lang> for a11y
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
    setShowPicker("no");
  }, []);

  const showLanguagePicker = useCallback(() => {
    setShowPicker("yes");
  }, []);

  // gate rendering on first-pick until ready
  if (!ready) return null;

  return (
    <LanguageContext.Provider value={{ lang, setLang, showLanguagePicker, ready }}>
      {children}
      <LanguagePickerModal
        open={showPicker === "yes"}
        onPick={setLang}
      />
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// ── Splash shown on first visit ──
function LanguagePickerModal({ open, onPick }: { open: boolean; onPick: (l: Lang) => void }) {
  const [hovered, setHovered] = useState<Lang | null>(null);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "1" || e.key.toLowerCase() === "d") onPick("de");
      if (e.key === "2" || e.key.toLowerCase() === "e") onPick("en");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onPick]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-grid" />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
        style={{ background: "var(--gradient-primary)" }}
      />

      <div className="relative z-10 max-w-2xl w-full mx-4">
        <div className="border border-[var(--border-strong)] rounded-sm bg-[var(--surface-elevated)] p-8 md:p-12 text-center overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--signal)] to-[var(--primary)]" />

          <div className="font-data text-[10px] uppercase tracking-atelier text-[var(--signal)] mb-8 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse-gentle" />
            IMPERIAL MEASUREMENT BUREAU
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight uppercase leading-[0.95] mb-2">
            Willkommen,
            <br />
            <span className="text-[var(--primary)]">Pilot</span>
          </h1>

          <p className="font-data text-xs md:text-sm text-foreground-secondary mt-4 mb-10 max-w-md mx-auto leading-relaxed">
            Choose your language / Wählen Sie Ihre Sprache.
            <br />
            <span className="text-foreground-secondary/60">The entire app will switch to match.</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <button
              type="button"
              onClick={() => onPick("de")}
              onMouseEnter={() => setHovered("de")}
              onMouseLeave={() => setHovered(null)}
              className={`group relative px-6 py-8 rounded-sm border transition-all duration-300 cursor-pointer text-left ${
                hovered === "de"
                  ? "border-[var(--signal)] bg-[var(--signal)]/5"
                  : "border-[var(--border)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary mb-2">/ 01</div>
              <div className="text-4xl mb-3">🇩🇪</div>
              <div className="font-display text-xl font-bold tracking-tight uppercase">Deutsch</div>
              <div className="font-data text-[10px] text-foreground-secondary mt-1">German · DE</div>
              {hovered === "de" && (
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--signal)]"
                  layoutId="picker-underline"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => onPick("en")}
              onMouseEnter={() => setHovered("en")}
              onMouseLeave={() => setHovered(null)}
              className={`group relative px-6 py-8 rounded-sm border transition-all duration-300 cursor-pointer text-left ${
                hovered === "en"
                  ? "border-[var(--signal)] bg-[var(--signal)]/5"
                  : "border-[var(--border)] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary mb-2">/ 02</div>
              <div className="text-4xl mb-3">🇬🇧</div>
              <div className="font-display text-xl font-bold tracking-tight uppercase">English</div>
              <div className="font-data text-[10px] text-foreground-secondary mt-1">English · EN</div>
              {hovered === "en" && (
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--signal)]"
                  layoutId="picker-underline"
                />
              )}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer font-data text-[10px] uppercase tracking-atelier text-foreground-secondary hover:text-foreground transition-colors">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="sr-only"
              />
              <span className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                remember ? "bg-[var(--signal)] border-[var(--signal)]" : "border-[var(--border)]"
              }`}>
                {remember && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--background)]">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              Remember my choice
            </label>
          </div>

          <div className="mt-6 font-data text-[10px] text-foreground-secondary/40 uppercase tracking-atelier">
            keyboard: press 1 = DE · 2 = EN
          </div>
        </div>

        <div className="mt-6 text-center font-data text-[10px] text-foreground-secondary/30 uppercase tracking-atelier">
          MILLIMETER-ACCURATE · GERMAN ENGINEERING · EST. IMPERIAL ERA
        </div>
      </div>
    </div>
  );
}

// motion import via dynamic so this file stays SSR-safe
import { motion } from "framer-motion";
