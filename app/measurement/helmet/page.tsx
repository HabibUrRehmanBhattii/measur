"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Image from "next/image";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SuccessAnimation from "@/app/components/SuccessAnimation";
import FailureAnimation from "@/app/components/FailureAnimation";

const helmetMeasurements = [
    { name: "Reiterate (Head Width)", image: "head_width" },
    { name: "Kopfumfang (Head Circumference)", image: "head_circumference" },
];

const HelmetPage = () => {
    const router = useRouter();
    const containerRef = useRef(null);
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [orderNumber, setOrderNumber] = useState("");
    const [ebayUsername, setEbayUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
                    type: "helmet",
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
        <div className="bg-gradient-to-r from-[#0f0c29] to-[#302b63] min-h-screen flex items-center justify-center">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md p-4 z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <span className="mr-2">←</span> Back
                    </button>
                    <h1 className="text-2xl font-bold text-white">Helmet Measurements</h1>
                    <div className="w-24"></div>
                </div>
            </nav>

            {isSubmitting && <LoadingSpinner />}
            {showSuccess && <SuccessAnimation />}
            {showFailure && <FailureAnimation />}
            
            <div
                ref={containerRef}
                className="container mx-auto p-8 bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl mt-20"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <div>
                            <label className="block font-semibold text-gray-300 mb-2">Order Number</label>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-300 mb-2">eBay Username</label>
                            <input
                                type="text"
                                value={ebayUsername}
                                onChange={(e) => setEbayUsername(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {helmetMeasurements.map((field, index) => (
                            <div key={index} className="bg-gray-800/30 p-4 rounded-xl hover:bg-gray-800/50 transition-all duration-300">
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
                                            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-md mx-auto">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full ${
                                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                            } text-white p-4 rounded-lg font-bold focus:ring-4 focus:ring-blue-500 transition-colors`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>

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

export default HelmetPage;
