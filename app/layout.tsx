"use client";

import { Geist, Geist_Mono, Inter } from "next/font/google";
import { createContext, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Create theme context
export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  resolvedTheme: "dark", 
  toggleTheme: () => {},
  setTheme: () => {},
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  // Set theme and update DOM
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Resolve the actual theme if system is selected
    const resolved = newTheme === "system" 
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : newTheme;
      
    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
    
    // Add a transition class for smooth theme transitions
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 500);
  }, []);

  // Theme toggle function
  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  }, [theme, setTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        const newResolvedTheme = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(newResolvedTheme);
        document.documentElement.setAttribute("data-theme", newResolvedTheme);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Effect to handle initial theme and window mounting
  useEffect(() => {
    setMounted(true);
    
    // Get saved theme preference
    const savedTheme = localStorage.getItem("theme") as Theme || "system";
    setTheme(savedTheme);
  }, [setTheme]);

  // Prevent SSR flash
  if (!mounted) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>
          <div className="min-h-screen bg-[#030014]"></div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" data-theme={resolvedTheme}>
      <head>
        <title>Measeurment - Precision Measurement System</title>
        <meta name="description" content="Advanced body measurement system for precision fits" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>
        <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme, setTheme }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={resolvedTheme}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="min-h-screen"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </ThemeContext.Provider>
      </body>
    </html>
  );
}
