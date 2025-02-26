"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "@/app/layout";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { MeasurementCard } from "@/app/components/MeasurementCard";
import { MeasurementModal } from "@/app/components/MeasurementModal";
import { FormInput } from "@/app/components/FormInput";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SuccessAnimation from "@/app/components/SuccessAnimation";
import FailureAnimation from "@/app/components/FailureAnimation";
import { GradientText, Badge } from "@/app/utils/ui";
import { Info, ChevronRight, Save } from "lucide-react";

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

// Type for form data and errors
type MeasurementKey = keyof typeof measurementRanges;
interface FormData {
  [key: string]: string;
}
interface Errors {
  [key: string]: string | null;
}

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
] as const;

export default function MeasurementPage() {
  const router = useRouter();
  const { resolvedTheme } = useContext(ThemeContext);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Errors>({});
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [ebayUsername, setEbayUsername] = useState<string>("");
  
  // UI state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFailure, setShowFailure] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(Object.keys(measurementGroups)[0]);

  // Handle measurement input change
  const handleChange = (name: MeasurementKey, value: string) => {
    setFormData({ ...formData, [name]: value });
    if (value) {
      const range = measurementRanges[name];
      const numericValue = parseFloat(value);
      if (range && (numericValue < range.min || numericValue > range.max)) {
        setErrors({
          ...errors,
          [name]: `Value must be between ${range.min} and ${range.max} cm`,
        });
      } else {
        setErrors({ ...errors, [name]: null });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (Object.values(errors).some((error) => error)) {
      alert("Please correct the errors before submitting.");
      return;
    }
    
    if (!orderNumber.trim()) {
      alert("Please enter an order number.");
      return;
    }
    
    if (!ebayUsername.trim()) {
      alert("Please enter an eBay username.");
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
        setTimeout(() => {
          setShowSuccess(false);
          router.push("/");
        }, 2000);
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || "Failed to submit measurements. Please try again.");
        setShowFailure(true);
        setTimeout(() => setShowFailure(false), 2000);
      }
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError("An error occurred. Please try again.");
      setShowFailure(true);
      setTimeout(() => setShowFailure(false), 2000);
    }
  };

  // Calculate progress
  const completed = Object.values(formData).filter((value) => value).length;
  const total = measurementsList.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  // Handle modal navigation
  const handleModalNavigate = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = measurementsList.findIndex((m) => m.image === selectedImage);
    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % measurementsList.length;
      setSelectedImage(measurementsList[nextIndex].image);
    } else {
      const prevIndex = (currentIndex - 1 + measurementsList.length) % measurementsList.length;
      setSelectedImage(measurementsList[prevIndex].image);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen pb-20 pt-24 relative">
        {/* Status indicators */}
        {isSubmitting && <LoadingSpinner />}
        {showSuccess && <SuccessAnimation />}
        {showFailure && <FailureAnimation message={submitError} />}
        
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0" style={{background: 'var(--background)'}} />
          
          <div 
            className="absolute top-0 right-0 h-[40%] w-[80%] rounded-full opacity-10"
            style={{
              background: 'var(--gradient-primary)',
              filter: 'blur(140px)'
            }}
          />
          
          <div 
            className="absolute bottom-0 left-0 h-[40%] w-[60%] rounded-full opacity-10"
            style={{
              background: 'var(--gradient-secondary)',
              filter: 'blur(120px)'
            }}
          />
        </div>
        
        {/* Page header */}
        <div className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center mb-8"
          >
            <Badge variant="primary" size="md" className="mb-3">PRÄZISION</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Full Body <GradientText>Measurements</GradientText>
            </h1>
            <p className="text-foreground-secondary max-w-2xl">
              Please provide accurate measurements for your custom suit. Click on images for detailed instructions.
            </p>
          </motion.div>
          
          {/* Progress bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-foreground-secondary">{completed} of {total} completed</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            
            <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden">
              <motion.div 
                className="h-full rounded-full"
                style={{ background: 'var(--gradient-primary)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Main content */}
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-7xl mx-auto glass rounded-3xl shadow-3d overflow-hidden border border-border"
          >
            {/* Order information section */}
            <div className="p-8 border-b" style={{borderColor: 'var(--border)', background: 'var(--surface)'}}>
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Info size={18} className="mr-2 text-primary" />
                Order Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                <FormInput
                  id="order-number"
                  label="Order Number"
                  value={orderNumber}
                  onChange={setOrderNumber}
                  placeholder="Enter your order number"
                  required
                />
                
                <FormInput
                  id="ebay-username"
                  label="eBay Username"
                  value={ebayUsername}
                  onChange={setEbayUsername}
                  placeholder="Enter your eBay username"
                  required
                />
              </div>
            </div>
            
            {/* Measurements section */}
            <form onSubmit={handleSubmit} className="p-8">
              {/* Group tabs */}
              <div className="mb-8 border-b border-border">
                <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                  {Object.keys(measurementGroups).map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setActiveTab(group)}
                      className={`px-4 py-3 relative whitespace-nowrap font-medium text-sm transition-colors ${
                        activeTab === group
                          ? "text-primary"
                          : "text-foreground-secondary hover:text-foreground"
                      }`}
                    >
                      {group}
                      {activeTab === group && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Active group measurements */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {measurementGroups[activeTab].map((measurement, index) => {
                      const field = measurementsList.find((m) => m.name === measurement);
                      if (!field) return null;
                      
                      return (
                        <motion.div
                          key={field.name}
                          custom={index}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <MeasurementCard
                            name={field.name}
                            image={field.image}
                            value={formData[field.name] || ""}
                            onChange={(value) => handleChange(field.name as MeasurementKey, value)}
                            description={measurementDescriptions[field.name]}
                            min={measurementRanges[field.name].min}
                            max={measurementRanges[field.name].max}
                            error={errors[field.name]}
                            onClick={() => setSelectedImage(field.image)}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Error message */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 rounded-xl border border-error/20 bg-error/5 text-error text-center"
                >
                  {submitError}
                </motion.div>
              )}
              
              {/* Submit button */}
              <motion.div 
                className="mt-12 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-10 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ y: -5 }}
                  whileTap={{ y: 0 }}
                >
                  <span className="flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner fullScreen={false} size="sm" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Submit Measurements</span>
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
              
              {/* Navigation */}
              <div className="mt-8 flex justify-center space-x-4">
                {Object.keys(measurementGroups).map((group, index) => {
                  const isActive = activeTab === group;
                  const isCompleted = measurementGroups[group].every(
                    (measurement) => formData[measurement]
                  );
                  
                  return (
                    <motion.button
                      key={group}
                      type="button"
                      onClick={() => setActiveTab(group)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        isActive
                          ? "bg-primary scale-125"
                          : isCompleted
                          ? "bg-primary/50"
                          : "bg-foreground-secondary/30"
                      }`}
                      whileHover={{ scale: 1.2 }}
                    />
                  );
                })}
              </div>
              
              {/* Next group button */}
              {activeTab !== Object.keys(measurementGroups)[Object.keys(measurementGroups).length - 1] && (
                <div className="mt-8 flex justify-center">
                  <motion.button
                    type="button"
                    onClick={() => {
                      const groupKeys = Object.keys(measurementGroups);
                      const currentIndex = groupKeys.indexOf(activeTab);
                      if (currentIndex < groupKeys.length - 1) {
                        setActiveTab(groupKeys[currentIndex + 1]);
                      }
                    }}
                    className="flex items-center gap-1 text-primary text-sm font-medium"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span>Next group</span>
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
        
        {/* Measurement image modal */}
        <MeasurementModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          selectedImage={selectedImage || ""}
          measurements={measurementsList}
          onNavigate={handleModalNavigate}
        />
        
        {/* Custom scrollbar styles */}
        <style jsx global>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </main>
      
      <Footer />
    </>
  );
}
