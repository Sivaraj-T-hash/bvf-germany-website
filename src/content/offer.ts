/**
 * BVF Germany package, services and add-ons.
 * Source: "BVF_Germany_Brochure_2026.pdf" and "BVF_Germany_AddOn_Services_2026.pdf", supplied by BVF on 12 Nov 2026.
 * Update this file when BVF changes a price or a service.
 */

export const completePackage = {
  name: 'Complete package',
  price: '₹59,999',
  summary: 'From your first shortlist to your first week in Germany.',
  parts: [
    { label: 'Part 1', when: 'When you finalise your courses', amount: '₹29,999', note: '' },
    { label: 'Part 2', when: 'After you receive your offer letter', amount: '₹30,000', note: 'Only once your admission is confirmed' },
  ],
  noHiddenCharges: 'The package and the add-ons you choose are the only payments you will ever make to BVF Germany.',
};

export type JourneyService = {
  title: string;
  description: string;
  path: string;
  addOn?: boolean;
};

export type JourneyStage = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  services: JourneyService[];
};

/** The 14 services in six stages, as in the BVF brochure. */
export const journeyStages: JourneyStage[] = [
  {
    id: 'discover',
    number: 1,
    title: 'Discover',
    subtitle: 'Find the right course and tell your story well',
    services: [
      { title: 'University Shortlisting', description: 'Universities matched to your CGPA, experience and goals, so you apply where you can win.', path: '/services/university-shortlist' },
      { title: 'SOP & LOR Writing', description: 'Statement of Purpose and recommendation letters that show you at your best.', path: '/services/sop-lor-writing' },
      { title: 'CV Writing', description: 'A professional German-format CV (Lebenslauf).', path: '/services/cv-writing' },
    ],
  },
  {
    id: 'prepare',
    number: 2,
    title: 'Prepare',
    subtitle: 'Get your certificates and test scores ready',
    services: [
      { title: 'APS Application Support', description: 'Step-by-step help with the APS certificate every Indian applicant needs.', path: '/services/aps-application' },
      { title: 'IELTS Preparation', description: 'Target band 6.0 to 7.0, with mock tests and feedback.', path: '/services/ielts-preparation', addOn: true },
      { title: 'GRE Preparation', description: 'A personal, quant-focused plan for a stronger score.', path: '/services/gre-preparation', addOn: true },
      { title: 'German Language, A1 to C1', description: 'Structured classes for study, Ausbildung and daily life in Germany.', path: '/german-language', addOn: true },
    ],
  },
  {
    id: 'apply',
    number: 3,
    title: 'Apply',
    subtitle: 'Send strong applications on time',
    services: [
      { title: 'University Application', description: 'uni-assist and direct applications, from documents to submission to tracking.', path: '/services/university-application' },
    ],
  },
  {
    id: 'fund',
    number: 4,
    title: 'Fund',
    subtitle: 'Sort out money and insurance with confidence',
    services: [
      { title: 'Student Loan Guidance', description: 'Loan options from SBI, Axis Bank and HDFC Credila, with full paperwork help.', path: '/services/study-loan' },
      { title: 'Blocked Account', description: 'Open your Expatrio or Fintiba blocked account, step by step.', path: '/services/blocked-account' },
      { title: 'Health Insurance', description: 'Enrol in public health insurance like TK, AOK or Barmer.', path: '/services/health-insurance' },
    ],
  },
  {
    id: 'fly',
    number: 5,
    title: 'Fly',
    subtitle: 'Get your visa and get ready to travel',
    services: [
      { title: 'Visa Guidance', description: 'Document checklist, VFS booking and interview prep, so you walk in ready.', path: '/services/visa-guidance' },
    ],
  },
  {
    id: 'settle',
    number: 6,
    title: 'Settle',
    subtitle: 'Feel at home in your new city',
    services: [
      { title: 'Accommodation Help', description: 'Dorms, shared flats (WG) and trusted platforms, with honest rent guidance and scam warnings.', path: '/services/accommodation-help', addOn: true },
      { title: 'On-Arrival Support', description: 'SIM card, bank account, Anmeldung and insurance setup in your first days.', path: '/services/on-arrival-support' },
    ],
  },
];

export const allJourneyServices: JourneyService[] = journeyStages.flatMap((stage) => stage.services);

export type AddOn = {
  id: string;
  title: string;
  detail: string;
  price: string;
  path: string;
};

/** "Add-ons at a glance" table. */
export const addOns: AddOn[] = [
  { id: 'ielts', title: 'IELTS Preparation', detail: '40 live classes + tutor notes', price: '₹7,000', path: '/services/ielts-preparation' },
  { id: 'gre', title: 'GRE Preparation', detail: 'Live online coaching', price: '₹14,999', path: '/services/gre-preparation' },
  { id: 'gmat', title: 'GMAT Preparation', detail: 'Live online coaching', price: '₹14,999', path: '/services/gmat-preparation' },
  { id: 'german-a1', title: 'German A1', detail: '30 live classes', price: '₹15,000', path: '/german-language' },
  { id: 'german-a2', title: 'German A2', detail: '50 live classes', price: '₹15,000', path: '/german-language' },
  { id: 'german-higher', title: 'German B1, B2, C1', detail: 'Higher levels', price: 'On request', path: '/german-language' },
  { id: 'accommodation', title: 'Accommodation Support', detail: 'Find your home in Germany', price: 'On request', path: '/services/accommodation-help' },
];

export const addOnNote = 'Prices are course fees in Indian rupees. Official exam fees are paid separately to the exam bodies.';
export const addOnIntro = 'Optional, and priced separately from your ₹59,999 package. Take one, take all, or take none.';

export const addOnSteps = [
  { title: 'Tell us your plan', text: 'Share your course, target score and timeline in your free consultation.' },
  { title: 'Pick what you need', text: 'We suggest only what your profile really needs. No pushing.' },
  { title: 'Start learning', text: 'Join live classes from home and get help until exam day or move-in day.' },
];

/** Test preparation details from the add-on brochure. */
export const testPrep = {
  ielts: {
    title: 'IELTS Preparation',
    summary: 'English proficiency for admissions and visa. Target band 6.0 to 7.0.',
    price: '₹7,000',
    features: ['40 live classes with an expert tutor', 'Tutor notes shared with you', 'Mock tests and speaking practice', 'Writing feedback on your essays'],
  },
  gre: {
    title: 'GRE Preparation',
    summary: 'For master’s programmes that value a strong quant score, common in engineering and computer science.',
    price: '₹14,999',
    features: ['Live online classes for Quant and Verbal', 'Personal study plan for your target score', 'Practice tests and doubt-clearing sessions', 'Study material from your tutor'],
  },
  gmat: {
    title: 'GMAT Preparation',
    summary: 'For management and business master’s programmes, such as MSc Management and MBA.',
    price: '₹14,999',
    features: ['Live online classes for Quant, Verbal and Data Insights', 'Personal study plan and score tracking', 'Full-length practice tests', 'Doubt-clearing sessions and study material'],
  },
  testAdvice: 'Not sure which test you need? Ask us first. Many German public university programmes do not require GRE or GMAT, so we check your shortlist before you enrol.',
};

export const accommodationSupport = {
  intro: 'Finding a room is a big worry for new students. We help you find a safe, fairly priced home.',
  priceNote: 'Add-on · Fee shared at your consultation',
  items: [
    { title: 'Student dorms', text: 'Guidance on applying early for student housing (Studierendenwerk), where waiting lists can be long.' },
    { title: 'Shared flats (WG)', text: 'How to search, write to flatmates and prepare for video viewings.' },
    { title: 'Trusted platforms', text: 'Where to search for rooms and flats, with realistic rent for your city.' },
    { title: 'Scam protection', text: 'Spot fake listings and never pay before you see a proper contract.' },
    { title: 'Contract and deposit help', text: 'Understand your contract, the deposit (Kaution) and the landlord confirmation needed for Anmeldung.' },
    { title: 'Short-term stay', text: 'Plan a temporary place for your first weeks, so you can search calmly after you land.' },
  ],
  honestNote: 'Housing is limited in big university cities. We cannot promise a room, but we make sure you start early and search the right way. Rent and deposits are paid directly to your landlord.',
};

/** Costs paid directly to official bodies, not to BVF. */
export const officialFees = [
  { item: 'IELTS exam fee', paidTo: 'British Council or IDP' },
  { item: 'GRE exam fee', paidTo: 'ETS' },
  { item: 'German exam fee', paidTo: 'Goethe-Institut, TestDaF or similar' },
  { item: 'APS certificate fee', paidTo: 'APS India' },
  { item: 'University application fee', paidTo: 'The university or uni-assist' },
  { item: 'Visa fee', paidTo: 'German embassy or VFS Global' },
  { item: 'Blocked account deposit', paidTo: 'Your own money, released to you monthly in Germany' },
  { item: 'Health insurance, rent and deposit', paidTo: 'Your insurer and your landlord' },
];

/** "Why Germany is within your reach". */
export const germanyFacts = [
  { value: '€0', text: 'tuition at most public universities. You pay only a small semester contribution.' },
  { value: '€992', text: 'a month to show in your blocked account (€11,904 for a year). This is your own money for living costs.' },
  { value: '20 hrs', text: 'a week you may work part-time during the semester to support yourself.' },
  { value: '18 mo', text: 'you can stay after graduating to look for a job in Germany.' },
];

export const germanyFactsNote =
  'Figures reflect German rules as of 2026 and can change. Some states, such as Baden-Württemberg, charge non-EU students tuition. We always share the latest rules during your consultation.';

/** Blocked account amount used across the site (BVF brochure, rules as of 2026). */
export const blockedAccount = { monthly: '€992', yearly: '€11,904', asOf: '2026' };

export const comparison = {
  typical: ['Focuses on getting the application sent', 'Many separate fees along the way', 'Support usually ends at the visa'],
  bvf: ['Focuses on you settling in and studying well', 'One clear package price for 14 services', 'Support continues after you arrive in Germany'],
};

export const whyChooseUs = [
  { title: 'With you end to end', text: 'Every step is covered, from shortlisting to settling in after you land.' },
  { title: 'Clear, fair pricing', text: 'You know exactly what you pay and why, before you start.' },
  { title: 'Germany specialists', text: 'We focus on German public universities, APS, visas and student life.' },
  { title: 'Test prep in one place', text: 'IELTS, GRE and German classes, all with the same team.' },
  { title: 'Guidance made for you', text: 'Your plan is built around your profile, goals and budget.' },
  { title: 'Help with finances', text: 'Education loans and blocked account support for a calm start.' },
];

export const founderPromises = ['100% transparent process', 'No middlemen, you work with us directly', 'Guided by someone who has done it'];

export const timeline = [
  { when: '9 to 12 months before your intake', what: 'Shortlisting, APS, and starting IELTS, GRE or German if needed' },
  { when: '6 to 9 months before', what: 'SOP, LOR and CV ready; university applications submitted' },
  { when: '3 to 6 months before', what: 'Offer letter, education loan, blocked account and health insurance' },
  { when: '1 to 3 months before', what: 'Visa appointment, accommodation search and travel planning' },
  { when: 'Your first weeks in Germany', what: 'SIM, bank account, Anmeldung and settling in' },
];

export const timelineNote = 'Timelines vary by course and intake (winter or summer). We create a personal plan for you in your first session.';

export const documentsToKeepReady = ['Passport', '10th and 12th marksheets', 'Degree and transcripts', 'IELTS, GRE or German scores', 'Work experience letters'];

/** Questions from both brochures. */
export const offerFaqs = [
  { q: 'Do I have to take the add-ons?', a: 'No. IELTS, GRE, German classes and accommodation help are completely optional. Many students join only the package.' },
  { q: 'When do I pay the second instalment?', a: 'Only after you receive an offer letter from a university.' },
  { q: 'Are add-ons included in the ₹59,999 package?', a: 'No. Add-ons are optional extras, priced separately.' },
  { q: 'Are exam fees included?', a: 'No. IELTS, GRE, GMAT and German exam fees are paid directly to the official bodies.' },
  { q: 'Is the blocked account money a fee?', a: 'No. It is your own savings. Once you are in Germany, it is released to you every month for living costs.' },
  { q: 'What if I miss a class?', a: 'Talk to your tutor and we will help you catch up.' },
  { q: 'Do I need GRE or GMAT for Germany?', a: 'Only some programmes ask for them. We check your shortlisted courses before you spend anything.' },
];
