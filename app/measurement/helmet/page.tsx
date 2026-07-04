"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
import { helmetFields } from "@/app/lib/measurements";
import { Save, AlertTriangle } from "lucide-react";

export default function HelmetPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations.measurement[lang];
  const card = translations.card[lang];

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [ebayUsername, setEbayUsername] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFailure, setShowFailure] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Load/save to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("helmet-measurements");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.orderNumber) setOrderNumber(p.orderNumber);
        if (p.ebayUsername) setEbayUsername(p.ebayUsername);
        if (p.measurements) setFormData(p.measurements);
      }
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("helmet-measurements", JSON.stringify({ orderNumber, ebayUsername, measurements: formData }));
  }, [orderNumber, ebayUsername, formData]);

  const filledCount = Object.values(formData).filter(Boolean).length;
  const total = helmetFields.length;

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
        body: JSON.stringify({ type: "helmet", orderNumber, ebayUsername, measurements: formData }),
      });
      setIsSubmitting(false);
      if (response.ok) {
        localStorage.removeItem("helmet-measurements");
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
    const idx = helmetFields.findIndex(m => m.image[lang] === selectedImage);
    const next = direction === "next"
      ? (idx + 1) % helmetFields.length
      : (idx - 1 + helmetFields.length) % helmetFields.length;
    setSelectedImage(helmetFields[next].image[lang]);
  }, [selectedImage, lang]);

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
        <div className="absolute inset-0 -z-10 bg-stars opacity-40" />
        <div className="absolute inset-0 -z-10" style={{ background: "var(--background)" }} />

        <div className="max-w-7xl mx-auto px-4 mb-10">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase">
              {lang === "de" ? "Helm" : "Helmet"} <span className="text-crawl">{lang === "de" ? "Konfiguration" : "Configuration"}</span>
            </h1>
            <p className="font-data text-sm text-foreground-secondary mt-2">
              {lang === "de" ? "Präzisionsmessung" : "Precision Measurement"} · {total} {lang === "de" ? "Datenfelder" : "fields"} · {lang === "de" ? "Alle Felder optional" : "All fields optional"}
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
            <aside className="lg:sticky lg:top-24 h-fit">
              <div className="border border-[var(--border)] rounded-sm p-6 bg-[var(--surface-elevated)]">
                <div className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse-gentle" />
                  {lang === "de" ? "MISSIONSFORTSCHRITT" : "MISSION PROGRESS"}
                </div>
                <div className="font-data text-3xl font-bold tabular-nums text-[var(--signal)]">{filledCount}/{total}</div>
                <div className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary mt-1">{lang === "de" ? "DATENFELDER" : "DATA FIELDS"}</div>
                <div className="mt-4 h-1 w-full bg-[var(--border)] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[var(--signal)]" animate={{ width: `${(filledCount / total) * 100}%` }} transition={{ duration: 0.5 }} />
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="border border-[var(--border)] rounded-sm p-6 mb-6 bg-[var(--surface-elevated)]">
                <h3 className="font-data text-xs uppercase tracking-atelier text-foreground-secondary mb-4 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--primary)]" />
                  {lang === "de" ? "PILOTEN-DATEN" : "PILOT DATA"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput id="order-number" label={t.orderNumber} value={orderNumber} onChange={setOrderNumber} placeholder={t.orderNumberPlaceholder} type="text" />
                  <FormInput id="ebay-username" label={t.ebayUsername} value={ebayUsername} onChange={setEbayUsername} placeholder={t.ebayUsernamePlaceholder} required type="text" />
                </div>
              </div>

              <div className="border border-[var(--border)] rounded-sm p-6 bg-[var(--surface-elevated)]">
                <h3 className="font-data text-xs uppercase tracking-atelier text-foreground-secondary mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)]" />
                  {lang === "de" ? "MESSUNGEN · ALLE OPTIONAL" : "MEASUREMENTS · ALL OPTIONAL"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {helmetFields.map((m) => (
                    <div key={m.key} className="rounded-sm border border-[var(--border)] p-5 bg-[var(--background)]">
                      <div
                        className="relative w-full h-48 rounded-sm bg-[var(--surface-elevated)] flex items-center justify-center cursor-pointer hover:border-[var(--primary)] border border-[var(--border)] transition-all duration-300 mb-4 overflow-hidden group"
                        onClick={() => setSelectedImage(m.image[lang])}
                      >
                        <img src={`/images/${m.image[lang]}`} alt={m.name[lang]} className="h-40 object-contain group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute bottom-2 right-2 bg-[var(--background)]/80 backdrop-blur-sm rounded-sm px-2 py-1 font-data text-[10px] text-foreground-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                          {card.enlargeHint}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div>
                          <h4 className="font-data text-sm font-medium">{m.name[lang]}</h4>
                          <p className="font-data text-[10px] text-foreground-secondary">{m.description[lang]}</p>
                        </div>
                      </div>
                      <FormInput
                        id={`helmet-${m.key}`}
                        label={card.valueLabel}
                        value={formData[m.key] || ""}
                        onChange={(v) => setFormData(prev => ({ ...prev, [m.key]: v }))}
                        placeholder={card.valuePlaceholder}
                        type="text"
                        units="cm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border border-[var(--border)] rounded-sm p-6 bg-[var(--surface-elevated)]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="font-data text-xs text-foreground-secondary">
                    <span className="text-foreground font-bold">{filledCount}</span>/{total} {lang === "de" ? "Messungen · alle optional" : "measurements · all optional"}
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
                        filledCount === total
                          ? "bg-transparent border-[var(--signal)] text-[var(--signal)] animate-glow"
                          : "bg-[var(--gradient-primary)] border-transparent text-white"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                      whileHover={!isSubmitting && ebayUsername.trim() ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting && ebayUsername.trim() ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <><LoadingSpinner fullScreen={false} size="sm" /><span>{t.submitting}</span></>
                      ) : (
                        <><Save size={16} /><span>{filledCount === total ? t.submitComplete : t.submitIncomplete}</span></>
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
          measurements={helmetFields.map(m => ({ name: m.name[lang], image: m.image[lang] }))}
          onNavigate={handleModalNavigate}
        />
      </main>
    </>
  );
}
