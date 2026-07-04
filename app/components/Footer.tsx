"use client";

import Link from "next/link";

export function Footer() {
  const groups = [
    {
      title: "MESSUNG",
      links: [
        { label: "Ganzkörperanzug", href: "/measurement/full-body-suit" },
        { label: "Helm", href: "/measurement/helmet" },
      ],
    },
    {
      title: "UNTERNEHMEN",
      links: [
        { label: "Über uns", href: "#" },
        { label: "Kontakt", href: "#" },
      ],
    },
    {
      title: "RECHTLICH",
      links: [
        { label: "Datenschutz", href: "#" },
        { label: "Impressum", href: "#" },
        { label: "AGB", href: "#" },
      ],
    },
    {
      title: "SYSTEM",
      links: [
        { label: "Admin", href: "/admin" },
        { label: "Status", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--background)]">
      {/* Carbon-fiber texture at very bottom */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 4px)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] rounded-sm overflow-hidden">
          {groups.map((group) => (
            <div key={group.title} className="bg-[var(--background)] p-6">
              <h4 className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-data text-xs text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="font-data text-[10px] uppercase tracking-atelier text-foreground-secondary">
            © {new Date().getFullYear()} MEASUR · PRÄZISIONSMESSTECHNIK
          </div>
          <div className="font-data text-[10px] text-foreground-secondary/50">
            MILLIMETERGENAU · GERMAN ENGINEERING
          </div>
        </div>
      </div>
    </footer>
  );
}
