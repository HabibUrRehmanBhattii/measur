"use client";

import { useState, useCallback, useEffect } from "react";
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
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/lib/translations";
import { suitFields, fieldGroups, groupLabels, FieldGroup } from "@/app/lib/measurements";
import { Check, AlertTriangle, ChevronRight, ChevronLeft, Save } from "lucide-react";

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

/* ── main page ── */
export default function FullBodySuitPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations.measurement[lang];
  const labels = groupLabels[lang];

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [ebayUsername, setEbayUsername] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFailure, setShowFailure] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<FieldGroup>("general");

  // Load / persist
  useEffect(() => {
    try {
      const saved = localStorage.getItem("full-body-suit-measurements");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.orderNumber) setOrderNumber(p.orderNumber);
        if (p.ebayUsername) setEbayUsername(p.ebayUsername);
        if (p.measurements) setFormData(p.measurements);
      }
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("full-body-suit-measurements", JSON.stringify({ orderNumber, ebayUsername, measurements: formData }));
  }, [orderNumber, ebayUsername, formData]);

  const handleChange = useCallback((key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const filledCount = Object.values(formData).filter(Boolean).length;
  const total = suitFields.length;
  const progress = total > 0 ? (filledCount / total) * 100 : 0;
  const isComplete = filledCount === total;

  const groupFields = (g: FieldGroup) => suitFields.filter(m => m.group === g);

  const completedMap = fieldGroups.reduce((acc, key) => {
    acc[key] = suitFields.filter(m => m.group === key && formData[m.key]).length;
    return acc;
  }, {} as Record<string, number>);

  const prepareSubmit = useCallback(() => {
    if (!ebayUsername.trim()) { alert(t.needEbay); return; }
    if (filledCount === 0) { alert(t.fillAll); return; }
    setShowConfirmDialog(true);
  }, [ebayUsername, filledCount, t]);

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
        setSubmitError(errorData.message || t.errorMsg);
        setShowFailure(true);
        setTimeout(() => setShowFailure(false), 2000);
      }
    } catch {
      setIsSubmitting(false);
      setSubmitError(t.errorMsg);
      setShowFailure(true);
      setTimeout(() => setShowFailure(false), 2000);
    }
  }, [orderNumber, ebayUsername, formData, router, t]);

  const handleModalNavigate = useCallback((direction: "prev" | "next") => {
    if (!selectedImage) return;
    const idx = suitFields.findIndex(m => m.image[lang] === selectedImage);
    const next = direction === "next" ? (idx + 1) % suitFields.length : (idx - 1 + suitFields.length) % suitFields.length;
    setSelectedImage(suitFields[next].image[lang]);
  }, [selectedImage, lang]);

  const goNextGroup = () => { const i = fieldGroups.indexOf(activeGroup); if (i < fieldGroups.length - 1) setActiveGroup(fieldGroups[i + 1]); };
  const goPrevGroup = () => { const i = fieldGroups.indexOf(activeGroup); if (i > 0) setActiveGroup(fieldGroups[i - 1]); };

  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-16 relative">
        {isSubmitting && <LoadingSpinner />}
        {showSuccess && <SuccessAnimation message={t.successMsg} subMessage={t.successSub} />}
        {showFailure && <FailureAnimation message={submitError || t.errorMsg} />}
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title={t.confirmTitle}
          message={t.confirmGeneric.replace("{filled}", String(filledCount)).replace("{total}", String(total))}
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirmDialog(false)}
        />

        {/* Page header */}
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase">
              {lang === "de" ? "Ganzkörperanzug" : "Full Body Suit"} <span className="text-crawl">{lang === "de" ? "Konfiguration" : "Configuration"}</span>
            </h1>
            <p className="font-data text-sm text-foreground-secondary mt-2">
              {lang === "de" ? "Präzisionsmessung" : "Precision Measurement"} · {total} {lang === "de" ? "Datenfelder" : "Data Fields"} · {lang === "de" ? "Millimetergenau" : "Millimeter-accurate"}
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
                    <div className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary">{filledCount}/{total} {lang === "de" ? "Felder" : "fields"}</div>
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
                  {lang === "de" ? "TELEMETRIE" : "TELEMETRY"}
                </div>
                <div className="space-y-1">
                  {fieldGroups.map((group, idx) => {
                    const isActive = group === activeGroup;
                    const isComplete = completedMap[group] === groupFields(group).length;
                    return (
                      <button
                        key={group}
                        type="button"
                        onClick={() => setActiveGroup(group)}
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
                          {idx < fieldGroups.length - 1 && (
                            <div className="absolute left-1/2 top-full -translate-x-1/2 w-px h-3 bg-[var(--border)]" />
                          )}
                        </div>
                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <div className={`font-data text-xs uppercase tracking-atelier truncate transition-colors duration-200 ${
                            isActive ? "text-foreground" : "text-foreground-secondary"
                          }`}>
                            {labels[group]}
                          </div>
                          <div className="font-data text-[10px] text-foreground-secondary/50 mt-0.5">
                            {completedMap[group]}/{groupFields(group).length}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Progress ring at bottom of stepper */}
                <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center gap-4">
                  <ProgressRing progress={progress} radius={36} stroke={4} />
                  <div>
                    <div className="font-data text-xs uppercase tracking-atelier text-foreground-secondary">{lang === "de" ? "FORTSCHRITT" : "PROGRESS"}</div>
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
                  {lang === "de" ? "PILOTEN-DATEN" : "PILOT DATA"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput id="order-number" label={t.orderNumber} value={orderNumber} onChange={setOrderNumber} placeholder={t.orderNumberPlaceholder} />
                  <FormInput id="ebay-username" label={t.ebayUsername} value={ebayUsername} onChange={setEbayUsername} placeholder={t.ebayUsernamePlaceholder} required />
                </div>

                {/* Gender selection */}
                <div className="mt-6">
                  <label className="block text-xs uppercase tracking-wider text-foreground-secondary font-data mb-2">{t.genderLabel}</label>
                  <div className="flex gap-3">
                    {[t.genderMale, t.genderFemale].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                        className={`flex-1 py-3 rounded-sm font-data text-sm uppercase tracking-wider border transition-all duration-200 ${
                          formData.gender === g
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
                    {labels[activeGroup]} · {completedMap[activeGroup]}/{groupFields(activeGroup).length}
                  </h3>
                  <div className="flex gap-2">
                    {fieldGroups.indexOf(activeGroup) > 0 && (
                      <button type="button" onClick={goPrevGroup} className="p-2 rounded-sm border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors">
                        <ChevronLeft size={16} />
                      </button>
                    )}
                    {fieldGroups.indexOf(activeGroup) < fieldGroups.length - 1 && (
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
                    {groupFields(activeGroup).map((m) => {
                      const stepNum = suitFields.findIndex(mm => mm.key === m.key) + 1;
                      return (
                        <div key={m.key} className="relative">
                          <div className="absolute top-3 left-3 w-8 h-8 rounded-sm bg-[var(--signal)]/20 border border-[var(--signal)]/40 flex items-center justify-center z-10">
                            <span className="font-data text-xs font-bold text-[var(--signal)]">{String(stepNum).padStart(2, "0")}</span>
                          </div>
                          <MeasurementCard
                            name={m.name[lang]}
                            image={m.image[lang]}
                            value={formData[m.key] || ""}
                            onChange={(v) => handleChange(m.key, v)}
                            description={m.description[lang]}
                            error={null}
                            onClick={() => setSelectedImage(m.image[lang])}
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
                    <span className="text-foreground font-bold">{filledCount}</span>/{total} {lang === "de" ? "Messwerte" : "measurements"}
                    {filledCount < total && <span className="text-foreground-secondary/60"> — {lang === "de" ? "optional verbleibend" : "optional remaining"}</span>}
                  </div>

                  <div className="flex items-center gap-3">
                    {!ebayUsername.trim() && (
                      <span className="font-data text-[11px] text-[var(--warning)] flex items-center gap-1">
                        <AlertTriangle size={12} /> {t.ebayRequired}
                      </span>
                    )}
                    <motion.button
                      type="button"
                      onClick={prepareSubmit}
                      disabled={isSubmitting || !ebayUsername.trim()}
                      className={`px-8 py-3 rounded-sm font-data text-sm uppercase tracking-wider flex items-center gap-2 transition-all duration-300 border ${
                        isComplete
                          ? "bg-transparent border-[var(--signal)] text-[var(--signal)] animate-glow"
                          : "bg-[var(--gradient-primary)] border-transparent text-white"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                      whileHover={!isSubmitting && ebayUsername.trim() ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting && ebayUsername.trim() ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <><LoadingSpinner fullScreen={false} size="sm" /><span>{t.submitting}</span></>
                      ) : (
                        <><Save size={16} /><span>{isComplete ? t.submitComplete : t.submitIncomplete}</span></>
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
          measurements={suitFields.map(m => ({ name: m.name[lang], image: m.image[lang] }))}
          onNavigate={handleModalNavigate}
        />
      </main>
    </>
  );
}
