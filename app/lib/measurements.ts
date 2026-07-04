import { Lang } from "./translations";

export interface MeasurementField {
  /** Stable key used in form data + api payloads. */
  key: string;
  /** Localized display name. */
  name: Record<Lang, string>;
  /** Localized description (tooltip). */
  description: Record<Lang, string>;
  /** Image path in /public/images/, per language folder. */
  image: Record<Lang, string>;
  /** Group key (see fieldGroups below). */
  group: string;
  /** Min / max cm range used for optional validation. */
  min: number;
  max: number;
}

/** Suit measurement fields — image paths are exactly what's on disk in each folder. */
export const suitFields: MeasurementField[] = [
  {
    key: "totalHeight",
    name: { de: "Gesamthöhe", en: "Total Height" },
    description: {
      de: "Messen Sie aufrecht stehend von der Kopfspitze bis zum Boden.",
      en: "Stand straight with feet together and measure from the top of your head to the floor.",
    },
    image: {
      de: "Amor Only/1_total_height.png",
      en: "Armor English/1_Height.png",
    },
    group: "general",
    min: 100, max: 250,
  },
  {
    key: "gender",
    name: { de: "Geschlecht", en: "Gender" },
    description: {
      de: "Wählen Sie Ihr Geschlecht für die passende Passform.",
      en: "Select your gender for the correct fit.",
    },
    image: {
      de: "Amor Only/2_Gender_Geschlecht.png",
      en: "Armor English/2_Gender.png",
    },
    group: "general",
    min: 0, max: 0,
  },
  {
    key: "chestCircumference",
    name: { de: "Brustumfang", en: "Chest Circumference" },
    description: {
      de: "Messen Sie den Umfang der vollsten Partie Ihrer Brust, horizontal geführt.",
      en: "Measure around the fullest part of your chest, keeping the tape horizontal.",
    },
    image: {
      de: "Amor Only/3_Brustumfang.png",
      en: "Armor English/3_Chest Circumference.png",
    },
    group: "upper",
    min: 50, max: 200,
  },
  {
    key: "neckCircumference",
    name: { de: "Halskreis", en: "Neck Circumference" },
    description: {
      de: "Messen Sie um die Basis Ihres Halses, straff geführt.",
      en: "Measure around the base of your neck, keeping the tape snug.",
    },
    image: {
      de: "Amor Only/4_Neck Circumference.png",
      en: "Armor English/4_Neck Circumference.png",
    },
    group: "upper",
    min: 20, max: 60,
  },
  {
    key: "shoulderWidth",
    name: { de: "Schulterbreite", en: "Shoulder Width" },
    description: {
      de: "Messen Sie die Breite Ihrer Schultern von Kante zu Kante.",
      en: "Measure across the top of your shoulders from edge to edge.",
    },
    image: {
      de: "Amor Only/5_Schulterbreite (Shoulder Width).png",
      en: "Armor English/5_Shoulder Width.png",
    },
    group: "upper",
    min: 30, max: 70,
  },
  {
    key: "armLength",
    name: { de: "Armlänge", en: "Arm Length" },
    description: {
      de: "Messen Sie von der Schulterspitze zum Handgelenk, leicht gebeugt.",
      en: "Measure from the shoulder tip to the wrist with your arm slightly bent.",
    },
    image: {
      de: "Amor Only/5_Arm Length.png",
      en: "Armor English/6_Arm Length.png",
    },
    group: "upper",
    min: 40, max: 100,
  },
  {
    key: "bicepCircumference",
    name: { de: "Bizepsumfang", en: "Bicep Circumference" },
    description: {
      de: "Messen Sie den vollsten Teil Ihres Bizeps, angespannt.",
      en: "Measure around the fullest part of your bicep, flexed.",
    },
    image: {
      de: "Amor Only/6_Bicep Circumference.png",
      en: "Armor English/7_Bicep Circumference.png",
    },
    group: "upper",
    min: 20, max: 60,
  },
  {
    key: "forearmCircumference",
    name: { de: "Unterarmumfang", en: "Forearm Circumference" },
    description: {
      de: "Messen Sie den vollsten Teil Ihres Unterarms.",
      en: "Measure around the fullest part of your forearm.",
    },
    image: {
      de: "Amor Only/7_Forearm Circumference.png",
      en: "Armor English/8_Forearm Circumference.png",
    },
    group: "upper",
    min: 15, max: 50,
  },
  {
    key: "backLength",
    name: { de: "Rückenlänge", en: "Back Length" },
    description: {
      de: "Messen Sie von der Halsbasis bis zur Taille.",
      en: "Measure from the base of your neck to your waistline.",
    },
    image: {
      de: "Amor Only/8_Back Length.png",
      en: "Armor English/9_Back Length.png",
    },
    group: "upper",
    min: 30, max: 80,
  },
  {
    key: "waistCircumference",
    name: { de: "Taillenumfang", en: "Waist Circumference" },
    description: {
      de: "Messen Sie um Ihre natürliche Taille, oberhalb der Hüften.",
      en: "Measure around your natural waistline, above the hips.",
    },
    image: {
      de: "Amor Only/9_Rückenlänge.png",
      en: "Armor English/10_Waist Circumference.png",
    },
    group: "middle",
    min: 50, max: 150,
  },
  {
    key: "hipCircumference",
    name: { de: "Hüftumfang", en: "Hip Circumference" },
    description: {
      de: "Messen Sie den vollsten Teil Ihrer Hüften.",
      en: "Measure around the fullest part of your hips.",
    },
    image: {
      de: "Amor Only/10_hip_circumference.png",
      en: "Armor English/11_Hip Circumference.png",
    },
    group: "lower",
    min: 60, max: 160,
  },
  {
    key: "inseam",
    name: { de: "Innenbeinlänge", en: "Inseam" },
    description: {
      de: "Messen Sie von der Leiste bis zum Boden an der Innenseite des Beins.",
      en: "Measure from the crotch to the floor along the inside of your leg.",
    },
    image: {
      de: "Amor Only/11_inseam.png",
      en: "Armor English/12_Inside leg.png",
    },
    group: "lower",
    min: 50, max: 120,
  },
  {
    key: "thighCircumference",
    name: { de: "Oberschenkelumfang", en: "Thigh Circumference" },
    description: {
      de: "Messen Sie den vollsten Teil Ihres Oberschenkels.",
      en: "Measure around the fullest part of your thigh.",
    },
    image: {
      de: "Amor Only/12_thigh_circumference_Oberschenkelumfang.png",
      en: "Armor English/13_Thigh Circumference.png",
    },
    group: "lower",
    min: 30, max: 90,
  },
  {
    key: "calfCircumference",
    name: { de: "Kalbumfang", en: "Calf Circumference" },
    description: {
      de: "Messen Sie den vollsten Teil Ihrer Wade.",
      en: "Measure around the fullest part of your calf.",
    },
    image: {
      de: "Amor Only/13_KALBUMFALL.png",
      en: "Armor English/14_Calf Circumference.png",
    },
    group: "lower",
    min: 20, max: 60,
  },
  {
    key: "footLength",
    name: { de: "Fußlänge", en: "Foot Length" },
    description: {
      de: "Messen Sie von der Ferse bis zur Spitze Ihres längsten Zehs.",
      en: "Measure from the heel to the tip of your longest toe.",
    },
    image: {
      de: "Amor Only/14_foot_length_Fusslange.png",
      en: "Armor English/15_Foot Length.png",
    },
    group: "lower",
    min: 20, max: 40,
  },
];

export const helmetFields: MeasurementField[] = [
  {
    key: "headWidth",
    name: { de: "Kopfbreite", en: "Head Width" },
    description: {
      de: "Messen Sie die Breite Ihres Kopfes von Ohr zu Ohr.",
      en: "Measure the width of your head above the ears.",
    },
    image: {
      de: "Helmet Only/head_width.png",
      en: "Helmet English/1_Head Width.png",
    },
    group: "general",
    min: 10, max: 30,
  },
  {
    key: "headCircumference",
    name: { de: "Kopfumfang", en: "Head Circumference" },
    description: {
      de: "Messen Sie um Ihren Kopf oberhalb der Ohren und Augenbrauen.",
      en: "Measure around your head above the ears and eyebrows.",
    },
    image: {
      de: "Helmet Only/head_circumference.png",
      en: "Helmet English/2_Head Circumference.png",
    },
    group: "general",
    min: 40, max: 70,
  },
];

export const fieldGroups = ["general", "upper", "middle", "lower"] as const;
export type FieldGroup = (typeof fieldGroups)[number];

export const groupLabels: Record<Lang, Record<FieldGroup, string>> = {
  de: {
    general: "ALLGEMEIN",
    upper: "OBERKÖRPER",
    middle: "MITTELTEIL",
    lower: "UNTERKÖRPER",
  },
  en: {
    general: "GENERAL",
    upper: "UPPER BODY",
    middle: "MID SECTION",
    lower: "LOWER BODY",
  },
};
