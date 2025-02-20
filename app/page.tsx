"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const HomePage = () => {
  const router = useRouter();
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonsRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Handle navigation
  const handleSelection = (selection) => {
    router.push(`/measurement/${selection}`);
  };

  // Toggle between dark and light themes
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Animation and client-side setup
  useEffect(() => {
    setIsClient(true);

    // Container animation
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
    }

    // Heading animation
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2 }
      );
    }

    // Paragraph animation
    if (paragraphRef.current) {
      gsap.fromTo(
        paragraphRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.4 }
      );
    }

    // Buttons animation
    if (buttonsRef.current) {
      gsap.fromTo(
        buttonsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.6 }
      );
    }

    // SVG animations: rotation and pulsing
    if (svgRef.current) {
      gsap.to(svgRef.current, {
        rotate: 360,
        duration: 10,
        repeat: -1,
        ease: "linear",
      });
      gsap.to(svgRef.current, {
        scale: 1.1,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <main
      className={`relative flex items-center justify-center min-h-screen overflow-hidden font-sans ${
        theme === "dark"
          ? "bg-gradient-to-r from-[#0f0c29] to-[#302b63]"
          : "bg-gradient-to-r from-[#f0f0f0] to-[#ffffff]"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
      >
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Background Particles (Client-Side Only) */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-20"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 5}s infinite linear`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div ref={containerRef} className="container relative z-10 mx-auto p-4 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Text Section */}
          <div
            className={`p-6 sm:p-12 rounded-2xl backdrop-blur-lg shadow-2xl ${
              theme === "dark" ? "bg-gray-900/70 text-white" : "bg-white/70 text-gray-900"
            }`}
          >
            <h1
              ref={headingRef}
              className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight leading-tight"
            >
              Präzisionsmessung
              <br />
              <span className="text-blue-500">Neu definiert.</span>
            </h1>
            <p ref={paragraphRef} className="text-base sm:text-lg text-gray-300">
              Erleben Sie die Zukunft der Körper- und Kopfmessung mit unserer wegweisenden Technologie.
            </p>
            <div
              ref={buttonsRef}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => handleSelection("full-body-suit")}
                className="px-6 py-3 sm:px-8 sm:py-4 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105"
              >
                Ganzkörperanzug
              </button>
              <button
                onClick={() => handleSelection("helmet")}
                className="px-6 py-3 sm:px-8 sm:py-4 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-colors duration-300 transform hover:scale-105"
              >
                Helm
              </button>
            </div>
          </div>

          {/* SVG Section */}
          <div className="relative w-full h-[200px] sm:h-[300px] md:h-[500px] flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
            >
              <defs>
                <linearGradient id="gradient" gradientTransform="rotate(90)">
                  <stop offset="0%" stopColor="#00C9FF" />
                  <stop offset="100%" stopColor="#92FE9D" />
                </linearGradient>
              </defs>
              <path
                d="
                  M50,0
                  C77.6,0,100,22.4,100,50
                  C100,77.6,77.6,100,50,100
                  C22.4,100,0,77.6,0,50
                  C0,22.4,22.4,0,50,0
                "
                fill="url(#gradient)"
              />
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
