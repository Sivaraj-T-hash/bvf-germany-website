/**
 * BVF German language course details.
 * Source: "BVF_Germany_AddOn_Services_2026.pdf", supplied by BVF on 12 Nov 2026.
 * Anything left empty is hidden on the /german-language page; nothing is shown as a placeholder.
 *
 * Photos must be genuine (real trainers, real classes). Save them in src/assets/german-course/ and import them here.
 */
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type CourseLevel = {
  level: CefrLevel;
  /** e.g. '30 live classes' */
  duration: string;
  /** e.g. '₹15,000' or 'Fee on request' */
  fee: string;
  /** What the level covers, in BVF's words. */
  summary?: string;
};

export type Trainer = {
  name: string;
  photo: string;
  qualifications: string;
  experience: string;
};

export const germanCourse = {
  /** Set to false to hide the course from navigation if classes are paused. */
  offered: true,
  intro: 'Learn level by level, in live classes. Even basic German makes life in Germany easier.',
  levels: [
    { level: 'A1', duration: '30 live classes', fee: '₹15,000', summary: 'Start from zero: greetings, shopping, directions and everyday conversation.' },
    { level: 'A2', duration: '50 live classes', fee: '₹15,000', summary: 'Build confidence for daily life, simple work conversations and short writing.' },
    { level: 'B1', duration: '', fee: 'Fee on request' },
    { level: 'B2', duration: '', fee: 'Fee on request' },
    { level: 'C1', duration: '', fee: 'Fee on request' },
  ] as CourseLevel[],
  trainers: [] as Trainer[],
  /** e.g. ['Mon/Wed/Fri 7:00–8:30 PM IST', 'Weekend batch: Sat & Sun 10:00 AM–12:30 PM IST'] */
  batchTimings: [] as string[],
  /** e.g. 'Maximum 12 students per batch' */
  batchSize: '',
  format: 'Live online classes. Join from home.',
  /** e.g. '3 classes per week, 90 minutes each' */
  classesPerWeek: '',
  /** e.g. ['Course book and workbook (PDF)', 'Vocabulary lists', 'Mock exams'] */
  materials: [] as string[],
  /** How speaking practice works, e.g. 'Weekly speaking sessions in small groups' */
  speakingPractice: '',
  /** e.g. ['Goethe/telc-style mock exams at the end of each level'] */
  outcomes: [] as string[],
  /** "Why start German early?" */
  whyEarly: [
    { title: 'Settle in faster', text: 'Banks, doctors, landlords and offices work in German. A1 and A2 make your first months smoother.' },
    { title: 'Better part-time jobs', text: 'Students with some German find part-time work more easily and make local friends sooner.' },
    { title: 'Ready for Ausbildung', text: 'Vocational training in Germany usually needs B1 to B2.' },
    { title: 'More degree options', text: 'German-taught degrees usually need B2 to C1. Requirements vary by university.' },
  ],
  examFeeNote: 'Goethe-Institut, TestDaF and other certificate exam fees are paid directly to the exam body and are not part of the class fee.',
  missedClass: 'Missed a class? Talk to your tutor and we will help you catch up.',
  /** Genuine class photographs (imports). */
  classPhotos: [] as string[],
  /** Genuine student feedback, with permission. */
  feedback: [] as Array<{ name: string; level: string; quote: string }>,
};

/** General CEFR level descriptions (Council of Europe Common European Framework of Reference). */
export const cefrLevels: Record<CefrLevel, { title: string; description: string }> = {
  A1: { title: 'Beginner', description: 'Understand and use familiar everyday expressions and very basic phrases, introduce yourself and ask simple personal questions.' },
  A2: { title: 'Elementary', description: 'Understand frequently used expressions about everyday topics and handle simple, routine exchanges.' },
  B1: { title: 'Intermediate', description: 'Deal with most everyday situations, describe experiences and plans, and give brief reasons and explanations.' },
  B2: { title: 'Upper intermediate', description: 'Understand the main ideas of complex texts, interact fluently with native speakers, and write clear, detailed text.' },
  C1: { title: 'Advanced', description: 'Understand demanding, longer texts and use the language flexibly and effectively for study and work.' },
};
