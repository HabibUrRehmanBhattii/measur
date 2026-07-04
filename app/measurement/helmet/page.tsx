"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/app/components/Header";
import { FormInput } from "@/app/components/FormInput";
import { MeasurementModal } from "@/app/components/MeasurementModal";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SuccessAnimation from "@/app/components/SuccessAnimation";
import FailureAnimation from "@/app/components/FailureAnimation";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { Save, AlertTriangle } from "lucide-react";

const helmetMeasurements = [
  { name: "Head Width", description: "Measure the width of your head from ear to ear.", image: "head_width" },
  { name: "Head Circumference", description: "Measure around your head above the ears and eyebrows.", image: "head_circumference" },
];

export default function HelmetPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [ebayUsername, setEbayUsername] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFailure, setShowFailure] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filledCount = Object.values(formData).filter(Boolean).length;
  const total = helmetMeasurements.length;

  const prepareSubmit = useCallback(() => {
    if (!ebayUsername.trim()) { alert("Please enter an eBay username."); return; }
    if (filledCount === 0) { alert("Please enter at least one measurement."); return; }
    setShowConfirmDialog(true);
  }, [ebayUsername, filledCount]);

  const handleSubmit = useCallback(async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submitMeasurement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "helmet", orderNumber, ebayUsername, measurements: formData }),
      });
      setIsSubmitting(false);
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); router.push("/"); }, 2500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitError(errorData.message || "Failed to submit. Please try again.");
        setShowFailure(true);
        setTimeout(() => setShowFailure(false), 2000);
      }
    } catch {
      setIsSubmitting(false);
      setSubmitError("An error occurred. Please try again.");
      setShowFailure(true);
      setTimeout(() => setShowFailure(false), 2000);
    }
  }, [orderNumber, ebayUsername, formData, router]);

  const handleModalNavigate = useCallback((direction: "prev" | "next") => {
    if (!selectedImage) return;
    const idx = helmetMeasurements.findIndex(m => m.image === selectedImage);
    const next = direction === "next"
      ? (idx + 1) % helmetMeasurements.length
      : (idx - 1 + helmetMeasurements.length) % helmetMeasurements.length;
    setSelectedImage(helmetMeasurements[next].image);
  }, [selectedImage]);

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-16 relative">
        {isSubmitting && <LoadingSpinner />}
        {showSuccess && <SuccessAnimation message="Transmission Complete" subMessage="Data received by Imperial Command." />}
        {showFailure && <FailureAnimation message={submitError || "An error occurred"} />}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title="CONFIRM CONFIGURATION"
          message={`Confirm: ${filledCount} of ${total} measurements will be transmitted.`}
          confirmText="Confirm"
          cancelText="Abort"
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirmDialog(false)}
        />

        {/* Star field backdrop */}
        <div className="absolute inset-0 -z-10 bg-stars opacity-40" />
        <div className="absolute inset-0 -z-10" style={{ background: "var(--background)" }} />

        {/* Page header */}
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase">
              Helmet <span className="text-crawl">Configuration</span>
            </h1>
            <p className="font-data text-sm text-foreground-secondary mt-2">
              Precision measurement · {total} data points · All fields optional
            </p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">

            {/* Left: Progress */}
            <aside className="lg:sticky lg:top-24 h-fit">
              <div className="border border-[var(--border)] rounded-sm p-6 bg-[var(--surface-elevated)]">
                <div className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse-gentle" />
                  MISSION PROGRESS
                </div>
                <div className="font-data text-3xl font-bold tabular-nums text-[var(--signal)]">{filledCount}/{total}</div>
                <div className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary mt-1">DATA POINTS</div>
                <div className="mt-4 h-1 w-full bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[var(--signal)]" animate={{ width: `${(filledCount / total) * 100}%` }} transition={{ duration: 0.5 }} />
                </div>
              </div>
            </aside>

            {/* Right: Form */}
            <div className="min-w-0">
              {/* Pilot data */}
              <div className="border border-[var(--border)] rounded-sm p-6 mb-6 bg-[var(--surface-elevated)]">
                <h3 className="font-data text-xs uppercase tracking-atelier text-foreground-secondary mb-4 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--primary)]" />
                  PILOT DATA
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput id="order-number" label="Order Ref. (optional)" value={orderNumber} onChange={setOrderNumber} placeholder="e.g. FB-12345" type="text" />
                  <FormInput id="ebay-username" label="eBay Username" value={ebayUsername} onChange={setEbayUsername} placeholder="eBay username" required type="text" />
                </div>
              </div>

              {/* Measurements */}
              <div className="border border-[var(--border)] rounded-sm p-6 bg-[var(--surface-elevated)]">
                <h3 className="font-data text-xs uppercase tracking-atelier text-foreground-secondary mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)]" />
                  MEASUREMENTS · ALL OPTIONAL
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {helmetMeasurements.map((m) => (
                    <div key={m.name} className="rounded-sm border border-[var(--border)] p-5 bg-[var(--background)]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-sm bg-[var(--surface-elevated)] flex items-center justify-center cursor-pointer hover:border-[var(--primary)] border border-transparent transition-colors" onClick={() => setSelectedImage(m.image)}>
                          <img src={`/images/${m.image}.png`} alt={m.name} className="w-8 h-8 object-contain" />
                        </div>
                        <div>
                          <h4 className="font-data text-sm font-medium">{m.name}</h4>
                          <p className="font-data text-[10px] text-foreground-secondary">{m.description}</p>
                        </div>
                      </div>
                      <FormInput
                        id={`helmet-${m.name}`}
                        label="Value (optional)"
                        value={formData[m.name] || ""}
                        onChange={(v) => setFormData(prev => ({ ...prev, [m.name]: v }))}
                        placeholder="Enter measurement"
                        type="text"
                        units="cm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="mt-6 border border-[var(--border)] rounded-sm p-6 bg-[var(--surface-elevated)]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="font-data text-xs text-foreground-secondary">
                    <span className="text-foreground font-bold">{filledCount}</span>/{total} measurements · all optional
                  </div>
                  <div className="flex items-center gap-3">
                    {!ebayUsername.trim() && (
                      <span className="font-data text-[11px] text-[var(--warning)] flex items-center gap-1">
                        <AlertTriangle size={12} /> eBay Username required
                      </span>
                    )}
                    <motion.button
                      type="button"
                      onClick={prepareSubmit}
                      disabled={isSubmitting || !ebayUsername.trim()}
                      className={`px-8 py-3 rounded-sm font-data text-sm uppercase tracking-wider flex items-center gap-2 transition-all duration-300 border ${
                        filledCount === total
                          ? "bg-transparent border-[var(--signal)] text-[var(--signal)] animate-glow"
                          : "bg-[var(--gradient-primary)] border-transparent text-white"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                      whileHover={!isSubmitting && ebayUsername.trim() ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting && ebayUsername.trim() ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <><LoadingSpinner fullScreen={false} size="sm" /><span>Transmitting...</span></>
                      ) : (
                        <><Save size={16} /><span>{filledCount === total ? "Complete Configuration" : "Transmit Data"}</span></>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image enlargement modal */}
        <MeasurementModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          selectedImage={selectedImage || ""}
          measurements={helmetMeasurements.map(m => ({ name: m.name, image: m.image }))}
          onNavigate={handleModalNavigate}
        />
      </main>
    </>
  );
}
