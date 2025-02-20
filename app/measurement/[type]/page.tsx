"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Image from "next/image";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SuccessAnimation from "@/app/components/SuccessAnimation";
import FailureAnimation from "@/app/components/FailureAnimation";

// Measurement descriptions for tooltips
const measurementDescriptions = {
  "Gesamthöhe (Total Height)": "Stand straight with feet together and measure from the top of your head to the floor.",
  "Brustumfang (Chest Circumference)": "Measure around the fullest part of your chest, keeping the tape horizontal.",
  "Halskreis (Neck Circumference)": "Measure around the base of your neck, keeping the tape snug.",
  "Schulterbreite (Shoulder Width)": "Measure across the top of your shoulders from edge to edge.",
  "Armlänge (Arm Length)": "Measure from the shoulder tip to the wrist with your arm slightly bent.",
  "Bizepsumfang (Bicep Circumference)": "Measure around the fullest part of your bicep, flexed.",
  "Unterarmumfang (Forearm Circumference)": "Measure around the fullest part of your forearm.",
  "Rückenlänge (Back Length)": "Measure from the base of your neck to your waistline.",
  "Taillenumfang (Waist Circumference)": "Measure around your natural waistline, above the hips.",
  "Hüftumfang (Hip Circumference)": "Measure around the fullest part of your hips.",
  "Innenbeinlänge (Inseam)": "Measure from the crotch to the floor along the inside of your leg.",
  "Oberschenkelumfang (Thigh Circumference)": "Measure around the fullest part of your thigh.",
  "Kalbumfang (Calf Circumference)": "Measure around the fullest part of your calf.",
  "Reiterate (Head Width)": "Measure the width of your head above the ears.",
  "Kopfumfang (Head Circumference)": "Measure around your head above the ears and eyebrows.",
  "Fußlänge (Foot Length)": "Measure from the heel to the tip of your longest toe.",
};

// Measurement ranges for validation
const measurementRanges = {
  "Gesamthöhe (Total Height)": { min: 100, max: 250 },
  "Brustumfang (Chest Circumference)": { min: 50, max: 200 },
  "Halskreis (Neck Circumference)": { min: 20, max: 60 },
  "Schulterbreite (Shoulder Width)": { min: 30, max: 70 },
  "Armlänge (Arm Length)": { min: 40, max: 100 },
  "Bizepsumfang (Bicep Circumference)": { min: 20, max: 60 },
  "Unterarmumfang (Forearm Circumference)": { min: 15, max: 50 },
  "Rückenlänge (Back Length)": { min: 30, max: 80 },
  "Taillenumfang (Waist Circumference)": { min: 50, max: 150 },
  "Hüftumfang (Hip Circumference)": { min: 60, max: 160 },
  "Innenbeinlänge (Inseam)": { min: 50, max: 120 },
  "Oberschenkelumfang (Thigh Circumference)": { min: 30, max: 90 },
  "Kalbumfang (Calf Circumference)": { min: 20, max: 60 },
  "Reiterate (Head Width)": { min: 10, max: 30 },
  "Kopfumfang (Head Circumference)": { min: 40, max: 70 },
  "Fußlänge (Foot Length)": { min: 20, max: 40 },
};

// Measurement groups
const measurementGroups = {
  "Full Body": ["Gesamthöhe (Total Height)"],
  "Upper Body": [
    "Brustumfang (Chest Circumference)",
    "Halskreis (Neck Circumference)",
    "Schulterbreite (Shoulder Width)",
    "Armlänge (Arm Length)",
    "Bizepsumfang (Bicep Circumference)",
    "Unterarmumfang (Forearm Circumference)",
    "Rückenlänge (Back Length)",
    "Taillenumfang (Waist Circumference)",
  ],
  "Lower Body": [
    "Hüftumfang (Hip Circumference)",
    "Innenbeinlänge (Inseam)",
    "Oberschenkelumfang (Thigh Circumference)",
    "Kalbumfang (Calf Circumference)",
  ],
  "Head": ["Reiterate (Head Width)", "Kopfumfang (Head Circumference)"],
  "Feet": ["Fußlänge (Foot Length)"],
};

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
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [orderNumber, setOrderNumber] = useState("");
  const [ebayUsername, setEbayUsername] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (value) {
      const range = measurementRanges[name];
      if (range && (value < range.min || value > range.max)) {
        setErrors({ ...errors, [name]: `Value must be between ${range.min} and ${range.max} cm` });
      } else {
        setErrors({ ...errors, [name]: null });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error)) {
      alert("Please correct the errors before submitting.");
      return;
    }
    if (!confirm("Are you sure you want to submit the measurements?")) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submitMeasurement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "full-body-suit",
          orderNumber,
          ebayUsername,
          measurements: formData,
        }),
      });
      setIsSubmitting(false);
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => router.push("/"), 1000);
      } else {
        setSubmitError("Failed to submit measurements. Please try again.");
        setShowFailure(true);
        setTimeout(() => setShowFailure(false), 1500);
      }
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError("An error occurred. Please try again.");
      setShowFailure(true);
      setTimeout(() => setShowFailure(false), 1500);
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      const currentIndex = measurementsList.findIndex((m) => m.image === selectedImage);
      if (e.key === "ArrowRight") {
        const nextIndex = (currentIndex + 1) % measurementsList.length;
        setSelectedImage(measurementsList[nextIndex].image);
      } else if (e.key === "ArrowLeft") {
        const prevIndex = (currentIndex - 1 + measurementsList.length) % measurementsList.length;
        setSelectedImage(measurementsList[prevIndex].image);
      } else if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  const completed = Object.values(formData).filter((value) => value).length;
  const total = measurementsList.length;

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0f0c29] to-[#302b63]">
      {isSubmitting && <LoadingSpinner />}
      {showSuccess && <SuccessAnimation />}
      {showFailure && <FailureAnimation />}

      <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md p-4 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="mr-2">←</span> Back
          </button>
          <h1 className="text-2xl font-bold text-white">Full Body Suit Measurements</h1>
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div
          ref={containerRef}
          className="max-w-7xl mx-auto bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gray-800/50 p-6 border-b border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Order Number</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800/90 text-white focus:ring-2 focus:ring-blue-500 focus:scale-105 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">eBay Username</label>
                <input
                  type="text"
                  value={ebayUsername}
                  onChange={(e) => setEbayUsername(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800/90 text-white focus:ring-2 focus:ring-blue-500 focus:scale-105 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(completed / total) * 100}%` }}
              ></div>
            </div>
            {Object.entries(measurementGroups).map(([group, measurements]) => (
              <div key={group} className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">{group}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {measurements.map((measurement) => {
                    const field = measurementsList.find((m) => m.name === measurement);
                    return (
                      <div
                        key={field.name}
                        className="bg-gray-800/30 p-4 rounded-xl hover:bg-gray-800/50 hover:scale-105 transition-all duration-300"
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <div
                            className="relative w-24 h-24 md:w-32 md:h-32 group cursor-pointer"
                            onClick={() => setSelectedImage(field.image)}
                          >
                            <Image
                              src={`/images/${field.image}.png`}
                              alt={field.name}
                              fill
                              className="object-contain p-2 rounded-lg border border-gray-600 group-hover:border-blue-500 transition-colors"
                            />
                          </div>
                          <Tooltip text={measurementDescriptions[field.name]}>
                            <label className="text-gray-300 font-medium text-center">{field.name}</label>
                          </Tooltip>
                          <div className="w-full relative">
                            <input
                              type="number"
                              placeholder="cm"
                              value={formData[field.name] || ""}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800/90 text-white focus:ring-2 focus:ring-blue-500 focus:scale-105 transition-all duration-300"
                              required
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">cm</span>
                          </div>
                          {errors[field.name] && (
                            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {submitError && <p className="text-red-500 text-center mt-4">{submitError}</p>}
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

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setSelectedImage(null)}
        >
          <button
            onClick={() => {
              const currentIndex = measurementsList.findIndex((m) => m.image === selectedImage);
              const prevIndex = (currentIndex - 1 + measurementsList.length) % measurementsList.length;
              setSelectedImage(measurementsList[prevIndex].image);
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700"
          >
            ←
          </button>
          <Image
            src={`/images/${selectedImage}.png`}
            alt="Full-screen view"
            width={800}
            height={800}
            className="rounded-lg"
          />
          <button
            onClick={() => {
              const currentIndex = measurementsList.findIndex((m) => m.image === selectedImage);
              const nextIndex = (currentIndex + 1) % measurementsList.length;
              setSelectedImage(measurementsList[nextIndex].image);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute z-10 p-2 text-sm text-white bg-gray-800 rounded shadow-lg -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {text}
        </div>
      )}
    </div>
  );
};

export default MeasurementPage;

