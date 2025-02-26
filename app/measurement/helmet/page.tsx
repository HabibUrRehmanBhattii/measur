"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "@/app/layout";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { FormInput } from "@/app/components/FormInput";
import { MeasurementCard } from "@/app/components/MeasurementCard";
import { MeasurementModal } from "@/app/components/MeasurementModal";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SuccessAnimation from "@/app/components/SuccessAnimation";
import FailureAnimation from "@/app/components/FailureAnimation";
import { GradientText, Badge } from "@/app/utils/ui";
import { Info, Save } from "lucide-react";

// Helmet measurement types with validation ranges
const helmetMeasurements = [
  {
    name: "Kopfbreite (Head Width)",
    description: "Measure the width of your head from ear to ear.",
    image: "head_width",
    min: 10,
    max: 30,
  },
  {
    name: "Kopfumfang (Head Circumference)",
    description: "Measure around your head above the ears and eyebrows.",
    image: "head_circumference",
    min: 40,
    max: 70,
  },
];

export default function HelmetPage() {
  const router = useRouter();
  const { resolvedTheme } = useContext(ThemeContext);
  
  // Form state
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [ebayUsername, setEbayUsername] = useState<string>("");
  
  // UI state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFailure, setShowFailure] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handle measurement input change
  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    
    if (value) {
      const measurement = helmetMeasurements.find(m => m.name === name);
      if (measurement) {
        const numericValue = parseFloat(value);
        if (numericValue < measurement.min || numericValue > measurement.max) {
          setErrors({
            ...errors,
            [name]: `Value must be between ${measurement.min} and ${measurement.max} cm`,
          });
        } else {
          setErrors({ ...errors, [name]: null });
        }
      }
    } else {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (Object.values(errors).some(error => error)) {
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
    if (completedMeasurements < helmetMeasurements.length) {
      alert(`Please complete all measurements before submitting. You have completed ${completedMeasurements} of ${helmetMeasurements.length} measurements.`);
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
  };

  // Handle modal navigation
  const handleModalNavigate = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    // Toggle between the two images
    setSelectedImage(
      selectedImage === "head_width" ? "head_circumference" : "head_width"
    );
  };
  
  // Calculate progress
  const completed = Object.values(formData).filter(Boolean).length;
  const total = helmetMeasurements.length;
  const progress = (completed / total) * 100;

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
              Kopf<GradientText>messungen</GradientText>
            </h1>
            <p className="text-foreground-secondary max-w-2xl">
              Bitte messen Sie Ihren Kopf genau nach den folgenden Anweisungen für einen perfekten Helm-Sitz.
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
            className="max-w-4xl mx-auto glass rounded-3xl shadow-3d overflow-hidden border border-border"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Map through both measurements */}
                {helmetMeasurements.map((measurement, index) => (
                  <motion.div 
                    key={measurement.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
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
              
              {/* Enhanced submit button */}
              <motion.div 
                className="mt-12 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting || Object.values(errors).some(error => error) || Object.values(formData).filter(Boolean).length < helmetMeasurements.length || !orderNumber.trim() || !ebayUsername.trim()}
                  className="btn-primary px-10 py-4 rounded-xl font-bold shadow-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-md"
                  whileHover={Object.values(formData).filter(Boolean).length === helmetMeasurements.length ? { y: -5, scale: 1.05 } : {}}
                  whileTap={Object.values(formData).filter(Boolean).length === helmetMeasurements.length ? { y: 0, scale: 0.98 } : {}}
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
                {Object.values(formData).filter(Boolean).length < helmetMeasurements.length && (
                  <div className="mt-3 text-sm text-warning bg-warning/10 px-4 py-2 rounded-lg">
                    <span className="flex items-center gap-1">
                      <Info size={14} />
                      Complete all {helmetMeasurements.length} measurements to enable submission 
                      ({Object.values(formData).filter(Boolean).length}/{helmetMeasurements.length} completed)
                    </span>
                  </div>
                )}
                
                {!orderNumber.trim() && (
                  <div className="mt-2 text-sm text-warning">Order number is required</div>
                )}
                
                {!ebayUsername.trim() && (
                  <div className="mt-2 text-sm text-warning">eBay username is required</div>
                )}
              </motion.div>
            </form>
          </motion.div>
        </div>
        
        {/* Measurement image modal */}
        <MeasurementModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          selectedImage={selectedImage || ""}
          measurements={helmetMeasurements.map(m => ({ name: m.name, image: m.image }))}
          onNavigate={handleModalNavigate}
        />
      </main>
      
      <Footer />
    </>
  );
}
