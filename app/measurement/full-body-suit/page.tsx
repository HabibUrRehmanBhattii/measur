"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/app/components/Header";
import { MeasurementCard } from "@/app/components/MeasurementCard";
import { MeasurementModal } from "@/app/components/MeasurementModal";
import { FormInput } from "@/app/components/FormInput";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SuccessAnimation from "@/app/components/SuccessAnimation";
import FailureAnimation from "@/app/components/FailureAnimation";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { Check, AlertTriangle, ChevronRight, ChevronLeft, Save } from "lucide-react";

/* ── measurement definitions ── */
const measurements = [
  { name: "Geschlecht", description: "Wählen Sie Ihr Geschlecht für die passende Passform.", image: null, group: "general" },
  { name: "Brustumfang", description: "Messen Sie den Umfang der vollsten Partie Ihrer Brust, horizontal geführt.", image: "chest_circumference", group: "upper" },
  { name: "Halskreis", description: "Messen Sie um die Basis Ihres Halses, straff geführt.", image: "neck_circumference", group: "upper" },
  { name: "Schulterbreite", description: "Messen Sie die Breite Ihrer Schultern von Kante zu Kante.", image: "shoulder_width", group: "upper" },
  { name: "Armlänge", description: "Messen Sie von der Schulterspitze zum Gelenk, leicht gebeugt.", image: "arm_length", group: "upper" },
  { name: "Bizepsumfang", description: "Messen Sie den vollsten Teil Ihres Bizeps, angespannt.", image: "bicep_circumference", group: "upper" },
  { name: "Unterarmumfang", description: "Messen Sie den vollsten Teil Ihres Unterarms.", image: "forearm_circumference", group: "upper" },
  { name: "Rückenlänge", description: "Messen Sie von der Halsbasis bis zur Taille.", image: "back_length", group: "upper" },
  { name: "Taillenumfang", description: "Messen Sie um Ihre natürliche Taille, oberhalb der Hüften.", image: "Taillenumfang", group: "middle" },
  { name: "Hüftumfang", description: "Messen Sie den vollsten Teil Ihrer Hüften.", image: "hip_circumference", group: "lower" },
  { name: "Innenbeinlänge", description: "Messen Sie von der Leiste bis zum Boden an der Innenseite des Beins.", image: "inseam", group: "lower" },
  { name: "Oberschenkelumfang", description: "Messen Sie den vollsten Teil Ihres Oberschenkels.", image: "thigh_circumference", group: "lower" },
  { name: "Kalbumfang", description: "Messen Sie den vollsten Teil Ihrer Wade.", image: "calf_circumference", group: "lower" },
  { name: "Kopfbreite", description: "Messen Sie die Breite Ihres Kopfes oberhalb der Ohren.", image: "head_width", group: "head" },
  { name: "Kopfumfang", description: "Messen Sie um Ihren Kopf oberhalb der Ohren und Augenbrauen.", image: "head_circumference", group: "head" },
  { name: "Fußlänge", description: "Messen Sie von der Ferse bis zur Spitze Ihres längsten Zehs.", image: "foot_length", group: "feet" },
  { name: "Gesamthöhe", description: "Messen Sie aufrecht stehend von der Kopfspitze bis zum Boden.", image: "total_height", group: "general" },
];

const groupOrder = ["general", "upper", "middle", "lower", "head", "feet"] as const;
const groupLabels: Record<string, string> = {
  general: "ALLGEMEIN",
  upper: "OBERKÖRPER",
  middle: "MITTELTEIL",
  lower: "UNTERKÖRPER",
  head: "KOPF",
  feet: "FÜßE"
};

const measurementGroups = groupOrder.reduce((acc, key) => {
  acc[key] = measurements.filter(m => m.group === key);
  return acc;
}, {} as Record<string, typeof measurements>);

/* ── circular progress ring ── */
function ProgressRing({ radius = 36, stroke = 4, progress }: { radius?: number; stroke?: number; progress: number }) {
  const normalizedRadius = radius - stroke;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg width={radius * 2} height={radius * 2} className="transform -rotate-90">
      <circle cx={radius} cy={radius} r={normalizedRadius} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <motion.circle
        cx={radius} cy={radius} r={normalizedRadius} fill="none"
        stroke={progress === 100 ? "var(--signal)" : "var(--primary)"}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circumference}
        initial={false}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ── vertical telemetry stepper ── */
function TelemetryStepper({ groups, active, completedMap, onSelect }: {
  groups: string[]; active: string; completedMap: Record<string, number>; onSelect: (g: string) => void;
}) {
  return (
    <div className="space-y-1">
      {groups.map((group, idx) => {
        const isActive = group === active;
        const isComplete = completedMap[group] === measurementGroups[group].length;
        return (
          <button
            key={group}
            type="button"
            onClick={() => onSelect(group)}
            className="w-full flex items-center gap-4 py-3 px-3 rounded-sm transition-colors duration-200 group text-left"
          >
            {/* Step indicator */}
            <div className="relative flex-shrink-0">
              <div className={`w-8 h-8 rounded-sm border flex items-center justify-center font-data text-xs transition-all duration-300 ${
                isActive ? "border-[var(--signal)] bg-[var(--signal)]/10 text-[var(--signal)]" :
                isComplete ? "border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]" :
                "border-[var(--border)] text-foreground-secondary"
              }`}>
                {isComplete ? <Check size={14} /> : <span>{String(idx + 1).padStart(2, "0")}</span>}
              </div>
              {/* Connector line */}
              {idx < groups.length - 1 && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 w-px h-3 bg-[var(--border)]" />
              )}
            </div>
            {/* Label */}
            <div className="flex-1 min-w-0">
              <div className={`font-data text-xs uppercase tracking-atelier truncate transition-colors duration-200 ${
                isActive ? "text-foreground" : "text-foreground-secondary"
              }`}>
                {groupLabels[group]}
              </div>
              <div className="font-data text-[10px] text-foreground-secondary/50 mt-0.5">
                {completedMap[group]}/{measurementGroups[group].length}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── main page ── */
export default function FullBodySuitPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [ebayUsername, setEbayUsername] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFailure, setShowFailure] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string>("general");

  // Load / persist
  useEffect(() => {
    const saved = localStorage.getItem("full-body-suit-measurements");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.orderNumber) setOrderNumber(p.orderNumber);
        if (p.ebayUsername) setEbayUsername(p.ebayUsername);
        if (p.measurements) setFormData(p.measurements);
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("full-body-suit-measurements", JSON.stringify({ orderNumber, ebayUsername, measurements: formData }));
  }, [orderNumber, ebayUsername, formData]);

  const handleChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const filledCount = Object.values(formData).filter(Boolean).length;
  const total = measurements.length;
  const progress = total > 0 ? (filledCount / total) * 100 : 0;
  const isComplete = filledCount === total;

  const completedMap = groupOrder.reduce((acc, key) => {
    acc[key] = measurements.filter(m => m.group === key && formData[m.name]).length;
    return acc;
  }, {} as Record<string, number>);

  const prepareSubmit = useCallback(() => {
    if (Object.values(errors).some(e => e)) { alert("Please correct the errors before submitting."); return; }
    if (!ebayUsername.trim()) { alert("Please enter an eBay username."); return; }
    if (filledCount === 0) { alert("Please enter at least one measurement before submitting."); return; }
    setShowConfirmDialog(true);
  }, [errors, orderNumber, ebayUsername, filledCount]);

  const handleSubmit = useCallback(async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submitMeasurement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "full-body-suit", orderNumber, ebayUsername, measurements: formData }),
      });
      setIsSubmitting(false);
      if (response.ok) {
        localStorage.removeItem("full-body-suit-measurements");
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
    const idx = measurements.findIndex(m => m.image === selectedImage);
    const next = direction === "next" ? (idx + 1) % measurements.length : (idx - 1 + measurements.length) % measurements.length;
    setSelectedImage(measurements[next].image);
  }, [selectedImage]);

  const goNextGroup = () => { const i = groupOrder.indexOf(activeGroup as any); if (i < groupOrder.length - 1) setActiveGroup(groupOrder[i + 1]); };
  const goPrevGroup = () => { const i = groupOrder.indexOf(activeGroup as any); if (i > 0) setActiveGroup(groupOrder[i - 1]); };

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-16 relative">
        {isSubmitting && <LoadingSpinner />}
        {showSuccess && <SuccessAnimation message="Transmission Complete" subMessage="Data received by Imperial Command." />}
        {showFailure && <FailureAnimation message={submitError || "Ein Fehler ist aufgetreten"} />}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title="CONFIRM CONFIGURATION"
          message={`Bestätigen: ${filledCount} von ${total} Messwerte übertragen.`}
          confirmText="Confirm"
          cancelText="Abort"
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirmDialog(false)}
        />

        {/* Page header */}
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase">
              Ganzkörperanzug <span className="text-crawl">Konfiguration</span>
            </h1>
            <p className="font-data text-sm text-foreground-secondary mt-2">
              Präzisionsmessung · 16 Datenfelder · Millimetergenau
            </p>
          </motion.div>
        </div>

        {/* Split layout: stepper + form */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">

            {/* ── Left: Telemetry Stepper (desktop) / Progress bar (mobile) ── */}
            <aside className="lg:sticky lg:top-24 h-fit">
              {/* Mobile: horizontal progress */}
              <div className="lg:hidden mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <ProgressRing progress={progress} radius={32} stroke={3} />
                  <div>
                    <div className="font-data text-2xl font-bold tabular-nums">{Math.round(progress)}%</div>
                    <div className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary">{filledCount}/{total} Felder</div>
                  </div>
                </div>
                <div className="h-1 w-full bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[var(--signal)]" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                </div>
              </div>

              {/* Desktop: vertical stepper */}
              <div className="hidden lg:block border border-[var(--border)] rounded-sm p-4 bg-[var(--surface-elevated)]">
                <div className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse-gentle" />
                  TELEMETRY
                </div>
                <TelemetryStepper groups={[...groupOrder]} active={activeGroup} completedMap={completedMap} onSelect={setActiveGroup} />

                {/* Progress ring at bottom of stepper */}
                <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center gap-4">
                  <ProgressRing progress={progress} radius={36} stroke={4} />
                  <div>
                    <div className="font-data text-xs uppercase tracking-atelier text-foreground-secondary">PROGRESS</div>
                    <div className="font-data text-lg font-bold tabular-nums">{Math.round(progress)}%</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Right: Form content ── */}
            <div className="min-w-0">
              {/* Order info */}
              <div className="border border-[var(--border)] rounded-sm p-6 mb-6 bg-[var(--surface-elevated)]">
                <h3 className="font-data text-xs uppercase tracking-atelier text-foreground-secondary mb-4 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--primary)]" />
                  PILOTEN-DATEN
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput id="order-number" label="Bestell-Nr. (optional)" value={orderNumber} onChange={setOrderNumber} placeholder="z.B. FB-12345" />
                  <FormInput id="ebay-username" label="eBay-Benutzername" value={ebayUsername} onChange={setEbayUsername} placeholder="eBay Benutzername" required />
                </div>

                {/* Gender selection */}
                <div className="mt-6">
                  <label className="block text-xs uppercase tracking-wider text-foreground-secondary font-data mb-2">Geschlecht</label>
                  <div className="flex gap-3">
                    {["Männlich", "Weiblich"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, Geschlecht: g }))}
                        className={`flex-1 py-3 rounded-sm font-data text-sm uppercase tracking-wider border transition-all duration-200 ${
                          formData.Geschlecht === g
                            ? "border-[var(--signal)] bg-[var(--signal)]/10 text-[var(--signal)]"
                            : "border-[var(--border)] text-foreground-secondary hover:border-[var(--border-strong)]"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active group fields */}
              <div className="border border-[var(--border)] rounded-sm p-6 bg-[var(--surface-elevated)]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-data text-xs uppercase tracking-atelier text-foreground-secondary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)]" />
                    {groupLabels[activeGroup]} · {completedMap[activeGroup]}/{measurementGroups[activeGroup].length}
                  </h3>
                  <div className="flex gap-2">
                    {groupOrder.indexOf(activeGroup as any) > 0 && (
                      <button type="button" onClick={goPrevGroup} className="p-2 rounded-sm border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors">
                        <ChevronLeft size={16} />
                      </button>
                    )}
                    {groupOrder.indexOf(activeGroup as any) < groupOrder.length - 1 && (
                      <button type="button" onClick={goNextGroup} className="p-2 rounded-sm border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors">
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeGroup}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    {measurementGroups[activeGroup].filter(mm => mm.image).map((measurement) => {
                      const stepNum = measurements.findIndex(mm => mm.name === measurement.name) + 1;
                      return (
                        <div key={measurement.name} className="relative">
                          <div className="absolute top-3 left-3 w-8 h-8 rounded-sm bg-[var(--signal)]/20 border border-[var(--signal)]/40 flex items-center justify-center z-10">
                            <span className="font-data text-xs font-bold text-[var(--signal)]">{String(stepNum).padStart(2, "0")}</span>
                          </div>
                          <MeasurementCard
                            name={measurement.name}
                            image={measurement.image!}
                            value={formData[measurement.name] || ""}
                            onChange={(v) => handleChange(measurement.name, v)}
                            description={measurement.description}
                            error={errors[measurement.name]}
                            onClick={() => setSelectedImage(measurement.image!)}
                          />
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Submit section */}
              <div className="mt-6 border border-[var(--border)] rounded-sm p-6 bg-[var(--surface-elevated)]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="font-data text-xs text-foreground-secondary">
                    <span className="text-foreground font-bold">{filledCount}</span>/{total} Messwerte
                    {filledCount < total && <span className="text-foreground-secondary/60"> — optional verbleibend</span>}
                  </div>

                  <div className="flex items-center gap-3">
                    {!ebayUsername.trim() && (
                      <span className="font-data text-[11px] text-[var(--warning)] flex items-center gap-1">
                        <AlertTriangle size={12} /> eBay-Benutzername erforderlich
                      </span>
                    )}
                    <motion.button
                      type="button"
                      onClick={prepareSubmit}
                      disabled={isSubmitting || !!Object.values(errors).some(e => e) || !ebayUsername.trim()}
                      className={`px-8 py-3 rounded-sm font-data text-sm uppercase tracking-wider flex items-center gap-2 transition-all duration-300 border ${
                        isComplete
                          ? "bg-transparent border-[var(--signal)] text-[var(--signal)] animate-glow"
                          : "bg-[var(--gradient-primary)] border-transparent text-white"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                      whileHover={!isSubmitting && ebayUsername.trim() ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting && ebayUsername.trim() ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <><LoadingSpinner fullScreen={false} size="sm" /><span>Übertrage...</span></>
                      ) : (
                        <><Save size={16} /><span>{isComplete ? "Konfiguration abschließen" : "Daten senden"}</span></>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MeasurementModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          selectedImage={selectedImage || ""}
          measurements={measurements.map(m => ({ name: m.name, image: m.image }))}
          onNavigate={handleModalNavigate}
        />
      </main>
    </>
  );
}
