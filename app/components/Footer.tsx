"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '../utils/ui';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerItems = {
    measurements: [
      { label: 'Full Body Suit', href: '/measurement/full-body-suit' },
      { label: 'Helmet', href: '/measurement/helmet' },
    ],
    legal: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
    social: [
      { label: 'Twitter', href: 'https://twitter.com' },
      { label: 'LinkedIn', href: 'https://linkedin.com' },
      { label: 'Instagram', href: 'https://instagram.com' },
    ],
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };
  
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] blur-[130px] rounded-full opacity-10"
          style={{background: 'var(--gradient-primary)'}}
        />
        <div className="absolute bottom-0 left-0 w-[50%] h-[40%] blur-[100px] rounded-full opacity-10"
          style={{background: 'var(--gradient-secondary)'}}
        />
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16"
        >
          {/* Logo and description */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-30" />
                <div className="absolute inset-0 rounded-full animate-spin-slow opacity-40"
                  style={{background: 'conic-gradient(from 0deg, transparent, var(--primary), transparent)'}}
                />
                <div className="absolute inset-0 bg-surface opacity-10 backdrop-blur-sm" />
                <span className="relative text-xl font-bold gradient-text z-10">M</span>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  <span className="gradient-text">Measeurment</span>
                </h3>
                <span className="text-[10px] text-foreground-secondary tracking-widest font-light uppercase">
                  Precision Solutions
                </span>
              </div>
            </div>
            <p className="text-sm text-foreground-secondary mb-6 max-w-xs">
              Advanced body measurement system for precision fits. 
              Accurate, reliable, and built with German engineering excellence.
            </p>
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center hover:border-primary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground-secondary">
                  <path d="M22 5.92375C21.2563 6.25 20.4637 6.46625 19.6375 6.57125C20.4875 6.06375 21.1363 5.26625 21.4412 4.305C20.6488 4.7775 19.7738 5.11125 18.8412 5.2975C18.0887 4.49625 17.0162 4 15.8462 4C13.5763 4 11.7487 5.8425 11.7487 8.10125C11.7487 8.42625 11.7762 8.73875 11.8438 9.03625C8.435 8.87 5.41875 7.23625 3.3925 4.7475C3.03875 5.36125 2.83125 6.06375 2.83125 6.82C2.83125 8.23875 3.5625 9.47625 4.6525 10.1725C3.99375 10.1562 3.3475 9.97 2.8 9.6775C2.8 9.69375 2.8 9.7125 2.8 9.73125C2.8 11.7175 4.22125 13.3737 6.085 13.7562C5.75125 13.8487 5.3875 13.8925 5.01 13.8925C4.7475 13.8925 4.4825 13.8737 4.23375 13.8175C4.765 15.4362 6.2725 16.6287 8.065 16.6675C6.67 17.7562 4.89875 18.4069 2.98125 18.4069C2.645 18.4069 2.3225 18.3882 2 18.335C3.81625 19.5144 5.96875 20.1767 8.29 20.1767C15.835 20.1767 19.96 13.9587 19.96 8.56125C19.96 8.38625 19.9538 8.21375 19.945 8.04375C20.7588 7.46625 21.4425 6.74375 22 5.92375Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center hover:border-primary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground-secondary">
                  <path d="M21.995 22L22 22H17.891V15.798H19.843L20.117 13.392H17.891V11.814C17.891 11.033 18.14 10.483 19.322 10.483H20.222V8.32498C19.395 8.23998 18.564 8.19698 17.733 8.19698C15.703 8.19698 14.345 9.38998 14.345 11.548V13.387H12.39V15.793H14.345V21.995M6.582 4.646C5.224 4.646 4.122 5.748 4.122 7.106C4.122 8.464 5.224 9.566 6.582 9.566C7.94 9.566 9.042 8.464 9.042 7.106C9.042 5.748 7.94 4.646 6.582 4.646ZM3.743 22H9.42V10.38H3.743V22Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center hover:border-primary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground-secondary">
                  <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2176 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </motion.div>
          
          {/* Links */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h4 className="text-sm font-semibold mb-4 text-foreground">Measurements</h4>
            <ul className="space-y-3">
              {footerItems.measurements.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-sm text-foreground-secondary hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h4 className="text-sm font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-3">
              {footerItems.legal.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-sm text-foreground-secondary hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h4 className="text-sm font-semibold mb-4 text-foreground">Social</h4>
            <ul className="space-y-3">
              {footerItems.social.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-sm text-foreground-secondary hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
        >
          <p className="text-xs text-foreground-secondary">
            &copy; {currentYear} Measeurment GmbH. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-foreground-secondary">
              Made with precision in
            </span>
            <span className="flex items-center">
              <span className="inline-block w-4 h-3 bg-black mr-0.5"></span>
              <span className="inline-block w-4 h-3 bg-[#DD0000] mr-0.5"></span>
              <span className="inline-block w-4 h-3 bg-[#FFCE00]"></span>
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}