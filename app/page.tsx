"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from 'next/link';

const HomePage = () => {
    const router = useRouter();
    const containerRef = useRef(null);
    const svgRef = useRef(null);

    const handleSelection = (selection: string) => {
        router.push(`/measurement/${selection}`);
    };

    useEffect(() => {
        // Ensure refs exist before animating
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
            );
        }

        if (svgRef.current) {
            gsap.to(svgRef.current, {
                rotate: 360,
                duration: 10,
                repeat: -1,
                ease: "linear",
            });
        }
    }, []);

    return (
        <main className="relative flex items-center justify-center min-h-screen overflow-hidden font-sans bg-gradient-to-r from-[#0f0c29] to-[#302b63]">
            <div
                ref={containerRef}
                className="container relative z-10 mx-auto p-8"
            >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Left Section */}
                    <div className="bg-gray-900/70 p-12 rounded-2xl backdrop-blur-lg shadow-2xl text-white">
                        <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                            Präzisionsmessung
                            <br />
                            <span className="text-blue-500">Neu definiert.</span>
                        </h1>
                        <p className="text-lg text-gray-300">
                            Erleben Sie die Zukunft der Körper- und Kopfmessung mit unserer wegweisenden Technologie.
                        </p>
                        <div className="mt-8 flex flex-col md:flex-row gap-4">
                            <button
                                onClick={() => handleSelection("full-body-suit")}
                                className="px-8 py-4 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors duration-300"
                            >
                                Ganzkörperanzug
                            </button>
                            <button
                                onClick={() => handleSelection("helmet")}
                                className="px-8 py-4 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-colors duration-300"
                            >
                                Helm
                            </button>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="relative w-full h-[500px] flex items-center justify-center">
                        {/* Animated SVG */}
                        <svg
                            ref={svgRef}
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
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
