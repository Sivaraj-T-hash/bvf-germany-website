export type ServiceStatus =
  | 'not-started'
  | 'in-progress'
  | 'documents-received'
  | 'submitted'
  | 'completed';

export interface StudentDocumentLink {
  id: string;
  label: string;
  url: string;
  status: 'submitted' | 'reviewed' | 'rejected';
  submittedAt: string;
}

export interface ServiceProgressItem {
  id: string;
  title: string;
  status: ServiceStatus;
  enrolled: boolean;
  requiredDocuments: string[];
  documentLinks: StudentDocumentLink[];
  adminNote: string;
  updatedAt: string;
}

export interface ServicePricingOption {
  label: string;
  price: string;
  note: string;
  featured?: boolean;
}

export type ServiceIcon =
  | 'profile'
  | 'university'
  | 'application'
  | 'ielts'
  | 'gre'
  | 'gmat'
  | 'language'
  | 'visa'
  | 'arrival'
  | 'accommodation'
  | 'ausbildung'
  | 'writing'
  | 'cv'
  | 'submit';

export interface ServiceCatalogItem {
  id: string;
  slug: string;
  icon: ServiceIcon;
  title: string;
  shortDescription: string;
  /** Price line shown on the service page, e.g. 'Add-on · ₹7,000 · Exam fee not included'. Empty hides it. */
  priceTag: string;
  /** false = public page only; not added to the student dashboard's tracked services. */
  trackInDashboard?: boolean;
  badgeTone: 'free' | 'included' | 'premium' | 'paid';
  heroTitle: string;
  heroSubtitle: string;
  urgencyLine: string;
  whatYouGet: string[];
  whyThisMatters: string;
  processSteps: string[];
  pricingOptions: ServicePricingOption[];
  proof: {
    line: string;
  };
  checklistTitle: string;
  checklist: string[];
  requiredDocuments: string[];
  emoji: string;
  disciplineShortlists?: Array<{
    title: string;
    summary: string;
    items: string[];
  }>;
  faqs: Array<{ q: string; a: string }>;
}

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    id: 'profile-verification',
    slug: 'profile-verification',
    icon: 'profile',
    title: 'Profile Verification',
    shortDescription: 'Check your academics, backlogs, language position, and Germany route-fit before making bigger decisions.',
    priceTag: 'Free first consultation',
    badgeTone: 'free',
    heroTitle: 'Profile Verification - Start With A Clear Eligibility Check',
    heroSubtitle: 'Understand where your profile stands before you shortlist, prepare documents, or spend time on the wrong route.',
    urgencyLine: 'Best first step for students who need clarity before moving forward.',
    whatYouGet: [
      'Academic profile review',
      'Backlog and CGPA assessment',
      'Language-readiness check',
      'Route-fit guidance',
      'Early risk flags',
      'Clear next-step direction',
    ],
    whyThisMatters: 'Students usually save the most time when they first understand what is realistic for their profile instead of applying blindly.',
    processSteps: ['Share your profile', 'Review academics and language status', 'Identify realistic route', 'Receive next-step guidance'],
    pricingOptions: [{ label: 'Profile Verification', price: '', note: 'Guided starting-point service' }],
    proof: {
      line: 'Strong journeys usually begin with a clearer profile filter.',
    },
    checklistTitle: 'What you get',
    checklist: ['Profile review', 'Eligibility clarity', 'Route recommendation', 'Smarter next-step planning'],
    requiredDocuments: ['Academic transcripts', 'Resume or CV', 'Passport copy', 'Current language-score status'],
    emoji: '🔍',
    faqs: [
      { q: 'How long does this usually take?', a: 'Most profile reviews are completed quickly once the student shares the needed academic details.' },
      { q: 'Is this personalized?', a: 'Yes. The service is based on your actual profile, not a generic eligibility template.' },
      { q: 'Should I do this before shortlisting?', a: 'Yes. It is usually the smartest first step before building a university list.' },
    ],
  },
  {
    id: 'university-shortlist',
    slug: 'university-shortlist',
    icon: 'university',
    title: 'University Shortlisting',
    shortDescription: 'Universities matched to your CGPA, experience and goals, so you apply where you can win.',
    priceTag: 'Included in the ₹59,999 package',
    badgeTone: 'included',
    heroTitle: 'University Shortlist - Branch-Wise Shortlisting That Makes Sense',
    heroSubtitle: 'Build your shortlist by engineering discipline, admissions realism, language route, and public-university fit instead of collecting random names.',
    urgencyLine: 'Best for students who need a structured shortlist by branch before applications begin.',
    whatYouGet: [
      'Discipline-wise shortlist logic',
      'Safe, target, and ambitious grouping',
      'Language-fit review',
      'Public-university focus',
      'Intake and location logic',
      'A cleaner final shortlist',
    ],
    whyThisMatters: 'A good shortlist is not just a list of popular universities. It should reflect your branch, profile strength, language readiness, and realistic application chances.',
    processSteps: ['Review your profile and branch', 'Select realistic discipline tracks', 'Build branch-wise shortlist', 'Finalize the shortlist for applications'],
    pricingOptions: [{ label: 'University Shortlist', price: '', note: 'Guided shortlisting support' }],
    proof: {
      line: 'Discipline-based shortlisting makes applications much more focused.',
    },
    checklistTitle: 'What you get',
    checklist: ['Branch-wise shortlist', 'Public-university fit check', 'Language and intake alignment', 'Balanced shortlist grouping'],
    requiredDocuments: ['Academic transcripts', 'Current degree and branch', 'Language-score status', 'Budget and intake preference'],
    emoji: '🏛️',
    disciplineShortlists: [
      {
        title: 'Mechanical Engineering',
        summary: 'For manufacturing, design, thermal systems, and production-focused students.',
        items: ['Technical University of Munich', 'RWTH Aachen University', 'Karlsruhe Institute of Technology', 'University of Stuttgart'],
      },
      {
        title: 'Civil Engineering',
        summary: 'For structures, infrastructure, transport, and construction pathways.',
        items: ['RWTH Aachen University', 'TU Dresden', 'Leibniz University Hannover', 'University of Stuttgart'],
      },
      {
        title: 'Electrical Engineering',
        summary: 'For circuits, power systems, controls, and electronics-heavy routes.',
        items: ['RWTH Aachen University', 'Technical University of Munich', 'TU Berlin', 'Karlsruhe Institute of Technology'],
      },
      {
        title: 'Computer Science',
        summary: 'For software systems, AI, data, and applied computing tracks.',
        items: ['Technical University of Munich', 'TU Berlin', 'University of Bonn', 'FAU Erlangen-Nurnberg'],
      },
      {
        title: 'Automotive Engineering',
        summary: 'For students focused on mobility, automotive systems, and vehicle-linked engineering.',
        items: ['RWTH Aachen University', 'Technical University of Munich', 'University of Stuttgart', 'TU Braunschweig'],
      },
      {
        title: 'Data Science and AI',
        summary: 'For students blending computing, analytics, machine learning, and intelligent systems.',
        items: ['Technical University of Munich', 'University of Bonn', 'TU Berlin', 'Karlsruhe Institute of Technology'],
      },
    ],
    faqs: [
      { q: 'Is the shortlist built by discipline?', a: 'Yes. The shortlist is organized around the engineering branch you want to pursue.' },
      { q: 'Is it only based on rankings?', a: 'No. It is built around fit, admissions realism, language route, and public-university relevance.' },
      { q: 'Do you include safe, target, and ambitious choices?', a: 'Yes. That balance usually gives students a stronger final application plan.' },
    ],
  },
  {
    id: 'aps-application',
    slug: 'aps-application',
    icon: 'application',
    title: 'APS Application Support',
    shortDescription: 'Step-by-step help with the APS certificate every Indian applicant needs.',
    priceTag: 'Included in the ₹59,999 package · APS certificate fee paid to APS India',
    badgeTone: 'premium',
    heroTitle: 'APS Application - Prepare The APS Stage Properly',
    heroSubtitle: 'Handle APS with more structure so document mistakes do not create avoidable delays in your Germany process.',
    urgencyLine: 'Critical for Indian students who need APS aligned with admissions timing.',
    whatYouGet: [
      'APS checklist support',
      'Document sequencing guidance',
      'Submission-readiness review',
      'Common-error prevention',
      'Timeline coordination',
      'Next-step clarity after submission',
    ],
    whyThisMatters: 'APS planning works best when it is handled early and methodically rather than as a rushed document stage.',
    processSteps: ['Review APS requirements', 'Organize documents', 'Check readiness before submission', 'Plan next steps with applications'],
    pricingOptions: [{ label: 'APS Application', price: '', note: 'Guided APS support service' }],
    proof: {
      line: 'APS usually feels smoother when the paperwork is organized properly.',
    },
    checklistTitle: 'What you get',
    checklist: ['APS checklist', 'Document-order clarity', 'Submission readiness', 'Planning support alongside admissions'],
    requiredDocuments: ['Passport copy', 'Academic transcripts', 'Degree certificates', 'Any APS preparation notes'],
    emoji: '📜',
    faqs: [
      { q: 'Should APS be planned early?', a: 'Yes. APS timing can affect later admissions and visa stages, so it should not be left too late.' },
      { q: 'What usually causes APS delays?', a: 'Most delays come from weak document preparation or missing requirements, not from APS alone.' },
      { q: 'Can APS planning happen with shortlisting?', a: 'Yes. That is often the best way to keep your full Germany timeline connected.' },
    ],
  },
  {
    id: 'ielts-preparation',
    slug: 'ielts-preparation',
    icon: 'ielts',
    title: 'IELTS Preparation',
    shortDescription: 'English proficiency for admissions and visa. Target band 6.0 to 7.0, with 40 live classes.',
    priceTag: 'Add-on · ₹7,000 course fee · Exam fee not included',
    badgeTone: 'paid',
    heroTitle: 'IELTS Preparation - 40 Live Classes With An Expert Tutor',
    heroSubtitle: 'English proficiency for admissions and visa. Target band 6.0 to 7.0, in live online classes you join from home.',
    urgencyLine: 'Optional add-on, priced separately from the ₹59,999 package.',
    whatYouGet: [
      '40 live classes with an expert tutor',
      'Tutor notes shared with you',
      'Mock tests and speaking practice',
      'Writing feedback on your essays',
    ],
    whyThisMatters: 'IELTS affects much more than one test date. It can widen or narrow your shortlist and change which programmes stay realistic. The IELTS exam fee is paid directly to the British Council or IDP and is not part of the course fee.',
    processSteps: ['Tell us your plan and target band', 'Join the live classes', 'Practise with mock tests and essay feedback', 'Sit the exam with confidence'],
    pricingOptions: [{ label: 'IELTS Preparation', price: '₹7,000', note: '40 live classes + tutor notes' }],
    proof: {
      line: 'A stronger IELTS plan creates stronger options later.',
    },
    checklistTitle: 'What you get',
    checklist: ['Band-target strategy', 'Prep structure', 'Requirement matching', 'Exam-timing guidance'],
    requiredDocuments: ['Current IELTS or mock score if available', 'Target intake', 'Target programme type'],
    emoji: '🗣️',
    faqs: [
      { q: 'Can IELTS affect shortlist quality?', a: 'Yes. A stronger score often improves your shortlist flexibility for English-taught programmes.' },
      { q: 'Is this only for beginners?', a: 'No. It also helps students who need to move from an average score to a safer one.' },
      { q: 'Should IELTS planning happen before final shortlisting?', a: 'It should happen alongside shortlisting so your final list stays realistic.' },
    ],
  },
  {
    id: 'gre-preparation',
    slug: 'gre-preparation',
    icon: 'gre',
    title: 'GRE Preparation',
    shortDescription: 'For master’s programmes that value a strong quant score, common in engineering and computer science.',
    priceTag: 'Add-on · ₹14,999 course fee · Exam fee not included',
    badgeTone: 'paid',
    heroTitle: 'GRE Preparation - Live Online Coaching',
    heroSubtitle: 'For master’s programmes that value a strong quant score, common in engineering and computer science.',
    urgencyLine: 'Not sure you need GRE? Ask us first. Many German public university programmes do not require it, so we check your shortlist before you enrol.',
    whatYouGet: [
      'Live online classes for Quant and Verbal',
      'Personal study plan for your target score',
      'Practice tests and doubt-clearing sessions',
      'Study material from your tutor',
    ],
    whyThisMatters: 'Not every Germany programme requires GRE. The smarter move is to check relevance first and prepare only where it genuinely helps. The GRE exam fee is paid directly to ETS and is not part of the course fee.',
    processSteps: ['Check GRE relevance against your shortlist', 'Set your score target', 'Join live Quant and Verbal classes', 'Practise and book the exam'],
    pricingOptions: [{ label: 'GRE Preparation', price: '₹14,999', note: 'Live online coaching' }],
    proof: {
      line: 'GRE works best when it is aligned with the right shortlist.',
    },
    checklistTitle: 'What you get',
    checklist: ['GRE requirement mapping', 'Score-target strategy', 'Prep planning', 'Exam-timing support'],
    requiredDocuments: ['Target programmes', 'Current GRE status or mock score if available', 'Preferred intake'],
    emoji: '📝',
    faqs: [
      { q: 'Do all Germany programmes require GRE?', a: 'No. Many do not. That is why a shortlist-based requirement check matters first.' },
      { q: 'Who benefits most from GRE support?', a: 'Usually students applying to more competitive technical or analytics pathways.' },
      { q: 'Can GRE and IELTS happen together?', a: 'Yes, but the plan should stay realistic so one exam does not weaken the other.' },
    ],
  },
  {
    id: 'germany-language',
    slug: 'germany-language',
    icon: 'language',
    title: 'German Language (A1–C1)',
    shortDescription: 'Structured classes for study, Ausbildung and daily life in Germany. A1 and A2 at ₹15,000 per level.',
    priceTag: 'Add-on · ₹15,000 per level (A1, A2) · B1–C1 on request',
    badgeTone: 'paid',
    heroTitle: 'Germany Language (A1-B2) - Build German Step By Step',
    heroSubtitle: 'Strengthen your Germany journey with structured German learning for academic routes, vocational routes, and smoother day-to-day adjustment.',
    urgencyLine: 'Important for German-taught routes, Ausbildung, and stronger everyday readiness.',
    whatYouGet: [
      'A1-B2 roadmap support',
      'Goal-based level planning',
      'Speaking and daily-use focus',
      'Structured study direction',
      'Exam-direction guidance where needed',
      'Better long-term readiness',
    ],
    whyThisMatters: 'German improves more than admissions. It can affect programme access, practical life, part-time work, and overall confidence in Germany.',
    processSteps: ['Check current level', 'Set target level', 'Follow language plan', 'Prepare for the next academic or practical step'],
    pricingOptions: [{ label: 'Germany Language (A1-B2)', price: '', note: 'Guided language-support service' }],
    proof: {
      line: 'German readiness helps both study plans and practical life.',
    },
    checklistTitle: 'What you get',
    checklist: ['Level roadmap', 'Goal-based planning', 'Speaking support direction', 'Test guidance where relevant'],
    requiredDocuments: ['Current German level if any', 'Target route or programme type', 'Preferred timeline'],
    emoji: '🇩🇪',
    faqs: [
      { q: 'Is German necessary for every route?', a: 'No, but it becomes very important for German-taught programmes, Ausbildung, and smoother daily life.' },
      { q: 'Can I start from zero?', a: 'Yes. The support can begin at A1 and build upward step by step.' },
      { q: 'Does German help even for English-taught routes?', a: 'Yes. It often helps with internships, part-time work, housing, and daily communication.' },
    ],
  },
  {
    id: 'visa-guidance',
    slug: 'visa-guidance',
    icon: 'visa',
    title: 'Visa Guidance',
    shortDescription: 'Document checklist, VFS booking and interview prep, so you walk in ready.',
    priceTag: 'Included in the ₹59,999 package · Visa fee paid to the embassy or VFS Global',
    badgeTone: 'included',
    heroTitle: 'Visa Guidance - Enter The Final Stage With More Confidence',
    heroSubtitle: 'Get structured support for the visa phase so blocked-account, insurance, and paperwork confusion do not disrupt your move.',
    urgencyLine: 'One of the highest-stakes stages in the whole Germany journey.',
    whatYouGet: [
      'Visa checklist review',
      'Blocked-account guidance',
      'Insurance and finance direction',
      'Interview-prep support',
      'Document readiness review',
      'Final-stage clarity',
    ],
    whyThisMatters: 'An admit alone is not enough. Students still need strong coordination in the visa stage so the Germany move stays on track.',
    processSteps: ['Review visa checklist', 'Organize finances and documents', 'Prepare for appointment', 'Move forward with better readiness'],
    pricingOptions: [{ label: 'Visa Guidance', price: '', note: 'Structured visa-stage support' }],
    proof: {
      line: 'The visa stage feels safer when the paperwork is coordinated properly.',
    },
    checklistTitle: 'What you get',
    checklist: ['Visa checklist review', 'Blocked-account planning', 'Interview guidance', 'Final readiness support'],
    requiredDocuments: ['Passport copy', 'APS certificate', 'Admit letter', 'Blocked-account proof', 'Insurance details'],
    emoji: '🛂',
    faqs: [
      { q: 'Is the visa process hard?', a: 'It usually feels hard when the process is unclear. Strong structure reduces a lot of that stress.' },
      { q: 'Do Indian students usually need APS first?', a: 'Yes. APS is often a key prerequisite before the later stages.' },
      { q: 'Why does this stage need separate guidance?', a: 'Because it combines finance, documents, timing, and interview preparation all at once.' },
    ],
  },
  {
    id: 'on-arrival-support',
    slug: 'on-arrival-support',
    icon: 'arrival',
    title: 'On-Arrival Support',
    shortDescription: 'SIM card, bank account, Anmeldung and insurance setup in your first days.',
    priceTag: 'Included in the ₹59,999 package',
    badgeTone: 'included',
    heroTitle: 'On-Arrival Support - Settle In With Less Confusion',
    heroSubtitle: 'SIM card, bank account, Anmeldung and insurance setup in your first days in Germany.',
    urgencyLine: 'Our support continues after you arrive in Germany.',
    whatYouGet: [
      'SIM card setup',
      'Bank account opening',
      'Anmeldung (city registration)',
      'Health insurance setup',
      'First-week priorities',
      'Practical help as you settle in',
    ],
    whyThisMatters: 'The journey does not end with the visa. The first days after arrival are where many students need practical clarity the most.',
    processSteps: ['Review first priorities', 'Handle early setup tasks', 'Get practical reminders', 'Settle in with more confidence'],
    pricingOptions: [{ label: 'On Arrival Support', price: '', note: 'Post-landing practical support' }],
    proof: {
      line: 'Students settle in faster when the first priorities are already clear.',
    },
    checklistTitle: 'What you get',
    checklist: ['Arrival-week support', 'Practical setup reminders', 'Early settlement help', 'First-step clarity'],
    requiredDocuments: ['Passport and visa copy', 'Accommodation details', 'Insurance details', 'Travel details if relevant'],
    emoji: '✈️',
    faqs: [
      { q: 'Is this only about the airport and travel day?', a: 'No. It is mainly about the first phase of settling in after arrival.' },
      { q: 'What kinds of issues does it help with?', a: 'Students usually need support with first-week priorities, setup, and practical orientation.' },
      { q: 'Should this happen after visa guidance?', a: 'Yes. It usually becomes relevant once the travel stage is already in motion.' },
    ],
  },
  {
    id: 'accommodation-help',
    slug: 'accommodation-help',
    icon: 'accommodation',
    title: 'Accommodation Help',
    shortDescription: 'Dorms, shared flats (WG) and trusted platforms, with honest rent guidance and scam warnings.',
    priceTag: 'Add-on · Fee shared at your consultation',
    badgeTone: 'paid',
    heroTitle: 'Accommodation Support - Find Your Home In Germany',
    heroSubtitle: 'Finding a room is a big worry for new students. We help you find a safe, fairly priced home.',
    urgencyLine: 'Optional add-on. The fee depends on your city and the level of support you need.',
    whatYouGet: [
      'Student dorms: guidance on applying early for student housing (Studierendenwerk), where waiting lists can be long',
      'Shared flats (WG): how to search, write to flatmates and prepare for video viewings',
      'Trusted platforms: where to search for rooms and flats, with realistic rent for your city',
      'Scam protection: spot fake listings and never pay before you see a proper contract',
      'Contract and deposit help: your contract, the deposit (Kaution) and the landlord confirmation needed for Anmeldung',
      'Short-term stay: a temporary place for your first weeks, so you can search calmly after you land',
    ],
    whyThisMatters: 'Housing is limited in big university cities. We cannot promise a room, but we make sure you start early and search the right way. Rent and deposits are paid directly to your landlord.',
    processSteps: ['Understand housing options', 'Review realistic budget', 'Spot risky listings', 'Prepare for a smarter final decision'],
    pricingOptions: [{ label: 'Accommodation Help', price: '', note: 'Housing-guidance service' }],
    proof: {
      line: 'Better housing decisions protect students from panic spending and scams.',
    },
    checklistTitle: 'What you get',
    checklist: ['Housing strategy', 'Scam-awareness review', 'Rental expectation clarity', 'Decision support before booking'],
    requiredDocuments: ['Target city', 'Budget range', 'Preferred move-in date', 'Any shortlisted listings if available'],
    emoji: '🏠',
    faqs: [
      { q: 'Do you guarantee housing?', a: 'No. The support improves search quality and decision-making, not unrealistic guarantees.' },
      { q: 'Can this help before visa approval?', a: 'Yes. It is useful for planning, budgeting, and avoiding risky prepayments early.' },
      { q: 'Why does this need guidance?', a: 'Because rushed housing choices often become expensive or risky in high-demand cities.' },
    ],
  },
  {
    id: 'sop-lor-writing',
    slug: 'sop-lor-writing',
    icon: 'writing',
    title: 'SOP & LOR Writing',
    shortDescription: 'Statement of Purpose and recommendation letters that show you at your best.',
    priceTag: 'Included in the ₹59,999 package',
    trackInDashboard: false,
    badgeTone: 'included',
    heroTitle: 'SOP & LOR Writing - Tell Your Story Well',
    heroSubtitle: 'A Statement of Purpose and recommendation letters that show you at your best, written for the programmes you are actually applying to.',
    urgencyLine: 'Part of the Discover stage: find the right course and tell your story well.',
    whatYouGet: [
      'A Statement of Purpose built around your profile and goals',
      'Recommendation letter (LOR) guidance for your referees',
      'Programme-specific focus for each application',
      'Review rounds until the documents are ready',
    ],
    whyThisMatters: 'German universities read your SOP to understand why you chose the programme and what you bring to it. A clear, honest SOP and well-written LORs make your application easier to assess.',
    processSteps: ['Share your background and goals', 'Agree the story and structure', 'Draft and review together', 'Final documents ready for applications'],
    pricingOptions: [{ label: 'SOP & LOR Writing', price: '', note: 'Included in the complete package' }],
    proof: { line: 'Your SOP should sound like you, not like a template.' },
    checklistTitle: 'What you get',
    checklist: ['SOP for your shortlisted programmes', 'LOR guidance for referees', 'Review and final polish'],
    requiredDocuments: ['Academic transcripts', 'CV', 'Shortlisted programmes', 'Projects, internships or work experience details'],
    emoji: '✍️',
    faqs: [
      { q: 'Do I need a different SOP for each programme?', a: 'Usually yes. Each programme looks for different things, so the SOP should match the course you apply to.' },
      { q: 'Who writes the LOR?', a: 'Your professors or employers write and sign the LOR. We guide you on what a strong LOR covers.' },
    ],
  },
  {
    id: 'cv-writing',
    slug: 'cv-writing',
    icon: 'cv',
    title: 'CV Writing',
    shortDescription: 'A professional German-format CV (Lebenslauf).',
    priceTag: 'Included in the ₹59,999 package',
    trackInDashboard: false,
    badgeTone: 'included',
    heroTitle: 'CV Writing - A Professional German-Format CV',
    heroSubtitle: 'A clear, professional CV in the German format (Lebenslauf), ready for university applications.',
    urgencyLine: 'Part of the Discover stage: find the right course and tell your story well.',
    whatYouGet: [
      'German-format CV (Lebenslauf)',
      'Academic, project and work sections set out clearly',
      'Consistent with your SOP and documents',
      'Ready for uni-assist and direct applications',
    ],
    whyThisMatters: 'Admissions teams look for a clear, consistent CV. A German-format CV shows your education and experience the way German universities expect to read it.',
    processSteps: ['Share your details', 'Draft in German format', 'Review together', 'Final CV ready'],
    pricingOptions: [{ label: 'CV Writing', price: '', note: 'Included in the complete package' }],
    proof: { line: 'A clear CV makes every other document easier to read.' },
    checklistTitle: 'What you get',
    checklist: ['German-format CV', 'Consistent dates and details', 'Final review'],
    requiredDocuments: ['Academic details', 'Work experience letters', 'Projects and certificates'],
    emoji: '📄',
    faqs: [{ q: 'What is a Lebenslauf?', a: 'It is the German name for a CV. It follows a clear, chronological format with your education, experience and skills.' }],
  },
  {
    id: 'university-application',
    slug: 'university-application',
    icon: 'submit',
    title: 'University Application',
    shortDescription: 'uni-assist and direct applications, from documents to submission to tracking.',
    priceTag: 'Included in the ₹59,999 package · Application fees paid to the university or uni-assist',
    trackInDashboard: false,
    badgeTone: 'included',
    heroTitle: 'University Application - Send Strong Applications On Time',
    heroSubtitle: 'uni-assist and direct applications, from documents to submission to tracking.',
    urgencyLine: 'Part of the Apply stage. Applications are usually submitted 6 to 9 months before your intake.',
    whatYouGet: [
      'uni-assist applications',
      'Direct university applications',
      'Document checks before submission',
      'Deadline planning',
      'Submission and status tracking',
    ],
    whyThisMatters: 'Each university has its own portal, documents and deadlines. Careful, on-time applications avoid avoidable rejections.',
    processSteps: ['Finalise your shortlist', 'Prepare and check documents', 'Submit through uni-assist or the university', 'Track each application'],
    pricingOptions: [{ label: 'University Application', price: '', note: 'Included in the complete package' }],
    proof: { line: 'Strong applications are complete, correct and on time.' },
    checklistTitle: 'What you get',
    checklist: ['Application plan with deadlines', 'Document checks', 'Submission support', 'Tracking until decisions arrive'],
    requiredDocuments: ['Passport', '10th and 12th marksheets', 'Degree and transcripts', 'IELTS, GRE or German scores', 'APS certificate', 'SOP, LOR and CV'],
    emoji: '📬',
    faqs: [
      { q: 'What is uni-assist?', a: 'uni-assist is the service many German universities use to check international applications. Some universities take applications directly instead.' },
      { q: 'Who pays the application fees?', a: 'Application fees are paid directly to the university or uni-assist, not to BVF.' },
    ],
  },
  {
    id: 'gmat-preparation',
    slug: 'gmat-preparation',
    icon: 'gmat',
    title: 'GMAT Preparation',
    shortDescription: 'For management and business master’s programmes, such as MSc Management and MBA.',
    priceTag: 'Add-on · ₹14,999 course fee · Exam fee not included',
    trackInDashboard: false,
    badgeTone: 'paid',
    heroTitle: 'GMAT Preparation - Live Online Coaching',
    heroSubtitle: 'For management and business master’s programmes, such as MSc Management and MBA.',
    urgencyLine: 'Not sure you need GMAT? Ask us first. Many German public university programmes do not require it, so we check your shortlist before you enrol.',
    whatYouGet: [
      'Live online classes for Quant, Verbal and Data Insights',
      'Personal study plan and score tracking',
      'Full-length practice tests',
      'Doubt-clearing sessions and study material',
    ],
    whyThisMatters: 'Some business and management programmes ask for a GMAT score. We check your shortlisted courses before you spend anything. The GMAT exam fee is paid directly to the exam body and is not part of the course fee.',
    processSteps: ['Check GMAT relevance against your shortlist', 'Set your score target', 'Join live classes', 'Practise with full-length tests'],
    pricingOptions: [{ label: 'GMAT Preparation', price: '₹14,999', note: 'Live online coaching' }],
    proof: { line: 'Prepare for GMAT only when your programmes need it.' },
    checklistTitle: 'What you get',
    checklist: ['GMAT requirement check', 'Personal study plan', 'Practice tests', 'Doubt-clearing sessions'],
    requiredDocuments: ['Target programmes', 'Current GMAT status or mock score if available', 'Preferred intake'],
    emoji: '📊',
    faqs: [
      { q: 'Do I need GMAT for Germany?', a: 'Only some programmes ask for it. We check your shortlisted courses before you spend anything.' },
      { q: 'Are exam fees included?', a: 'No. The GMAT exam fee is paid directly to the official body.' },
    ],
  },
  {
    id: 'ausbildung-service',
    slug: 'ausbildung',
    icon: 'ausbildung',
    title: 'Ausbildung',
    shortDescription: 'Explore Germany’s vocational training route with better clarity on field fit, language readiness, and practical expectations.',
    priceTag: '',
    badgeTone: 'included',
    heroTitle: 'Ausbildung - Understand The Vocational Training Route Properly',
    heroSubtitle: 'Decide whether Ausbildung fits your profile better than a university degree and what practical preparation this path usually needs.',
    urgencyLine: 'Best for students considering a skills-first vocational route instead of a classic degree pathway.',
    whatYouGet: [
      'Route-fit guidance',
      'Field-selection clarity',
      'German-language readiness guidance',
      'Practical expectation setting',
      'Lifestyle and path comparison',
      'A clearer next-step plan',
    ],
    whyThisMatters: 'Ausbildung is not just a smaller version of university study. It is a different route with different expectations around language, daily routine, and training style.',
    processSteps: ['Compare Ausbildung vs degree routes', 'Assess fit and language readiness', 'Choose a field direction', 'Plan realistic next steps'],
    pricingOptions: [{ label: 'Ausbildung', price: '', note: 'Guided vocational-route support' }],
    proof: {
      line: 'Ausbildung works better when students choose it intentionally, not just because it sounds practical.',
    },
    checklistTitle: 'What you get',
    checklist: ['Route comparison', 'Language-readiness check', 'Field-direction clarity', 'A more realistic plan'],
    requiredDocuments: ['Academic background details', 'Current German level if any', 'Target field interest', 'Preferred timeline'],
    emoji: '🛠️',
    faqs: [
      { q: 'Is Ausbildung the same as a degree?', a: 'No. It is a vocational training route, not a traditional academic university degree.' },
      { q: 'Does German matter for Ausbildung?', a: 'Yes. German is usually central because the route involves practical training and workplace communication.' },
      { q: 'Who should consider Ausbildung seriously?', a: 'Students who want practical, skills-first training and are comfortable with hands-on structured learning often find it a strong fit.' },
    ],
  },
];

export const serviceStatusLabels: Record<ServiceStatus, string> = {
  'not-started': 'Not Started',
  'in-progress': 'In Progress',
  'documents-received': 'Documents Received',
  submitted: 'Submitted',
  completed: 'Completed',
};

export const defaultServiceProgress = (): ServiceProgressItem[] =>
  serviceCatalog.filter((service) => service.trackInDashboard !== false).map((service) => ({
    id: service.id,
    title: service.title,
    status: 'not-started',
    enrolled: false,
    requiredDocuments: service.requiredDocuments,
    documentLinks: [],
    adminNote: '',
    updatedAt: new Date().toISOString(),
  }));
