"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Image from "next/image";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SuccessAnimation from "@/app/components/SuccessAnimation";
import FailureAnimation from "@/app/components/FailureAnimation";

const measurementsList = [
    { name: "Gesamthöhe (Total Height)", image: "total_height" },
    { name: "Brustumfang (Chest Circumference)", image: "chest_circumference" },
    { name: "Halskreis (Neck Circumference)", image: "neck_circumference" },
    { name: "Schulterbreite (Shoulder Width)", image: "shoulder_width" },
    { name: "Armlänge (Arm Length)", image: "arm_length" },
    { name: "Bizepsumfang (Bicep Circumference)", image: "bicep_circumference" },
    { name: "Unterarmumfang (Forearm Circumference)", image: "forearm_circumference" },
    { name: "Rückenlänge (Back Length)", image: "back_length" },
    { name: "Taillenumfang (Waist Circumference)", image: "waist_circumference" },
    { name: "Hüftumfang (Hip Circumference)", image: "hip_circumference" },
    { name: "Innenbeinlänge (Inseam)", image: "inseam" },
    { name: "Oberschenkelumfang (Thigh Circumference)", image: "thigh_circumference" },
    { name: "Kalbumfang (Calf Circumference)", image: "calf_circumference" },
    { name: "Reiterate (Head Width)", image: "head_width" },
    { name: "Kopfumfang (Head Circumference)", image: "head_circumference" },
    { name: "Fußlänge (Foot Length)", image: "foot_length" },
];

const MeasurementPage = () => {
    const router = useRouter();
    const containerRef = useRef(null);
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [orderNumber, setOrderNumber] = useState("");
    const [ebayUsername, setEbayUsername] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch("/api/submitMeasurement", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "full-body-suit", // or "helmet"
                    orderNumber,
                    ebayUsername,
                    measurements: formData,
                }),
            });

            setIsSubmitting(false);

            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => {
                    router.push("/");
                }, 1000);
            } else {
                const error = await response.json();
                console.error("Submission error:", error);
                setShowFailure(true);
                setTimeout(() => {
                    setShowFailure(false);
                }, 1500);
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error("Error submitting data:", error);
            setShowFailure(true);
            setTimeout(() => {
                setShowFailure(false);
            }, 1500);
        }
    };

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
            );
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#0f0c29] to-[#302b63]">
            {isSubmitting && <LoadingSpinner />}
            {showSuccess && <SuccessAnimation />}
            {showFailure && <FailureAnimation />}

            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md p-4 z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <span className="mr-2">←</span> Back
                    </button>
                    <h1 className="text-2xl font-bold text-white">Full Body Suit Measurements</h1>
                    <div className="w-24"></div> {/* Spacer for alignment */}
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 pt-24 pb-12">
                <div
                    ref={containerRef}
                    className="max-w-7xl mx-auto bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Order Information Section */}
                    <div className="bg-gray-800/50 p-6 border-b border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Order Number
                                </label>
                                <input
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800/90 text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    eBay Username
                                </label>
                                <input
                                    type="text"
                                    value={ebayUsername}
                                    onChange={(e) => setEbayUsername(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800/90 text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Measurements Grid */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {measurementsList.map((field, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-800/30 p-4 rounded-xl hover:bg-gray-800/50 transition-all duration-300"
                                >
                                    <div className="flex flex-col items-center space-y-3">
                                        <div
                                            className="relative w-32 h-32 group cursor-pointer"
                                            onClick={() => setSelectedImage(field.image)}
                                        >
                                            <Image
                                                src={`/images/${field.image}.png`}
                                                alt={field.name}
                                                fill
                                                className="object-contain p-2 rounded-lg border border-gray-600 group-hover:border-blue-500 transition-colors"
                                            />
                                        </div>
                                        <label className="text-gray-300 font-medium text-center">
                                            {field.name}
                                        </label>
                                        <div className="w-full relative">
                                            <input
                                                type="number"
                                                placeholder="cm"
                                                value={formData[field.name] || ""}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800/90 text-white focus:ring-2 focus:ring-blue-500 text-center"
                                                required
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                cm
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoadingSpinner />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <span>Submit Measurements</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                    onClick={() => setSelectedImage(null)}
                >
                    <Image
                        src={`/images/${selectedImage}.png`}
                        alt="Full-screen view"
                        width={800}
                        height={800}
                        className="rounded-lg"
                    />
                </div>
            )}
        </div>
    );
};

export default MeasurementPage;
