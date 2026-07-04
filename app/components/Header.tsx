"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../layout";
import { useLanguage } from "../context/LanguageContext";
import { Lang } from "../lib/translations";
import { cn } from "../utils/ui";
import { Moon, Sun, Menu, X, Globe } from "lucide-react";

const NAV_LABELS: Record<Lang, Record<string, string>> = {
  de: { "/": "HOME", "/measurement/full-body-suit": "ANZUG", "/measurement/helmet": "HELM" },
  en: { "/": "HOME", "/measurement/full-body-suit": "SUIT", "/measurement/helmet": "HELM" },
};

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useContext(ThemeContext);
  const { lang, setLang, showLanguagePicker } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: NAV_LABELS[lang]["/"] ?? "HOME", href: "/" },
    { label: NAV_LABELS[lang]["/measurement/full-body-suit"] ?? "SUIT", href: "/measurement/full-body-suit" },
    { label: NAV_LABELS[lang]["/measurement/helmet"] ?? "HELM", href: "/measurement/helmet" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-1" : "py-3"
      )}
    >
      <div
        className={cn(
          "container mx-auto px-4 transition-all duration-300 max-w-7xl rounded-sm border",
          isScrolled
            ? "bg-[var(--surface)]/90 backdrop-blur-xl border-[var(--border)] shadow-lg"
            : "bg-transparent border-transparent"
        )}
      >
        <div className="flex items-center justify-between h-14">
          {/* Logo + status */}
          <Link href="/">
            <div className="flex items-center gap-3">
              <motion.div
                className="relative w-10 h-10 rounded-sm flex items-center justify-center overflow-hidden bg-gradient-to-r from-primary via-accent to-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-[2px] rounded-xs bg-surface flex items-center justify-center">
                  <span className="relative text-lg font-bold gradient-text z-10">M</span>
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="font-display text-xl font-bold tracking-tight uppercase">
                  <span className="text-crawl">MEASUR</span>
                </h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse-gentle" />
                  <span className="font-data text-[9px] uppercase tracking-atelier text-foreground-secondary">
                    {lang === "de" ? "SYSTEM AKTIV" : "SYSTEM ACTIVE"}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center">
            <div className="border border-[var(--border)] rounded-sm px-0.5 py-0.5 flex items-center">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      "relative px-4 py-1.5 rounded-xs transition-all duration-200 font-data text-xs tracking-wider border",
                      pathname === item.href
                        ? "text-white border-transparent"
                        : "text-foreground-secondary hover:text-foreground border-[var(--border)] bg-[var(--surface-elevated)]"
                    )}
                  >
                    {pathname === item.href && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xs bg-gradient-to-r from-primary to-accent"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLang(lang === "de" ? "en" : "de")}
              className="relative p-2 rounded-sm transition-all border border-[var(--border)] hover:border-[var(--border-strong)] font-data text-[10px] uppercase tracking-wider text-foreground-secondary hover:text-foreground flex items-center gap-1.5"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              <span>{lang === "de" ? "DE" : "EN"}</span>
            </motion.button>

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="relative p-2 rounded-sm transition-all border border-[var(--border)] hover:border-[var(--border-strong)]"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={resolvedTheme}
                  initial={{ opacity: 0, scale: 0.5, rotate: resolvedTheme === "dark" ? -45 : 45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: resolvedTheme === "dark" ? 45 : -45 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {resolvedTheme === "dark" ? (
                    <Sun size={16} className="text-yellow-400" />
                  ) : (
                    <Moon size={16} className="text-indigo-400" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Mobile toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-sm border border-[var(--border)] hover:border-[var(--border-strong)]"
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: mobileMenuOpen ? -90 : 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: mobileMenuOpen ? 90 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[var(--surface)]/95 backdrop-blur-xl border-b border-[var(--border)] mt-1"
          >
            <nav className="container mx-auto px-6 py-4">
              <motion.ul className="flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block py-2.5 px-4 rounded-sm font-data text-xs tracking-wider transition-all duration-200 border",
                        pathname === item.href
                          ? "bg-[var(--primary)]/10 border-[var(--primary)]/30 text-foreground"
                          : "border-transparent text-foreground-secondary hover:border-[var(--border)]"
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.06 }}
                >
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-4 rounded-sm font-data text-xs tracking-wider border border-[var(--border)] text-foreground-secondary"
                  >
                    Admin
                  </Link>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + 1) * 0.06 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setLang(lang === "de" ? "en" : "de");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center justify-between py-2.5 px-4 rounded-sm font-data text-xs tracking-wider border border-[var(--border)] text-foreground-secondary hover:text-foreground"
                  >
                    <span>{lang === "de" ? "🌐 Sprache / Language" : "🌐 Language / Sprache"}</span>
                    <span className="text-[var(--signal)]">{lang.toUpperCase()}</span>
                  </button>
                </motion.li>
              </motion.ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
