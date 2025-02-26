"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMeasurementForm } from "@/app/hooks/useMeasurementForm";
import { FormInput } from "@/app/components/FormInput";
import { MeasurementCard } from "@/app/components/MeasurementCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SuccessAnimation from "@/app/components/SuccessAnimation";
import FailureAnimation from "@/app/components/FailureAnimation";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { Save } from "lucide-react";
import { MeasurementType } from "@/app/types";

interface MeasurementFormProps {
  type: MeasurementType;
  measurementsList: {
    name: string;
    image: string;
  }[];
  measurementRanges: Record<string, { min: number; max: number }>;
  activeTab: string;
  measurementGroups: Record<string, string[]>;
  setSelectedImage: (image: string | null) => void;
}

export function MeasurementForm({
  type,
  measurementsList,
  measurementRanges,
  activeTab,
  measurementGroups,
  setSelectedImage,
}: MeasurementFormProps) {
  const router = useRouter();
  
  // Use our custom form hook
  const {
    orderNumber,
    ebayUsername,
    formData,
    errors,
    isSubmitting,
    submitError,
    showSuccess,
    showFailure,
    showConfirmDialog,
    
    setOrderNumber,
    setEbayUsername,
    handleChange,
    prepareSubmit,
    handleSubmit,
    calculateProgress,
    
    setShowConfirmDialog,
    setShowSuccess,
    setShowFailure,
  } = useMeasurementForm({
    type,
    persistKey: `measurements-${type}`,
    validationRanges: measurementRanges,
  });
  
  // Calculate progress
  const progress = calculateProgress(measurementsList.length);
  
  return (
    <>
      {/* Status indicators */}
      {isSubmitting && <LoadingSpinner />}
      
      {showSuccess && (
        <SuccessAnimation 
          message="Measurement Submitted!"
          subMessage="Your measurements have been recorded successfully."
          redirectText="Back to Home"
          onRedirect={() => {
            setShowSuccess(false);
            router.push("/");
          }}
        />
      )}
      
      {showFailure && <FailureAnimation message={submitError} />}
      
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Submit Measurements"
        message="Are you sure you want to submit these measurements? This action cannot be undone."
        confirmText="Yes, Submit"
        cancelText="Cancel"
        onConfirm={handleSubmit}
        onCancel={() => setShowConfirmDialog(false)}
      />
        
      {/* Form */}
      <form onSubmit={prepareSubmit} className="p-8">
        {/* Order information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mb-8">
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
        
        {/* Enhanced Progress bar with detailed tracking */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-foreground-secondary font-medium">
              <strong className="text-primary">{Object.values(formData).filter(Boolean).length}</strong> of <strong>{measurementsList.length}</strong> completed
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
            {measurementsList.map((measurement, idx) => (
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
              {Object.values(formData).filter(Boolean).length === measurementsList.length ? (
                <span className="text-success font-medium">All {measurementsList.length} measurements completed! Ready to submit.</span>
              ) : Object.values(formData).filter(Boolean).length > measurementsList.length/2 ? (
                <span>Almost there! Complete the remaining measurements before submitting.</span>
              ) : (
                <span>Please complete all {measurementsList.length} measurements before submitting.</span>
              )}
            </span>
          </div>
        </div>
        
        {/* Actual measurement fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {measurementGroups[activeTab]?.map((measurement) => {
            const field = measurementsList.find((m) => m.name === measurement);
            if (!field) return null;
            
            return (
              <MeasurementCard 
                key={field.name}
                name={field.name}
                image={field.image}
                value={formData[field.name] || ""}
                onChange={(value) => handleChange(field.name, value)}
                error={errors[field.name]}
                min={measurementRanges[field.name]?.min}
                max={measurementRanges[field.name]?.max}
                onClick={() => setSelectedImage(field.image)}
              />
            );
          })}
        </div>
        
        {/* Total measurement summary and submit button */}
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
            <div className="text-sm font-medium mb-2">Measurement Completion: {Object.values(formData).filter(Boolean).length}/{measurementsList.length}</div>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(measurementGroups).map(group => {
                const groupFields = measurementGroups[group] || [];
                const filledCount = groupFields.filter(name => formData[name]).length;
                const percentage = groupFields.length > 0 ? (filledCount / groupFields.length) * 100 : 0;
                
                return (
                  <div key={group} className="bg-surface p-2 rounded-lg text-center">
                    <div className="text-xs text-foreground-secondary mb-1">{group}</div>
                    <div className="h-1.5 bg-surface-secondary rounded-full mb-1 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-primary" 
                        style={{ width: `${percentage}%` }} 
                      />
                    </div>
                    <div className="text-xs font-medium">{filledCount}/{groupFields.length}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Validation status */}
          <div className="bg-surface p-3 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Submission Status</div>
              {Object.values(formData).filter(Boolean).length === measurementsList.length ? (
                <span className="text-xs font-medium bg-success/20 text-success px-2 py-0.5 rounded-full">
                  Ready to Submit
                </span>
              ) : (
                <span className="text-xs font-medium bg-warning/20 text-warning px-2 py-0.5 rounded-full">
                  Incomplete ({measurementsList.length - Object.values(formData).filter(Boolean).length} remaining)
                </span>
              )}
            </div>
            
            {Object.values(formData).filter(Boolean).length < measurementsList.length && (
              <div className="text-xs text-warning">
                Please complete all measurements before submitting.
              </div>
            )}
            
            {Object.values(errors).some(error => error) && (
              <div className="text-xs text-error mt-1">
                Please correct the measurement errors before submitting.
              </div>
            )}
          </div>
        
          {/* Submit button */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting || Object.values(formData).filter(Boolean).length < measurementsList.length}
              className="btn-primary px-10 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              whileHover={{ y: -5 }}
              whileTap={{ y: 0 }}
            >
              <span className="flex items-center gap-2 justify-center">
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
        </div>
      </form>
    </>
  );
}