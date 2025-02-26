"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../layout';
import { cn } from '../utils/ui';
import { Moon, Sun, Menu, X } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useContext(ThemeContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Effect to track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Full Body Suit', href: '/measurement/full-body-suit' },
    { label: 'Helmet', href: '/measurement/helmet' },
  ];
  
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'py-2' : 'py-4'
      )}
    >
      <div className={cn(
        'container mx-auto px-4 backdrop-blur-xl rounded-2xl transition-all duration-300',
        isScrolled 
          ? 'glass shadow-3d border border-accent/30 m-2 max-w-7xl' 
          : 'max-w-7xl mx-auto'
      )}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3">
              <motion.div
                className="relative w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 animate-morph bg-gradient-to-r from-primary via-accent to-primary opacity-60" />
                <div className="absolute inset-0 rounded-xl animate-spin-slow opacity-70"
                  style={{background: 'conic-gradient(from 0deg, transparent, var(--primary), transparent)'}}
                />
                <div className="absolute inset-0 bg-surface/70 backdrop-blur-sm opacity-30" />
                
                {/* Laser beam effect */}
                <div className="absolute h-0.5 w-full bg-accent/80 top-1/2 left-0 transform -translate-y-1/2 blur-[2px] animate-laser"></div>
                <div className="absolute h-full w-0.5 bg-primary/80 left-1/2 top-0 transform -translate-x-1/2 blur-[2px] animate-laser-vertical"></div>
                
                {/* Sparkle effects */}
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-white rounded-full animate-sparkle"
                    style={{ 
                      left: `${15 + i * 17}%`, 
                      top: `${15 + i * 17}%`,
                      animationDelay: `${i * 0.3}s` 
                    }}
                  />
                ))}
                
                <span className="relative text-2xl font-bold text-white text-shadow-glow z-10">M</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50 animate-morph"
                  animate={{ 
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="gradient-text animate-gradient" data-text="MEASUR">MEASUR</span>
                </h1>
                <motion.div
                  className="flex items-center gap-1.5" 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-[10px] text-foreground-secondary tracking-widest font-semibold uppercase">
                    Precision Measurement
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-gentle"></span>
                  <span className="text-[10px] text-accent tracking-widest font-semibold uppercase">
                    v1.2
                  </span>
                </motion.div>
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="bg-surface/30 backdrop-blur-md border border-accent/20 rounded-full px-1 py-1 flex items-center shadow-lg">
              {navItems.map((item, index) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                >
                  <motion.div
                    className={cn(
                      "relative px-5 py-2 rounded-full transition-all duration-200 text-sm font-medium",
                      pathname === item.href 
                        ? "text-white" 
                        : "text-foreground-secondary hover:text-white"
                    )}
                    whileHover={pathname !== item.href ? { y: -2 } : {}}
                  >
                    {pathname === item.href && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Admin Link */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex"
            >
            </motion.div>
            
            {/* Enhanced Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="relative p-3 rounded-full transition-all bg-surface/50 backdrop-blur-md border border-accent/30 hover:border-accent overflow-hidden shadow-lg"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={resolvedTheme}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.5,
                    rotate: resolvedTheme === 'dark' ? -45 : 45 
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotate: 0 
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.5,
                    rotate: resolvedTheme === 'dark' ? 45 : -45 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25 
                  }}
                  className="relative z-10"
                >
                  {resolvedTheme === 'dark' ? (
                    <div className="relative">
                      <Sun size={20} className="text-yellow-400" />
                      <div className="absolute -inset-2 bg-yellow-400/20 rounded-full blur-sm animate-pulse-gentle"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Moon size={20} className="text-indigo-400" />
                      <div className="absolute -inset-2 bg-indigo-400/20 rounded-full blur-sm animate-pulse-gentle"></div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* Background glow effect */}
              <motion.div 
                className="absolute inset-0 opacity-30 z-0"
                animate={{
                  background: resolvedTheme === 'dark' 
                    ? 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(255,215,0,0) 70%)' 
                    : 'radial-gradient(circle, rgba(114,137,218,0.6) 0%, rgba(114,137,218,0) 70%)'
                }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Sparkles */}
              {[...Array(3)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-sparkle"
                  style={{ 
                    left: `${20 + i * 25}%`, 
                    top: `${20 + i * 25}%`,
                    animationDelay: `${i * 0.4}s` 
                  }}
                />
              ))}
            </motion.button>
            
            {/* Mobile menu toggle */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: mobileMenuOpen ? -5 : 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileMenu}
              className="md:hidden p-3 rounded-full transition-all bg-surface/50 backdrop-blur-md border border-accent/30 hover:border-accent shadow-lg"
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: mobileMenuOpen ? -90 : 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: mobileMenuOpen ? 90 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <X size={20} className="text-accent" />
                  ) : (
                    <Menu size={20} className="text-primary" />
                  )}
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
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden glass backdrop-blur-xl border-b border-accent/30 mt-1 shadow-3d"
          >
            <nav className="container mx-auto px-6 py-6">
              <motion.ul 
                className="flex flex-col space-y-4"
                variants={{
                  hidden: { opacity: 0 },
                  show: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                {navItems.map((item, index) => (
                  <motion.li 
                    key={item.href}
                    variants={{
                      hidden: { 
                        opacity: 0, 
                        x: -20 
                      },
                      show: { 
                        opacity: 1, 
                        x: 0,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 24,
                          delay: index * 0.1
                        }
                      }
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block py-3 px-4 rounded-xl transition-all duration-300 relative overflow-hidden",
                        pathname === item.href 
                          ? "bg-gradient-to-r from-primary/20 to-accent/20 shadow-md text-white border border-accent/30" 
                          : "hover:bg-surface/50 hover:border hover:border-accent/20 hover:shadow-sm text-foreground-secondary"
                      )}
                    >
                      <div className="flex items-center">
                        {pathname === item.href && (
                          <motion.div 
                            layoutId="mobile-active"
                            className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-accent rounded-r-full" 
                          />
                        )}
                        
                        <span className={pathname === item.href ? "font-medium ml-4" : "ml-0"}>{item.label}</span>
                        
                        {pathname === item.href && (
                          <div className="ml-auto">
                            <div className="h-2 w-2 rounded-full bg-accent"></div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.li>
                ))}
                
                {/* Admin link in mobile menu */}
                <motion.li
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { 
                      opacity: 1, 
                      x: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                        delay: navItems.length * 0.1
                      }
                    }
                  }}
                >
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-xl transition-all duration-300 bg-surface/40 border border-primary/20 text-foreground-secondary"
                  >
                    <div className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                      <span>Admin Panel</span>
                    </div>
                  </Link>
                </motion.li>
              </motion.ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Animated glow effects that follow scroll */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute -top-20 right-1/4 w-[40%] h-[30%] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'linear-gradient(to right, var(--primary), var(--accent))'
          }}
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* CSS for custom animations */}
      <style jsx global>{`
        @keyframes laser {
          0%, 100% { opacity: 0.3; height: 1px; }
          50% { opacity: 0.8; height: 2px; }
        }
        
        @keyframes laser-vertical {
          0%, 100% { opacity: 0.3; width: 1px; }
          50% { opacity: 0.8; width: 2px; }
        }
        
        .animate-laser {
          animation: laser 2s infinite;
        }
        
        .animate-laser-vertical {
          animation: laser-vertical 2.5s infinite;
        }
      `}</style>
    </motion.header>
  );
}