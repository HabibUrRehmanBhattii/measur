// ── Bilingual string dictionary for the MEASUR app ──
// German (de) | English (en)

export type Lang = "de" | "en";

// Internal `as const` structure.
const _translations = {
  /* ── language picker splash ── */
  picker: {
    de: {
      eyebrow: "MESSBÜRO",
      title: "Willkommen,",
      titleAccent: "Pilot",
      subtitle: "Wählen Sie Ihre Sprache, um fortzufahren.",
      deLabel: "Deutsch",
      enLabel: "English",
      deFlag: "🇩🇪",
      enFlag: "🇬🇧",
      continue: "Weiter",
      remember: "Auswahl merken",
    },
    en: {
      eyebrow: "MEASUREMENT BUREAU",
      title: "Welcome,",
      titleAccent: "Pilot",
      subtitle: "Choose your language to continue.",
      deLabel: "Deutsch",
      enLabel: "English",
      deFlag: "🇩🇪",
      enFlag: "🇬🇧",
      continue: "Continue",
      remember: "Remember choice",
    },
  },

  /* ── header / nav ── */
  header: {
    de: {
      systemLabel: "SYSTEM AKTIV",
      toggleTheme: "Design umschalten",
      toggleMenu: "Menü umschalten",
    },
    en: {
      systemLabel: "SYSTEM ACTIVE",
      toggleTheme: "Toggle theme",
      toggleMenu: "Toggle menu",
    },
  },

  /* ── footer ── */
  footer: {
    de: {
      measurGroup: {
        title: "MESSUNG",
        links: [
          { label: "Ganzkörperanzug", href: "/measurement/full-body-suit" },
          { label: "Helm", href: "/measurement/helmet" },
        ],
      },
      companyGroup: {
        title: "UNTERNEHMEN",
        links: [
          { label: "Über uns", href: "#" },
          { label: "Kontakt", href: "#" },
        ],
      },
      legalGroup: {
        title: "RECHTLICH",
        links: [
          { label: "Datenschutz", href: "#" },
          { label: "Impressum", href: "#" },
          { label: "AGB", href: "#" },
        ],
      },
      systemGroup: {
        title: "SYSTEM",
        links: [
          { label: "Admin", href: "/admin" },
          { label: "Status", href: "#" },
        ],
      },
      copy: () => `MEASUR · PRÄZISIONSMESSTECHNIK`,
      sub: "MILLIMETERGENAU · GERMAN ENGINEERING",
    },
    en: {
      measurGroup: {
        title: "MEASUREMENT",
        links: [
          { label: "Full Body Suit", href: "/measurement/full-body-suit" },
          { label: "Helmet", href: "/measurement/helmet" },
        ],
      },
      companyGroup: {
        title: "COMPANY",
        links: [
          { label: "About", href: "#" },
          { label: "Contact", href: "#" },
        ],
      },
      legalGroup: {
        title: "LEGAL",
        links: [
          { label: "Privacy", href: "#" },
          { label: "Imprint", href: "#" },
          { label: "Terms", href: "#" },
        ],
      },
      systemGroup: {
        title: "SYSTEM",
        links: [
          { label: "Admin", href: "/admin" },
          { label: "Status", href: "#" },
        ],
      },
      copy: () => `MEASUR · PRECISION MEASUREMENT TECH`,
      sub: "MILLIMETER ACCURATE · GERMAN ENGINEERING",
    },
  },

  /* ── home / landing ── */
  home: {
    de: {
      eyebrow: "IMPERIAL MESSBÜRO",
      heroTitle1: "Präzision",
      heroTitle2: "Jenseits der",
      heroTitle3: "Galaxie",
      heroSub: "Maßgeschneiderte Anzug-Konfiguration für den anspruchsvollen Piloten. Millimetergenau. Empire-getestet. Geschmiedet in den Sternen.",
      ctaFullBody: "Ganzkörperanzug",
      ctaHelm: "Helm",
      specsEyebrow: "TECHNISCHE DATEN",
      specsTitle1: "Für den Kosmos",
      specsTitle2: "entwickelt",
      specs: [
        { label: "16 Datenfelder", desc: "Millimetergenaue Erfassung" },
        { label: "±2 mm Toleranz", desc: "Rennsport-Präzision" },
        { label: "Echtzeit-Prüfung", desc: "Sofortige Rückmeldung" },
        { label: "Verschlüsselt", desc: "Sichere Übertragung" },
      ],
      quotesEyebrow: "REFERENZEN",
      quotesTitle1: "Vertrauen der",
      quotesTitle2: "Allianz",
      quotes: [
        { quote: "Die Messgenauigkeit hat die Passform meines Anzugs revolutioniert.", author: "Wedge A.", role: "Red Squadron Leader" },
        { quote: "Reibungsloser Prozess, präzise Ergebnisse. Absolut überzeugend.", author: "Leia O.", role: "General, Rebel Alliance" },
        { quote: "Detailgenauigkeit und schnelle Verarbeitung — übertroffen alle Erwartungen.", author: "Han S.", role: "Schmuggler" },
      ],
      ctaEyebrow: "STARTEN SIE JETZT",
      ctaTitle1: "Bereit für",
      ctaTitle2: "den Start",
      ctaSub: "Wählen Sie zwischen Ganzkörperanzug oder Helm — millimetergenaue Konfiguration in wenigen Minuten.",
      footerLine: "A LONG TIME AGO IN A GALAXY FAR, FAR AWAY....",
    },
    en: {
      eyebrow: "IMPERIAL MEASUREMENT BUREAU",
      heroTitle1: "Precision",
      heroTitle2: "Beyond the",
      heroTitle3: "Galaxy",
      heroSub: "Tailored suit configuration for the demanding pilot. Millimeter-accurate. Empire-tested. Forged among the stars.",
      ctaFullBody: "Full Body Suit",
      ctaHelm: "Helmet",
      specsEyebrow: "TECHNICAL DATA",
      specsTitle1: "Engineered for the",
      specsTitle2: "Cosmos",
      specs: [
        { label: "16 Data Fields", desc: "Millimeter-accurate capture" },
        { label: "±2 mm Tolerance", desc: "Motorsport precision" },
        { label: "Real-time Check", desc: "Instant feedback" },
        { label: "Encrypted", desc: "Secure transmission" },
      ],
      quotesEyebrow: "REFERENCES",
      quotesTitle1: "Trusted by the",
      quotesTitle2: "Alliance",
      quotes: [
        { quote: "The measurement accuracy revolutionized my suit fit.", author: "Wedge A.", role: "Red Squadron Leader" },
        { quote: "Seamless process, precise results. Absolutely convincing.", author: "Leia O.", role: "General, Rebel Alliance" },
        { quote: "Detail accuracy and fast processing — exceeded all expectations.", author: "Han S.", role: "Smuggler" },
      ],
      ctaEyebrow: "START NOW",
      ctaTitle1: "Ready for",
      ctaTitle2: "Launch",
      ctaSub: "Choose between full body suit or helmet — millimeter-accurate configuration in minutes.",
      footerLine: "A LONG TIME AGO IN A GALAXY FAR, FAR AWAY....",
    },
  },

  /* ── measurement form strings ── */
  measurement: {
    de: {
      orderData: "PILOTEN-DATEN",
      orderNumber: "Bestell-Nr. (optional)",
      orderNumberPlaceholder: "z.B. FB-12345",
      ebayUsername: "eBay-Benutzername",
      ebayUsernamePlaceholder: "eBay Benutzername",
      ebayRequired: "eBay-Benutzername erforderlich",
      measurementsGroup: "MESSUNGEN · ALLE OPTIONAL",
      submitComplete: "Konfiguration abschließen",
      submitIncomplete: "Daten senden",
      countComplete: "Messungen · alle optional",
      countRemaining: "optional verbleibend",
      confirmTitle: "KONFIGURATION BESTÄTIGEN",
      confirmGeneric: "Bestätigen: {filled} von {total} Messwerte werden übertragen.",
      confirmSpec: "Bitte bestätige die Übertragung der Messwerte.",
      successMsg: "Übertragung abgeschlossen",
      successSub: "Daten erfolgreich empfangen.",
      errorMsg: "Ein Fehler ist aufgetreten",
      submitting: "Übertrage...",
      telemetry: "TELEMETRIE",
      missionProgress: "MISSIONSFORTSCHRITT",
      dataFields: "DATENFELDER",
      progress: "FORTSCHRITT",
      genderLabel: "Geschlecht",
      genderMale: "Männlich",
      genderFemale: "Weiblich",
      orderInfo: "PILOT-DATEN",
      tooltipInfo: "info",
      tooltipHide: "info",
      fillAll: "Bitte geben Sie mindestens einen Messwert ein.",
      needEbay: "Bitte geben Sie einen eBay-Benutzernamen ein.",
      errorsFound: "Bitte korrigieren Sie die Fehler vor dem Senden.",
      confirmSubmit: "Sind Sie sicher, dass Sie die Messwerte senden möchten?",
      fixErrors: "Bitte korrigieren Sie die Fehler vor dem Senden.",
      enterOrder: "Bitte geben Sie eine Bestellnummer ein.",
      enterEbay: "Bitte geben Sie einen eBay-Benutzernamen ein.",
      submitMeasurements: "Messwerte senden",
      processing: "Verarbeitung...",
      telemetryTab: "TELEMETRIE",
      nextGroup: "Nächste Gruppe",
      back: "Zurück",
    },
    en: {
      orderData: "PILOT DATA",
      orderNumber: "Order No. (optional)",
      orderNumberPlaceholder: "e.g. FB-12345",
      ebayUsername: "eBay Username",
      ebayUsernamePlaceholder: "eBay username",
      ebayRequired: "eBay username required",
      measurementsGroup: "MEASUREMENTS · ALL OPTIONAL",
      submitComplete: "Complete Configuration",
      submitIncomplete: "Send Data",
      countComplete: "measurements · all optional",
      countRemaining: "optional remaining",
      confirmTitle: "CONFIRM CONFIGURATION",
      confirmGeneric: "Confirm: {filled} of {total} measurements will be transmitted.",
      confirmSpec: "Please confirm transmission of the measurements.",
      successMsg: "Transmission Complete",
      successSub: "Data received successfully.",
      errorMsg: "An error occurred",
      submitting: "Transmitting...",
      telemetry: "TELEMETRY",
      missionProgress: "MISSION PROGRESS",
      dataFields: "DATA FIELDS",
      progress: "PROGRESS",
      genderLabel: "Gender",
      genderMale: "Male",
      genderFemale: "Female",
      orderInfo: "PILOT DATA",
      tooltipInfo: "info",
      tooltipHide: "info",
      fillAll: "Please enter at least one measurement.",
      needEbay: "Please enter an eBay username.",
      errorsFound: "Please correct the errors before submitting.",
      confirmSubmit: "Are you sure you want to submit the measurements?",
      fixErrors: "Please correct the errors before submitting.",
      enterOrder: "Please enter an order number.",
      enterEbay: "Please enter an eBay username.",
      submitMeasurements: "Submit Measurements",
      processing: "Processing...",
      telemetryTab: "TELEMETRY",
      nextGroup: "Next Group",
      back: "Back",
    },
  },

  /* ── measurement card ── */
  card: {
    de: {
      valueLabel: "Wert (optional)",
      valuePlaceholder: "Messwert eingeben",
      enlargeHint: "Zum Vergrößern klicken",
      min: "min",
      max: "max",
      rangeError: "Wert muss zwischen {min} und {max} cm liegen",
      required: "erforderlich",
      optional: "optional",
    },
    en: {
      valueLabel: "Value (optional)",
      valuePlaceholder: "Enter measurement",
      enlargeHint: "Click to enlarge",
      min: "min",
      max: "max",
      rangeError: "Value must be between {min} and {max} cm",
      required: "required",
      optional: "optional",
    },
  },

  /* ── confirm dialog ── */
  dialog: {
    de: {
      confirm: "Bestätigen",
      cancel: "Abbrechen",
      specs: "SPEZIFIKATIONEN",
      confirmTransmission: "Bitte bestätige die Übertragung der Messwerte.",
    },
    en: {
      confirm: "Confirm",
      cancel: "Abort",
      specs: "SPECIFICATIONS",
      confirmTransmission: "Please confirm transmission of the measurements.",
    },
  },

  /* ── success animation ── */
  success: {
    de: {
      dataTransfer: "Datenübertragung",
      back: "Zurück",
      defaultMsg: "Übertragung abgeschlossen",
      defaultSub: "Daten erfolgreich empfangen.",
    },
    en: {
      dataTransfer: "Data Transfer",
      back: "Back",
      defaultMsg: "Transmission Complete",
      defaultSub: "Data received successfully.",
    },
  },

  /* ── failure animation ── */
  failure: {
    de: {
      title: "Fehler",
      defaultMsg: "Ein Fehler ist aufgetreten.",
    },
    en: {
      title: "Error",
      defaultMsg: "Something went wrong.",
    },
  },
};

// Each section of _translations has {de, en}. Expose as Record<Lang, …> so
// indexing with a runtime Lang value type-checks.
type AsLangMap<T> = { [K in keyof T]: T[K] extends { de: infer D; en: infer E } ? Record<Lang, D | E> : never };

export const translations: AsLangMap<typeof _translations> = _translations as any;

export type TranslationKeyPath = keyof typeof translations;
