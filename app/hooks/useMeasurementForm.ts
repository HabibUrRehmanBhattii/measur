import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/app/store';
import { MeasurementType } from '@/app/types';

interface MeasurementFormOptions {
  type: MeasurementType;
  persistKey?: string;
  validationRanges?: Record<string, { min: number; max: number }>;
}

export function useMeasurementForm(options: MeasurementFormOptions) {
  const { type, persistKey, validationRanges } = options;
  
  // Connect to global store
  const { 
    formData: storedFormData, 
    updateFormField, 
    clearFormData,
    addRecentMeasurement
  } = useStore();
  
  // Local state
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [ebayUsername, setEbayUsername] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFailure, setShowFailure] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  
  // Load stored form data on component mount
  useEffect(() => {
    if (persistKey && storedFormData[persistKey]) {
      const savedData = storedFormData[persistKey];
      if (savedData.orderNumber) setOrderNumber(savedData.orderNumber);
      if (savedData.ebayUsername) setEbayUsername(savedData.ebayUsername);
      if (savedData.measurements) setFormData(savedData.measurements);
    }
  }, [persistKey, storedFormData]);
  
  // Save form data to store when it changes
  useEffect(() => {
    if (persistKey) {
      updateFormField(persistKey, {
        orderNumber,
        ebayUsername,
        measurements: formData,
      });
    }
  }, [persistKey, orderNumber, ebayUsername, formData, updateFormField]);
  
  // Handle measurement value change
  const handleChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate value if validation ranges are provided
    if (validationRanges && value) {
      const range = validationRanges[name];
      if (range) {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue < range.min || numericValue > range.max) {
          setErrors(prev => ({
            ...prev,
            [name]: `Value must be between ${range.min} and ${range.max} cm`,
          }));
        } else {
          setErrors(prev => ({ ...prev, [name]: null }));
        }
      }
    }
  }, [validationRanges]);
  
  // Prepare submission data - validate and then show confirm dialog
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
    
    // Show confirm dialog instead of browser's native confirm
    setShowConfirmDialog(true);
  }, [errors, orderNumber, ebayUsername]);
  
  // Actual form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/submitMeasurement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          orderNumber,
          ebayUsername,
          measurements: formData,
        }),
      });
      
      setIsSubmitting(false);
      
      if (response.ok) {
        // Add to recent measurements in store
        addRecentMeasurement({
          type,
          orderNumber,
          ebayUsername
        });
        
        // Show success and reset form
        setShowSuccess(true);
        
        // Clear form data
        if (persistKey) {
          clearFormData();
        }
        
        setTimeout(() => {
          setShowSuccess(false);
          setOrderNumber("");
          setEbayUsername("");
          setFormData({});
        }, 2000);
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || "Failed to submit measurements. Please try again.");
        setShowFailure(true);
        setTimeout(() => setShowFailure(false), 2000);
      }
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError("An error occurred. Please try again.");
      setShowFailure(true);
      setTimeout(() => setShowFailure(false), 2000);
    }
  }, [
    type, 
    orderNumber, 
    ebayUsername, 
    formData, 
    errors, 
    persistKey, 
    clearFormData, 
    addRecentMeasurement
  ]);
  
  // Calculate progress with more detailed metrics
  const calculateProgress = useCallback((total: number) => {
    const completed = Object.values(formData).filter((value) => value).length;
    return total > 0 ? (completed / total) * 100 : 0;
  }, [formData]);
  
  // Get completion status for all measurement fields
  const getCompletionStatus = useCallback((measurementsList: string[]) => {
    return measurementsList.map(name => ({
      name,
      completed: !!formData[name],
      valid: !errors[name]
    }));
  }, [formData, errors]);
  
  // Reset the form
  const resetForm = useCallback(() => {
    setOrderNumber("");
    setEbayUsername("");
    setFormData({});
    setErrors({});
    setSubmitError(null);
    if (persistKey) {
      clearFormData();
    }
  }, [clearFormData, persistKey]);
  
  return {
    // Form state
    orderNumber,
    ebayUsername,
    formData,
    errors,
    isSubmitting,
    submitError,
    showSuccess,
    showFailure,
    showConfirmDialog,
    
    // Form actions
    setOrderNumber,
    setEbayUsername,
    handleChange,
    prepareSubmit,
    handleSubmit,
    calculateProgress,
    getCompletionStatus,
    resetForm,
    
    // Dialog controls
    setShowConfirmDialog,
    setShowSuccess,
    setShowFailure,
    setSubmitError,
  };
}