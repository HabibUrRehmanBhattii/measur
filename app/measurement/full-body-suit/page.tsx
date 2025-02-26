"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { MeasurementCard } from "@/app/components/MeasurementCard";
import { MeasurementModal } from "@/app/components/MeasurementModal";
import { FormInput } from "@/app/components/FormInput";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SuccessAnimation from "@/app/components/SuccessAnimation";
import FailureAnimation from "@/app/components/FailureAnimation";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { GradientText, Badge } from "@/app/utils/ui";
import { Info, ChevronRight, Save, Check, AlertTriangle } from "lucide-react";

// Full body measurement types with validation ranges
const measurements = [
  {
    name: "Gesamthöhe (Total Height)",
    description: "Stand straight with feet together and measure from the top of your head to the floor.",
    image: "total_height",
    group: "Full Body",
    min: 100,
    max: 250,
  },
  {
    name: "Brustumfang (Chest Circumference)",
    description: "Measure around the fullest part of your chest, keeping the tape horizontal.",
    image: "chest_circumference",
    group: "Upper Body",
    min: 50,
    max: 200,
  },
  {
    name: "Halskreis (Neck Circumference)",
    description: "Measure around the base of your neck, keeping the tape snug.",
    image: "neck_circumference",
    group: "Upper Body",
    min: 20,
    max: 60,
  },
  {
    name: "Schulterbreite (Shoulder Width)",
    description: "Measure across the top of your shoulders from edge to edge.",
    image: "shoulder_width",
    group: "Upper Body",
    min: 30,
    max: 70,
  },
  {
    name: "Armlänge (Arm Length)",
    description: "Measure from the shoulder tip to the wrist with your arm slightly bent.",
    image: "arm_length",
    group: "Upper Body",
    min: 40,
    max: 100,
  },
  {
    name: "Bizepsumfang (Bicep Circumference)",
    description: "Measure around the fullest part of your bicep, flexed.",
    image: "bicep_circumference",
    group: "Upper Body",
    min: 20,
    max: 60,
  },
  {
    name: "Unterarmumfang (Forearm Circumference)",
    description: "Measure around the fullest part of your forearm.",
    image: "forearm_circumference",
    group: "Upper Body",
    min: 15,
    max: 50,
  },
  {
    name: "Rückenlänge (Back Length)",
    description: "Measure from the base of your neck to your waistline.",
    image: "back_length",
    group: "Upper Body",
    min: 30,
    max: 80,
  },
  {
    name: "Taillenumfang (Waist Circumference)",
    description: "Measure around your natural waistline, above the hips.",
    image: "waist_circumference",
    group: "Upper Body",
    min: 50,
    max: 150,
  },
  {
    name: "Hüftumfang (Hip Circumference)",
    description: "Measure around the fullest part of your hips.",
    image: "hip_circumference",
    group: "Lower Body",
    min: 60,
    max: 160,
  },
  {
    name: "Innenbeinlänge (Inseam)",
    description: "Measure from the crotch to the floor along the inside of your leg.",
    image: "inseam",
    group: "Lower Body",
    min: 50,
    max: 120,
  },
  {
    name: "Oberschenkelumfang (Thigh Circumference)",
    description: "Measure around the fullest part of your thigh.",
    image: "thigh_circumference",
    group: "Lower Body",
    min: 30,
    max: 90,
  },
  {
    name: "Kalbumfang (Calf Circumference)",
    description: "Measure around the fullest part of your calf.",
    image: "calf_circumference",
    group: "Lower Body",
    min: 20,
    max: 60,
  },
  {
    name: "Reiterate (Head Width)",
    description: "Measure the width of your head above the ears.",
    image: "head_width",
    group: "Head",
    min: 10,
    max: 30,
  },
  {
    name: "Kopfumfang (Head Circumference)",
    description: "Measure around your head above the ears and eyebrows.",
    image: "head_circumference",
    group: "Head",
    min: 40,
    max: 70,
  },
  {
    name: "Fußlänge (Foot Length)",
    description: "Measure from the heel to the tip of your longest toe.",
    image: "foot_length",
    group: "Feet",
    min: 20,
    max: 40,
  },
];

// Organize measurements by group
const measurementGroups = {
  "Full Body": measurements.filter(m => m.group === "Full Body"),
  "Upper Body": measurements.filter(m => m.group === "Upper Body"),
  "Lower Body": measurements.filter(m => m.group === "Lower Body"),
  "Head": measurements.filter(m => m.group === "Head"),
  "Feet": measurements.filter(m => m.group === "Feet"),
};

export default function FullBodySuitPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [ebayUsername, setEbayUsername] = useState<string>("");
  
  // UI state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFailure, setShowFailure] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Full Body");
  
  // Load saved values from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('full-body-suit-measurements');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.orderNumber) setOrderNumber(parsed.orderNumber);
        if (parsed.ebayUsername) setEbayUsername(parsed.ebayUsername);
        if (parsed.measurements) setFormData(parsed.measurements);
      } catch (e) {
        console.error('Error loading saved measurements', e);
      }
    }
  }, []);
  
  // Save values to localStorage when they change
  useEffect(() => {
    localStorage.setItem('full-body-suit-measurements', JSON.stringify({
      orderNumber,
      ebayUsername,
      measurements: formData
    }));
  }, [orderNumber, ebayUsername, formData]);
  
  // Handle measurement input change
  const handleChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (value) {
      const measurement = measurements.find(m => m.name === name);
      if (measurement) {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue < measurement.min || numericValue > measurement.max) {
          setErrors(prev => ({
            ...prev,
            [name]: `Value must be between ${measurement.min} and ${measurement.max} cm`,
          }));
        } else {
          setErrors(prev => ({ ...prev, [name]: null }));
        }
      }
    } else {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, []);
  
  // Prepare submission data
  const prepareSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
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
    
    const completedMeasurements = Object.values(formData).filter(Boolean).length;
    if (completedMeasurements < measurements.length) {
      alert(`Please complete all measurements before submitting. You have completed ${completedMeasurements} of ${measurements.length} measurements.`);
      return;
    }
    
    // Show confirm dialog
    setShowConfirmDialog(true);
  }, [errors, orderNumber, ebayUsername, formData, measurements.length]);
  
  // Actual form submission
  const handleSubmit = useCallback(async () => {
    setShowConfirmDialog(false);
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
        // Clear saved data
        localStorage.removeItem('full-body-suit-measurements');
        
        // Show success
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.push("/");
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
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
  }, [orderNumber, ebayUsername, formData, router]);
  
  // Handle modal navigation
  const handleModalNavigate = useCallback((direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = measurements.findIndex((m) => m.image === selectedImage);
    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % measurements.length;
      setSelectedImage(measurements[nextIndex].image);
    } else {
      const prevIndex = (currentIndex - 1 + measurements.length) % measurements.length;
      setSelectedImage(measurements[prevIndex].image);
    }
  }, [selectedImage, measurements]);
  
  // Calculate progress
  const completed = Object.values(formData).filter(Boolean).length;
  const total = measurements.length;
  const progress = (completed / total) * 100;
  
  // Calculate group completion
  const groupCompletion = Object.entries(measurementGroups).reduce((acc, [group, items]) => {
    const groupTotal = items.length;
    const groupCompleted = items.filter(item => !!formData[item.name]).length;
    const percentage = groupTotal > 0 ? (groupCompleted / groupTotal) * 100 : 0;
    
    acc[group] = {
      total: groupTotal,
      completed: groupCompleted,
      percentage
    };
    
    return acc;
  }, {} as Record<string, { total: number; completed: number; percentage: number }>);

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
        {showSuccess && <SuccessAnimation message="Measurements Submitted!" />}
        {showFailure && <FailureAnimation message={submitError || "An error occurred"} />}
        
        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title="Submit Measurements"
          message={`You are about to submit ${completed} of ${total} measurements. This action cannot be undone.`}
          confirmText="Yes, Submit"
          cancelText="Cancel"
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirmDialog(false)}
        />
        
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
          
          {/* Enhanced Progress bar with detailed tracking */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-foreground-secondary font-medium">
                <strong className="text-primary">{completed}</strong> of <strong>{total}</strong> completed
              </span>
              <span className="font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            
            <div className="h-3 w-full bg-surface-secondary rounded-full overflow-hidden mb-3">
              <motion.div 
                className="h-full rounded-full"
                style={{ background: 'var(--gradient-primary)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {/* Measurement completion indicators */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              {measurements.map((measurement, idx) => (
                <motion.div
                  key={measurement.name}
                  className={`h-1.5 rounded-full ${
                    formData[measurement.name] ? 'bg-primary' : 'bg-surface-secondary'
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.02 }}
                />
              ))}
            </div>
            
            {/* Progress guidance */}
            <div className="text-xs text-foreground-secondary/80 text-center">
              <span className="inline-block px-3 py-1 bg-surface rounded-full">
                {completed === total ? (
                  <span className="text-success font-medium">All {total} measurements completed! Ready to submit.</span>
                ) : completed > total/2 ? (
                  <span>Almost there! Complete the remaining measurements before submitting.</span>
                ) : (
                  <span>Please complete all {total} measurements before submitting.</span>
                )}
              </span>
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
            <form onSubmit={prepareSubmit} className="p-8">
              {/* Group tabs */}
              <div className="mb-8 border-b border-border">
                <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                  {Object.keys(measurementGroups).map((group) => (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setActiveTab(group)}
                      className={`px-4 py-3 relative whitespace-nowrap font-medium text-sm transition-colors flex items-center ${
                        activeTab === group
                          ? "text-primary"
                          : "text-foreground-secondary hover:text-foreground"
                      }`}
                    >
                      {group}
                      {groupCompletion[group]?.completed === groupCompletion[group]?.total && (
                        <span className="ml-1 text-success"><Check size={14} /></span>
                      )}
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
                    {measurementGroups[activeTab].map((measurement, index) => (
                      <motion.div
                        key={measurement.name}
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <MeasurementCard
                          name={measurement.name}
                          image={measurement.image}
                          value={formData[measurement.name] || ""}
                          onChange={(value) => handleChange(measurement.name, value)}
                          description={measurement.description}
                          min={measurement.min}
                          max={measurement.max}
                          error={errors[measurement.name]}
                          onClick={() => setSelectedImage(measurement.image)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Total measurement summary without submit button */}
              <div className="mt-8 bg-surface-secondary/30 rounded-xl p-4 border border-border">
                <h3 className="text-lg font-medium mb-3 text-center">Measurement Submission Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-surface p-3 rounded-lg">
                    <div className="text-sm text-foreground-secondary mb-1">Order Number</div>
                    <div className="font-medium">{orderNumber || "Not provided"}</div>
                  </div>
                  
                  <div className="bg-surface p-3 rounded-lg">
                    <div className="text-sm text-foreground-secondary mb-1">eBay Username</div>
                    <div className="font-medium">{ebayUsername || "Not provided"}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Measurement Completion: {completed}/{total}</div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(groupCompletion).map(([group, stats]) => (
                      <div key={group} className="bg-surface p-2 rounded-lg text-center">
                        <div className="text-xs text-foreground-secondary mb-1">{group}</div>
                        <div className="h-1.5 bg-surface-secondary rounded-full mb-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              stats.percentage === 100 ? 'bg-success' : 'bg-primary'
                            }`}
                            style={{ width: `${stats.percentage}%` }} 
                          />
                        </div>
                        <div className="text-xs font-medium">
                          {stats.completed}/{stats.total}
                          {stats.percentage === 100 && (
                            <span className="ml-1 text-success"><Check size={10} /></span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Validation status */}
                <div className="bg-surface p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Submission Status</div>
                    {completed === total ? (
                      <span className="text-xs font-medium bg-success/20 text-success px-2 py-0.5 rounded-full flex items-center">
                        <Check size={12} className="mr-1" />
                        Ready to Submit
                      </span>
                    ) : (
                      <span className="text-xs font-medium bg-warning/20 text-warning px-2 py-0.5 rounded-full flex items-center">
                        <AlertTriangle size={12} className="mr-1" />
                        Incomplete ({total - completed} remaining)
                      </span>
                    )}
                  </div>
                  
                  {completed < total && (
                    <div className="text-xs text-warning">
                      Please complete all measurements before submitting for best results.
                    </div>
                  )}
                  
                  {Object.values(errors).some(error => error) && (
                    <div className="text-xs text-error mt-1">
                      Please correct the measurement errors before submitting.
                    </div>
                  )}
                </div>
              </div>
              
              {/* Enhanced next group navigation */}
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
                    className="btn-primary px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2"
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ y: 0, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <span>Continue to {(() => {
                      const groupKeys = Object.keys(measurementGroups);
                      const currentIndex = groupKeys.indexOf(activeTab);
                      return currentIndex < groupKeys.length - 1 ? groupKeys[currentIndex + 1] : "";
                    })()}</span>
                    <ChevronRight size={18} />
                  </motion.button>
                </div>
              )}
              
              {/* Enhanced submit button in Feet section */}
              {activeTab === "Feet" && (
                <div className="mt-10 flex flex-col items-center">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || Object.values(errors).some(error => error) || Object.values(formData).filter(Boolean).length < measurements.length || !orderNumber.trim() || !ebayUsername.trim()}
                    className="btn-primary px-10 py-4 rounded-xl font-bold shadow-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={Object.values(formData).filter(Boolean).length === measurements.length ? { y: -5, scale: 1.05 } : {}}
                    whileTap={Object.values(formData).filter(Boolean).length === measurements.length ? { y: 0, scale: 0.98 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <span className="flex items-center gap-3 justify-center">
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner fullScreen={false} size="sm" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Save size={20} strokeWidth={2} />
                          <span>SUBMIT ALL MEASUREMENTS</span>
                        </>
                      )}
                    </span>
                  </motion.button>
                  
                  {/* Submit status message */}
                  {Object.values(formData).filter(Boolean).length < measurements.length && (
                    <div className="mt-3 text-sm text-warning bg-warning/10 px-4 py-2 rounded-lg">
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={14} />
                        Complete all {measurements.length} measurements to enable submission 
                        ({Object.values(formData).filter(Boolean).length}/{measurements.length} completed)
                      </span>
                    </div>
                  )}
                  
                  {!orderNumber.trim() && (
                    <div className="mt-2 text-sm text-warning">Order number is required</div>
                  )}
                  
                  {!ebayUsername.trim() && (
                    <div className="mt-2 text-sm text-warning">eBay username is required</div>
                  )}
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
          measurements={measurements.map(m => ({ name: m.name, image: m.image }))}
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