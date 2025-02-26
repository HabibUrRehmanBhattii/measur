"use client";

import { useRef, useState, useEffect, useContext } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ThemeContext } from '../layout';

// Modern Scene3D with mouse interactivity
export default function Scene3D({ className = '' }) {
  const { resolvedTheme } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // Transform mouse position into rotation values with limits
  const rotateX = useTransform(springY, [-300, 300], [15, -15]);
  const rotateY = useTransform(springX, [-300, 300], [-15, 15]);
  
  // Pre-compute transforms for shine effect
  const shineX = useTransform(springX, [-300, 300], [-20, 20]);
  const shineY = useTransform(springY, [-300, 300], [-20, 20]);
  
  // Handle mouse move for interactive effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    
    mouseX.set(x);
    mouseY.set(y);
  };
  
  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return <div className={className} />;
  
  // Pre-compute floating point positions
  const floatingPoints = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const x = Math.cos(angle) * 28;
    const y = Math.sin(angle) * 28;
    floatingPoints.push({ x, y, delay: i * 0.3 });
  }

  // Pre-compute data points
  const dataPoints = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const distance = 170 + (i % 3) * 20;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    dataPoints.push({ x, y, opacity: 0.3 + (i % 3) * 0.2, delay: i * 0.2, duration: 3 + (i % 4) });
  }
  
  return (
    <div 
      ref={containerRef}
      className={`${className} relative overflow-hidden flex items-center justify-center perspective-1000 cursor-grab active:cursor-grabbing`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Scene container with perspective */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Futuristic backdrop */}
        <div className="absolute inset-0 flex items-center justify-center transform-gpu">
          <motion.div 
            className="w-80 h-80 rounded-full"
            style={{ 
              background: resolvedTheme === 'dark' 
                ? 'radial-gradient(circle, rgba(80,100,200,0.7) 0%, rgba(60,80,180,0.3) 50%, rgba(40,60,160,0) 80%)' 
                : 'radial-gradient(circle, rgba(70,90,180,0.6) 0%, rgba(50,70,160,0.3) 50%, rgba(30,50,140,0) 80%)',
              zIndex: -2,
              filter: 'blur(2px)'
            }}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Animated grid floor */}
        <motion.div 
          className="absolute bottom-0 w-full h-[45%] transform-gpu"
          style={{
            background: `linear-gradient(to top, 
              ${resolvedTheme === 'dark' ? 'rgba(30,40,100,0.4)' : 'rgba(30,40,120,0.3)'} 0%, 
              transparent 100%)`,
            perspective: "800px",
            transformStyle: "preserve-3d",
            transform: "rotateX(60deg)",
            zIndex: -1
          }}
        >
          <motion.div 
            className="w-full h-full" 
            style={{
              background: `repeating-linear-gradient(
                90deg,
                ${resolvedTheme === 'dark' ? 'rgba(100,120,255,0.15)' : 'rgba(80,100,220,0.1)'} 0px,
                ${resolvedTheme === 'dark' ? 'rgba(100,120,255,0.15)' : 'rgba(80,100,220,0.1)'} 1px,
                transparent 1px,
                transparent 40px
              ),
              repeating-linear-gradient(
                0deg,
                ${resolvedTheme === 'dark' ? 'rgba(100,120,255,0.15)' : 'rgba(80,100,220,0.1)'} 0px,
                ${resolvedTheme === 'dark' ? 'rgba(100,120,255,0.15)' : 'rgba(80,100,220,0.1)'} 1px,
                transparent 1px,
                transparent 40px
              )`,
              transformStyle: "preserve-3d"
            }}
            animate={{
              backgroundPosition: ["0px 0px", "40px 40px"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
        
        {/* Central measuring device */}
        <motion.div
          className="relative transform-gpu"
          style={{
            transformStyle: "preserve-3d",
            zIndex: 20
          }}
          animate={{
            rotateY: 360
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Core device structure */}
          <motion.div 
            className="relative w-48 h-48 rounded-full transform-gpu"
            style={{
              background: resolvedTheme === 'dark'
                ? 'linear-gradient(135deg, rgba(40,50,150,0.8), rgba(60,80,180,0.6))'
                : 'linear-gradient(135deg, rgba(50,70,180,0.7), rgba(80,100,200,0.5))',
              boxShadow: `0 0 30px ${resolvedTheme === 'dark' ? 'rgba(60,80,200,0.4)' : 'rgba(80,100,220,0.3)'}`,
              border: `1px solid ${resolvedTheme === 'dark' ? 'rgba(100,140,255,0.4)' : 'rgba(120,160,255,0.3)'}`,
              transformStyle: "preserve-3d"
            }}
            animate={{
              rotateZ: [0, 360]
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Core ring */}
            <motion.div
              className="absolute inset-2 rounded-full transform-gpu border-2"
              style={{
                borderColor: resolvedTheme === 'dark' ? 'rgba(120,160,255,0.4)' : 'rgba(140,180,255,0.3)',
                background: 'transparent',
                transformStyle: "preserve-3d",
                transform: "translateZ(5px)"
              }}
              animate={{
                rotateZ: [360, 0]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {/* Inner disk with glowing effect */}
              <motion.div
                className="absolute inset-4 rounded-full transform-gpu"
                style={{
                  background: resolvedTheme === 'dark'
                    ? 'radial-gradient(circle, rgba(100,140,255,0.6) 0%, rgba(80,120,235,0.4) 70%, rgba(60,100,215,0.2) 100%)'
                    : 'radial-gradient(circle, rgba(120,160,255,0.5) 0%, rgba(100,140,235,0.3) 70%, rgba(80,120,215,0.1) 100%)',
                  boxShadow: `0 0 20px ${resolvedTheme === 'dark' ? 'rgba(100,140,255,0.5)' : 'rgba(120,160,255,0.4)'}`,
                  transformStyle: "preserve-3d",
                  transform: "translateZ(10px)"
                }}
                animate={{
                  boxShadow: [
                    `0 0 20px ${resolvedTheme === 'dark' ? 'rgba(100,140,255,0.5)' : 'rgba(120,160,255,0.4)'}`,
                    `0 0 30px ${resolvedTheme === 'dark' ? 'rgba(100,140,255,0.7)' : 'rgba(120,160,255,0.6)'}`,
                    `0 0 20px ${resolvedTheme === 'dark' ? 'rgba(100,140,255,0.5)' : 'rgba(120,160,255,0.4)'}`
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Holographic measurement interface */}
            <motion.div
              className="absolute inset-8 rounded-full flex items-center justify-center transform-gpu"
              style={{
                background: 'transparent',
                transformStyle: "preserve-3d",
                transform: "translateZ(20px)"
              }}
            >
              <motion.div
                className="relative w-full h-full flex items-center justify-center"
                animate={{
                  rotateZ: [0, -360]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {/* Holographic display */}
                <motion.div
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    background: resolvedTheme === 'dark'
                      ? 'radial-gradient(circle, rgba(140,180,255,0.15) 0%, rgba(120,160,255,0.1) 100%)'
                      : 'radial-gradient(circle, rgba(160,200,255,0.1) 0%, rgba(140,180,255,0.05) 100%)',
                    backdropFilter: 'blur(1px)',
                    border: `1px solid ${resolvedTheme === 'dark' ? 'rgba(140,180,255,0.3)' : 'rgba(160,200,255,0.2)'}`,
                  }}
                >
                  {/* Measurement data */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      className="text-2xl font-mono font-bold text-white/90"
                      animate={{
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      58.2
                    </motion.div>
                    <div className="text-xs font-medium text-white/70">
                      Circumference (cm)
                    </div>
                  </div>
                  
                  {/* Scan line effect */}
                  <motion.div
                    className="absolute w-full h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, 
                        transparent 0%, 
                        ${resolvedTheme === 'dark' ? 'rgba(140,180,255,0.6)' : 'rgba(160,200,255,0.5)'} 50%, 
                        transparent 100%)`
                    }}
                    animate={{
                      top: ["0%", "100%", "0%"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Rotating measurement nodes */}
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const radius = 70;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <motion.div
                  key={`node-${i}`}
                  className="absolute w-3 h-3 rounded-full transform-gpu"
                  style={{
                    background: i % 2 === 0 
                      ? resolvedTheme === 'dark' ? 'rgba(160,200,255,0.9)' : 'rgba(140,180,255,0.9)'
                      : resolvedTheme === 'dark' ? 'rgba(140,180,255,0.8)' : 'rgba(120,160,255,0.8)',
                    boxShadow: `0 0 8px ${resolvedTheme === 'dark' ? 'rgba(160,200,255,0.7)' : 'rgba(140,180,255,0.6)'}`,
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    zIndex: 30,
                    transformStyle: "preserve-3d",
                    transform: "translateZ(25px)"
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 8px ${resolvedTheme === 'dark' ? 'rgba(160,200,255,0.7)' : 'rgba(140,180,255,0.6)'}`,
                      `0 0 15px ${resolvedTheme === 'dark' ? 'rgba(160,200,255,0.9)' : 'rgba(140,180,255,0.8)'}`,
                      `0 0 8px ${resolvedTheme === 'dark' ? 'rgba(160,200,255,0.7)' : 'rgba(140,180,255,0.6)'}`
                    ],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.25,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
            
            {/* Connector beams between nodes */}
            {[...Array(8)].map((_, i) => {
              const fromAngle = (i / 8) * Math.PI * 2;
              const toAngle = ((i + 1) % 8 / 8) * Math.PI * 2;
              const radius = 70;
              
              const fromX = Math.cos(fromAngle) * radius;
              const fromY = Math.sin(fromAngle) * radius;
              const toX = Math.cos(toAngle) * radius;
              const toY = Math.sin(toAngle) * radius;
              
              // Calculate beam angle and length
              const dx = toX - fromX;
              const dy = toY - fromY;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              
              return (
                <motion.div
                  key={`beam-${i}`}
                  className="absolute h-[1px] transform-gpu origin-left"
                  style={{
                    background: resolvedTheme === 'dark' 
                      ? 'linear-gradient(90deg, rgba(160,200,255,0.8), rgba(140,180,255,0.2))'
                      : 'linear-gradient(90deg, rgba(140,180,255,0.7), rgba(120,160,255,0.1))',
                    width: `${length}px`,
                    left: `calc(50% + ${fromX}px)`,
                    top: `calc(50% + ${fromY}px)`,
                    transform: `rotate(${angle}deg) translateZ(25px)`,
                    transformStyle: "preserve-3d",
                    zIndex: 25
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.125,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </motion.div>
          
          {/* Outer orbiting rings */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transform-gpu"
            style={{
              borderColor: resolvedTheme === 'dark' ? 'rgba(140,180,255,0.3)' : 'rgba(120,160,255,0.2)',
              transformStyle: "preserve-3d"
            }}
            animate={{
              rotateZ: [0, 360],
              rotateX: [15, 0, -15, 0, 15]
            }}
            transition={{
              rotateZ: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              },
              rotateX: {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
          
          <motion.div
            className="absolute top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-solid transform-gpu"
            style={{
              borderColor: resolvedTheme === 'dark' ? 'rgba(120,160,255,0.2)' : 'rgba(100,140,255,0.15)',
              transformStyle: "preserve-3d"
            }}
            animate={{
              rotateZ: [360, 0],
              rotateY: [10, 0, -10, 0, 10]
            }}
            transition={{
              rotateZ: {
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              },
              rotateY: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        </motion.div>
        
        {/* Floating data points */}
        {dataPoints.map((point, i) => (
          <motion.div
            key={`floating-data-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full transform-gpu"
            style={{
              background: i % 3 === 0 
                ? resolvedTheme === 'dark' ? 'rgba(160,200,255,0.9)' : 'rgba(140,180,255,0.8)'
                : resolvedTheme === 'dark' ? 'rgba(140,180,255,0.8)' : 'rgba(120,160,255,0.7)',
              boxShadow: `0 0 5px ${resolvedTheme === 'dark' ? 'rgba(160,200,255,0.6)' : 'rgba(140,180,255,0.5)'}`,
              left: `calc(50% + ${point.x}px)`,
              top: `calc(50% + ${point.y}px)`,
              zIndex: point.y > 0 ? -1 : 15,
              transformStyle: "preserve-3d"
            }}
            animate={{
              opacity: [point.opacity, point.opacity + 0.3, point.opacity],
              y: [point.y, point.y - 10, point.y]
            }}
            transition={{
              opacity: {
                duration: point.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: point.delay
              },
              y: {
                duration: point.duration * 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: point.delay
              }
            }}
          />
        ))}
        
        {/* Company logo / branding */}
        <motion.div
          className="absolute bottom-8 w-full text-center transform-gpu"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(40px)"
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="inline-block"
          >
            <motion.div
              className="text-3xl font-bold tracking-widest"
              style={{
                background: resolvedTheme === 'dark'
                  ? 'linear-gradient(90deg, rgba(140,180,255,0.9), rgba(100,140,255,0.9))'
                  : 'linear-gradient(90deg, rgba(120,160,255,0.9), rgba(80,120,235,0.9))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `0 0 15px ${resolvedTheme === 'dark' ? 'rgba(140,180,255,0.5)' : 'rgba(120,160,255,0.4)'}`
              }}
              whileHover={{
                scale: 1.05
              }}
            >
              MEASEURMENT
            </motion.div>
            <motion.div
              className="h-0.5 mt-1"
              style={{
                background: resolvedTheme === 'dark'
                  ? 'linear-gradient(90deg, rgba(100,140,255,0.5), rgba(140,180,255,0.5), rgba(100,140,255,0.5))'
                  : 'linear-gradient(90deg, rgba(80,120,235,0.4), rgba(120,160,255,0.4), rgba(80,120,235,0.4))'
              }}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1 }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}