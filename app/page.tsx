"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "./layout";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Scene3D from "./components/Scene3D";
import { GradientText, Badge, AnimatedContainer } from "./utils/ui";
import { ArrowRight, ChevronDown, LineChart, ShieldCheck, Activity } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { resolvedTheme } = useContext(ThemeContext);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const handleSelection = (selection: string) => {
    router.push(`/measurement/${selection}`);
  };

  // Handle scroll to hide the scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Container animation variants
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
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <>
      <Header />
      
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
      >
        <motion.div
          className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent shadow-glow flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
      
      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute top-0 -z-10 h-full w-full">
            <div className="absolute h-full w-full" style={{background: 'var(--background)'}} />
            <div className="absolute top-0 right-0 h-[50%] w-[80%] rounded-full" 
              style={{
                background: 'var(--gradient-primary)', 
                opacity: '0.1', 
                filter: 'blur(140px)'
              }} 
            />
            <div className="absolute bottom-0 left-0 h-[40%] w-[50%] rounded-full" 
              style={{
                background: 'var(--gradient-secondary)', 
                opacity: '0.1', 
                filter: 'blur(120px)'
              }} 
            />
          </div>

          {/* Background Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => {
              // Pre-calculate random values to avoid in-render calculation
              const width = 1 + (i % 4) + 1;
              const height = 1 + (i % 4) + 1;
              const xPos = (i * 3.33) % 100;
              const yPos = (i * 3.33 + 10) % 100;
              const opacity = 0.1 + (i % 3) * 0.05;
              const duration = 10 + (i % 10) + 10;
              const delay = (i % 5);
              
              return (
                <motion.div
                  key={`bg-particle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    x: `${xPos}%`,
                    y: `${yPos}%`,
                    opacity: opacity,
                    background: resolvedTheme === "dark" ? "white" : "var(--primary)",
                  }}
                  animate={{
                    y: ["-10%", "110%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: duration,
                    delay: delay,
                    ease: "linear",
                  }}
                />
              );
            })}
          </div>

          {/* Scroll Indicator */}
          {showScrollIndicator && (
            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <motion.p 
                className="text-xs text-foreground-secondary"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Scroll down
              </motion.p>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown size={16} className="text-foreground-secondary" />
              </motion.div>
            </motion.div>
          )}

          {/* Content */}
          <div className="container mx-auto px-4 py-16 flex flex-col-reverse lg:flex-row items-center">
            <motion.div 
              className="w-full lg:w-1/2 lg:pr-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-4">
                <Badge variant="primary" size="md" className="mb-4">PRÄZISION</Badge>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-none"
              >
                Präzisions<GradientText data-text="messung">messung</GradientText>
                <br />
                <span className="relative inline-block">
                  <GradientText data-text="Neu definiert.">Neu definiert.</GradientText>
                  <motion.span 
                    className="absolute -bottom-2 md:-bottom-3 left-0 h-1 md:h-2 bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                  />
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-base md:text-lg mb-8 text-foreground-secondary max-w-xl"
              >
                Erleben Sie die Zukunft der Körper- und Kopfmessung mit unserer wegweisenden 
                Technologie. Hochpräzise, zuverlässig und benutzerfreundlich.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  onClick={() => handleSelection("full-body-suit")}
                  className="btn-primary px-8 py-4 rounded-xl font-bold"
                  whileHover={{ y: -5 }}
                  whileTap={{ y: 0 }}
                >
                  <span className="flex items-center gap-2">
                    Ganzkörperanzug
                    <ArrowRight size={18} />
                  </span>
                </motion.button>
                
                <motion.button
                  onClick={() => handleSelection("helmet")}
                  className="btn-secondary px-8 py-4 rounded-xl font-medium"
                  whileHover={{ y: -5 }}
                  whileTap={{ y: 0 }}
                >
                  <span className="flex items-center gap-2">
                    Helm
                    <ArrowRight size={18} />
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
            
            {/* 3D Scene */}
            <div className="w-full lg:w-1/2 h-[400px] md:h-[500px] mb-12 lg:mb-0">
              <Scene3D className="w-full h-full" />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" size="md" className="mb-3">FEATURES</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Warum <GradientText>Measeurment</GradientText>?</h2>
              <p className="text-foreground-secondary max-w-2xl mx-auto">
                Unsere Plattform bietet fortschrittliche Funktionen für präzise Messungen
                und nahtlose Datenverarbeitung.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatedContainer
                delay={0.1}
                delayIncrement={0.1}
                className="space-y-8"
              >
                <FeatureCard
                  icon={<ShieldCheck className="w-6 h-6 text-primary" />}
                  title="Präzise Messungen"
                  description="Hochgenaue Messungen für perfekte Passform durch moderne Messtechnologie."
                />
                
                <FeatureCard
                  icon={<Activity className="w-6 h-6 text-primary" />}
                  title="Echtzeit-Verarbeitung"
                  description="Sofortige Datenverarbeitung und Analyse für schnelle Ergebnisse."
                />
              </AnimatedContainer>
              
              <AnimatedContainer
                delay={0.2}
                delayIncrement={0.1}
                className="space-y-8 md:translate-y-12"
              >
                <FeatureCard
                  icon={<LineChart className="w-6 h-6 text-primary" />}
                  title="Datenvisualisierung"
                  description="Klare visuelle Darstellungen und Berichte für besseres Verständnis."
                />
                
                <FeatureCard
                  icon={<ShieldCheck className="w-6 h-6 text-primary" />}
                  title="Sichere Speicherung"
                  description="Verschlüsselte Datenspeicherung mit höchsten Sicherheitsstandards."
                />
              </AnimatedContainer>
              
              <AnimatedContainer
                delay={0.3}
                delayIncrement={0.1}
                className="space-y-8"
              >
                <FeatureCard
                  icon={<Activity className="w-6 h-6 text-primary" />}
                  title="Intuitive Bedienung"
                  description="Benutzerfreundliche Oberfläche für einfache Navigation und Bedienung."
                />
                
                <FeatureCard
                  icon={<LineChart className="w-6 h-6 text-primary" />}
                  title="Umfassende Berichte"
                  description="Detaillierte Berichte und Analysen für ganzheitliches Verständnis."
                />
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* Futuristic Capabilities Section */}
        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute w-full h-full bg-gradient-to-b from-background via-background-secondary/50 to-background opacity-80"></div>
            <div className="absolute top-0 right-0 w-full h-full opacity-10">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                  <radialGradient id="grid-gradient-home" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <g stroke="url(#grid-gradient-home)" strokeWidth="0.2">
                  {/* Horizontal lines */}
                  {[...Array(20)].map((_, i) => (
                    <line key={`grid-h-${i}`} x1="0" y1={i * 5} x2="100" y2={i * 5} />
                  ))}
                  {/* Vertical lines */}
                  {[...Array(20)].map((_, i) => (
                    <line key={`grid-v-${i}`} x1={i * 5} y1="0" x2={i * 5} y2="100" />
                  ))}
                </g>
              </svg>
            </div>
          </div>

          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-20">
              <motion.div 
                className="lg:w-1/2 mb-12 lg:mb-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Badge variant="primary" size="lg" className="mb-4 shadow-glow">INNOVATION</Badge>
                <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                  <GradientText data-text="Zukunftsweisende" glow={true}>Zukunftsweisende</GradientText> Technologie für <GradientText data-text="Präzisionsmessungen" glow={true}>Präzisionsmessungen</GradientText>
                </h2>
                
                <div className="space-y-8 mt-10">
                  <CapabilityCard
                    icon={
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    }
                    title="Hochpräzise Echtzeitmessungen"
                    description="Unsere fortschrittliche Technologie ermöglicht präzise Messungen mit minimaler Fehlertoleranz in Echtzeit."
                  />
                  
                  <CapabilityCard
                    icon={
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    }
                    title="Umfassende Analysen & Berichte"
                    description="Detaillierte Datenanalyse mit maßgeschneiderten Berichten für optimale Ergebnisse und Entscheidungsfindung."
                  />
                  
                  <CapabilityCard
                    icon={
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    }
                    title="Konfigurierbare Messplatformen"
                    description="Passen Sie die Messumgebung an Ihre spezifischen Anforderungen an für optimale Ergebnisse."
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse-gentle"></div>
                  
                  <div className="glass card-glass w-full h-full rounded-3xl p-8 backdrop-blur-2xl border border-primary/20 shadow-3d overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary to-accent rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-accent to-primary rounded-full blur-3xl opacity-20"></div>
                    
                    <div className="relative h-full w-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-3 gradient-text animate-gradient" data-text="Measeurment">Measeurment</div>
                        <p className="text-foreground-secondary text-sm mb-6">Intelligente Präzisionsmessung</p>
                        
                        <div className="relative w-full max-w-xs mx-auto aspect-square rounded-xl overflow-hidden mb-4 glass shadow-glow">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"></div>
                          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                          
                          <div className="absolute inset-4 flex items-center justify-center">
                            <div className="w-28 h-28 rounded-full animate-morph bg-gradient-to-br from-primary/50 to-accent/50 shadow-2xl flex items-center justify-center overflow-hidden border border-white/20">
                              <span className="text-xl font-bold text-white">3D</span>
                            </div>
                          </div>
                          
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 animate-spin-slow opacity-20" style={{
                              background: 'conic-gradient(from 0deg, transparent, var(--primary), transparent)'
                            }}></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-center space-x-2">
                          <Badge variant="primary" size="sm">Präzision</Badge>
                          <Badge variant="accent" size="sm">Innovation</Badge>
                          <Badge variant="default" size="sm">Qualität</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-24 relative">
          <div 
            className="absolute inset-0 -z-10" 
            style={{
              background: resolvedTheme === "dark" 
                ? "linear-gradient(to bottom, rgba(11, 15, 25, 0), rgba(11, 15, 25, 0.5), rgba(11, 15, 25, 0))" 
                : "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(245, 247, 250, 0.8), rgba(255, 255, 255, 0))"
            }}
          />
          
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="secondary" size="md" className="mb-3">TESTIMONIALS</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Was unsere <GradientText data-text="Kunden">Kunden</GradientText> sagen
              </h2>
              <p className="text-foreground-secondary max-w-2xl mx-auto">
                Erfahren Sie, wie unsere Präzisionsmessungen Kunden weltweit geholfen haben
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <TestimonialCard 
                quote="Die Messgenauigkeit von Measeurment hat die Passform meines Anzugs revolutioniert. Absolut beeindruckend!"
                author="Michael S."
                role="Professioneller Rennfahrer"
                rating={5}
              />
              
              <TestimonialCard 
                quote="Die benutzerfreundliche Oberfläche und der reibungslose Prozess haben das Messerlebnis wirklich angenehm gemacht."
                author="Laura K."
                role="Freizeitpilotin"
                rating={5}
                className="md:mt-12"
              />
              
              <TestimonialCard 
                quote="Die Detailgenauigkeit und die schnelle Verarbeitung haben meine Erwartungen weit übertroffen."
                author="Thomas B."
                role="Motorsport-Enthusiast"
                rating={4}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div 
            className="absolute inset-0 -z-10" 
            style={{
              background: resolvedTheme === "dark" 
                ? "linear-gradient(to bottom, rgba(11, 15, 25, 0), rgba(11, 15, 25, 0.8), rgba(11, 15, 25, 0))" 
                : "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(245, 247, 250, 1), rgba(255, 255, 255, 0))"
            }}
          />
          
          <motion.div 
            className="container mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-5xl mx-auto p-8 md:p-12 rounded-3xl glass border border-border shadow-3d relative overflow-hidden">
              {/* Background elements */}
              <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full" style={{background: 'var(--gradient-primary)', opacity: '0.1', filter: 'blur(80px)'}}></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full" style={{background: 'var(--gradient-secondary)', opacity: '0.1', filter: 'blur(80px)'}}></div>
              
              <div className="relative z-10 text-center">
                <Badge variant="primary" size="md" className="mb-4">STARTEN SIE JETZT</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Bereit für präzise <GradientText data-text="Messungen">Messungen</GradientText>?
                </h2>
                <p className="text-foreground-secondary mb-8 max-w-2xl mx-auto">
                  Wählen Sie zwischen unserem Ganzkörperanzug oder Helmmessprogramm, 
                  um sofort mit präzisen Messungen zu beginnen.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.button
                    onClick={() => handleSelection("full-body-suit")}
                    className="btn-primary px-8 py-4 rounded-xl font-bold"
                    whileHover={{ y: -5 }}
                    whileTap={{ y: 0 }}
                  >
                    <span className="flex items-center gap-2">
                      Ganzkörperanzug
                      <ArrowRight size={18} />
                    </span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleSelection("helmet")}
                    className="btn-secondary px-8 py-4 rounded-xl font-medium"
                    whileHover={{ y: -5 }}
                    whileTap={{ y: 0 }}
                  >
                    <span className="flex items-center gap-2">
                      Helm
                      <ArrowRight size={18} />
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card p-6 hover:scale-[1.02] transition-all duration-300">
      <div className="mb-4 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-foreground-secondary text-sm">{description}</p>
    </div>
  );
}

interface TimelineItemProps {
  index: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  align?: 'left' | 'right';
}

function TimelineItem({ index, title, description, icon, align = 'left' }: TimelineItemProps) {
  return (
    <motion.div 
      className="relative pb-12" 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Circle marker */}
      <div className="absolute left-1 md:left-1/2 top-0 w-8 h-8 rounded-full bg-surface border-2 border-primary flex items-center justify-center z-10 transform -translate-x-1/2 shadow-md">
        <span className="text-xs font-bold text-primary">{index}</span>
      </div>
      
      {/* Mobile view */}
      <div className="md:hidden ml-12">
        <div className="card p-4 shadow-md bg-surface hover:border-primary transition-colors">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <div className="text-primary">{icon}</div>
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-foreground-secondary text-sm">{description}</p>
        </div>
      </div>
      
      {/* Desktop view */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-12">
        {/* Left side content */}
        <div className={`${align === 'right' ? 'col-start-2' : 'col-start-1'}`}>
          <div className={`card p-5 shadow-md hover:scale-[1.02] transition-all duration-300 hover:border-primary ${align === 'right' ? 'ml-6' : 'mr-6'}`}>
            <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 ${align === 'right' ? '' : 'ml-auto'}`}>
              <div className="text-primary">{icon}</div>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${align === 'right' ? '' : 'text-right'}`}>{title}</h3>
            <p className={`text-foreground-secondary text-sm ${align === 'right' ? '' : 'text-right'}`}>{description}</p>
            
            {/* Visual indicator matching the timeline direction */}
            <div className={`absolute ${align === 'right' ? '-left-3' : '-right-3'} top-1/2 w-3 h-3 rounded-full bg-primary transform -translate-y-1/2 hidden md:block`}></div>
          </div>
        </div>
        
        {/* Empty column for spacing */}
        <div className={`${align === 'right' ? 'col-start-1' : 'col-start-2'}`}></div>
      </div>
    </motion.div>
  );
}

interface CapabilityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function CapabilityCard({ icon, title, description }: CapabilityCardProps) {
  return (
    <motion.div 
      className="p-6 rounded-2xl border border-primary/10 backdrop-blur-md bg-surface/20 hover:border-primary/30 transition-all duration-300 group"
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 30px rgba(var(--primary-rgb), 0.2)'
      }}
    >
      <div className="flex items-start gap-5">
        <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-md border border-primary/20 group-hover:bg-primary/20 transition-all duration-300">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 gradient-text">{title}</h3>
          <p className="text-foreground-secondary text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
  className?: string;
}

function TestimonialCard({ quote, author, role, rating, className = '' }: TestimonialCardProps) {
  return (
    <motion.div 
      className={`card p-6 hover:scale-[1.02] transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        boxShadow: '0 20px 40px rgba(var(--primary-rgb), 0.2)',
        borderColor: 'var(--primary-light)'
      }}
    >
      {/* Quote mark */}
      <div className="mb-4 text-4xl text-primary/20">"</div>
      
      {/* Quote content */}
      <p className="text-foreground mb-6 italic">{quote}</p>
      
      {/* Rating */}
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg 
            key={`star-${author.replace(/\s+/g, '-').toLowerCase()}-${i}`}
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill={i < rating ? 'var(--primary)' : 'none'} 
            stroke={i < rating ? 'var(--primary)' : 'var(--foreground-secondary)'} 
            className="mr-1"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
      
      {/* Author info */}
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          <span className="text-primary font-bold">
            {author.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-sm">{author}</h4>
          <p className="text-xs text-foreground-secondary">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
