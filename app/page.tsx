"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "./layout";
import { Header } from "./components/Header";
import { ArrowRight, Crosshair, ShieldCheck, Zap, Target } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { resolvedTheme } = useContext(ThemeContext);

  return (
    <>
      <Header />

      <main className="relative">
        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          {/* Star field background */}
          <div className="absolute inset-0 -z-10 bg-stars" />
          <div className="absolute inset-0 -z-10" style={{ background: "var(--background)" }} />

          <div className="container mx-auto px-4 py-20 flex flex-col-reverse lg:flex-row items-center gap-12">
            {/* Copy */}
            <motion.div
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-data text-[11px] uppercase tracking-atelier text-[var(--signal)] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse-gentle" />
                IMPERIAL MESSBÜRO
              </div>

              <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight leading-[0.95] mb-6">
                <span className="text-crawl">Präzision</span>
                <br />
                Jenseits der
                <br />
                <span className="text-[var(--primary)]">Galaxie</span>
              </h1>

              <p className="font-data text-sm md:text-base text-foreground-secondary max-w-lg mb-10 leading-relaxed">
                Maßgeschneiderte Anzug-Konfiguration für den anspruchsvollen Piloten. Millimetergenau. Empire-getestet. Geschmiedet in den Sternen.
              </p>

              {/* Structural CTA panels */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={() => router.push("/measurement/full-body-suit")}
                  className="scan-line relative px-8 py-4 rounded-sm border border-[var(--border-strong)] bg-[var(--surface-elevated)] hover:border-[var(--primary)] transition-colors duration-300 overflow-hidden group holo-glow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-3 font-display text-sm uppercase tracking-wider text-[var(--primary)]">
                    Ganzkörperanzug
                    <ArrowRight size={16} />
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => router.push("/measurement/helmet")}
                  className="px-8 py-4 rounded-sm border border-[var(--border)] hover:border-[var(--border-strong)] transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-3 font-display text-sm uppercase tracking-wider text-foreground-secondary">
                    Helm
                    <ArrowRight size={16} />
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* 3D Scene */}
            <motion.div
              className="w-full lg:w-1/2 h-[350px] md:h-[480px]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Hero visual — pure CSS, always loads */}
              <motion.div
                className="w-full lg:w-1/2 h-[350px] md:h-[480px] flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative">
                  <div className="absolute inset-0 -m-12 rounded-full bg-[var(--primary)]/10 blur-3xl animate-pulse-gentle" />
                  <motion.div
                    className="relative w-48 h-72 border-2 border-[var(--primary)] rounded-2xl bg-[var(--surface-elevated)] backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6"
                    animate={{ rotateY: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-[var(--signal)] flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--signal)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
                    </div>
                    <div className="text-center">
                      <div className="font-display text-lg font-bold text-crawl tracking-wide">MEASUR</div>
                      <div className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary mt-1">Präzisionsmessung</div>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 mt-2">
                      {[...Array(8)].map((_, i) => (
                        <motion.div key={i} className="w-2 h-2 rounded-full bg-[var(--signal)]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, delay: i * 0.25, repeat: Infinity }} />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Tech Specs ── */}
        <section className="py-20 border-t border-[var(--border)]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="font-data text-[11px] uppercase tracking-atelier text-foreground-secondary mb-2">
                TECHNISCHE DATEN
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">
                Für den Kosmos <span className="text-crawl">entwickelt</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] rounded-sm overflow-hidden">
              {[
                { icon: <Crosshair size={20} />, label: "16 Datenfelder", desc: "Millimetergenaue Erfassung" },
                { icon: <Target size={20} />, label: "±2 mm Toleranz", desc: "Rennsport-Präzision" },
                { icon: <Zap size={20} />, label: "Echtzeit-Prüfung", desc: "Sofortige Rückmeldung" },
                { icon: <ShieldCheck size={20} />, label: "Verschlüsselt", desc: "Sichere Übertragung" },
              ].map((spec, i) => (
                <motion.div
                  key={spec.label}
                  className="scan-line relative bg-[var(--surface)] p-8 group cursor-default overflow-hidden"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <div className="text-[var(--primary)] mb-4">{spec.icon}</div>
                  <div className="font-data text-xs uppercase tracking-wider text-foreground mb-1">{spec.label}</div>
                  <div className="font-data text-[11px] text-foreground-secondary">{spec.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pilot Testimonials ── */}
        <section className="py-20 border-t border-[var(--border)]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="font-data text-[11px] uppercase tracking-atelier text-foreground-secondary mb-2">
                REFERENZEN
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">
                Vertrauen der <span className="text-crawl">Allianz</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
              {[
                { quote: "Die Messgenauigkeit hat die Passform meines Anzugs revolutioniert.", author: "Wedge A.", role: "Red Squadron Leader" },
                { quote: "Reibungsloser Prozess, präzise Ergebnisse. Absolut überzeugend.", author: "Leia O.", role: "General, Rebel Alliance" },
                { quote: "Detailgenauigkeit und schnelle Verarbeitung — übertroffen alle Erwartungen.", author: "Han S.", role: "Schmuggler" },
              ].map((t, i) => (
                <motion.div
                  key={t.author}
                  className="hud-corners border border-[var(--border)] rounded-sm p-6 hover:border-[var(--border-strong)] transition-colors duration-300"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="font-data text-[10px] uppercase tracking-atelier text-[var(--signal)] mb-4">
                    &ldquo;{t.author}&rdquo; &middot; {t.role}
                  </div>
                  <p className="font-data text-sm text-foreground-secondary leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 border-t border-[var(--border)]">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-3xl mx-auto text-center p-10 md:p-14 border border-[var(--border-strong)] rounded-sm bg-[var(--surface-elevated)] hud-corners"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="font-data text-[11px] uppercase tracking-atelier text-[var(--signal)] mb-4">
                STARTEN SIE JETZT
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
                Bereit für <span className="text-crawl">den Start</span>?
              </h2>
              <p className="font-data text-sm text-foreground-secondary mb-8 max-w-lg mx-auto">
                Wählen Sie zwischen Ganzkörperanzug oder Helm — millimetergenaue Konfiguration in wenigen Minuten.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <motion.button
                  onClick={() => router.push("/measurement/full-body-suit")}
                  className="px-8 py-3.5 rounded-sm bg-[var(--primary)] text-[var(--background)] font-display text-sm uppercase tracking-wider font-bold holo-glow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Full Body Suit
                </motion.button>
                <motion.button
                  onClick={() => router.push("/measurement/helmet")}
                  className="px-8 py-3.5 rounded-sm border border-[var(--border-strong)] hover:border-[var(--primary)] transition-colors font-display text-sm uppercase tracking-wider"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Helmet
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Minimal Footer ── */}
        <footer className="py-8 border-t border-[var(--border)]">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary">
              © {new Date().getFullYear()} MEASUR · IMPERIAL MEASUREMENT BUREAU
            </div>
            <div className="font-data text-[10px] text-foreground-secondary/50">
              A LONG TIME AGO IN A GALAXY FAR, FAR AWAY....
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
