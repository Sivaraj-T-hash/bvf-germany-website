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

type ServiceIcon =
  | 'profile'
  | 'university'
  | 'application'
  | 'ielts'
  | 'gre'
  | 'language'
  | 'visa'
  | 'arrival'
  | 'accommodation'
  | 'ausbildung';

export interface ServiceCatalogItem {
  id: string;
  slug: string;
  icon: ServiceIcon;
  title: string;
  shortDescription: string;
  priceTag: string;
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
    quote: string;
    student: string;
    outcome: string;
  };
  checklistTitle: string;
  checklist: string[];
  requiredDocuments: string[];
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
    priceTag: '',
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
      quote: 'The review helped me stop wasting time on options that were never a real fit.',
      student: 'Aditi Sharma',
      outcome: 'Moved from confusion to a more realistic Germany plan',
    },
    checklistTitle: 'What you get',
    checklist: ['Profile review', 'Eligibility clarity', 'Route recommendation', 'Smarter next-step planning'],
    requiredDocuments: ['Academic transcripts', 'Resume or CV', 'Passport copy', 'Current language-score status'],
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
    title: 'University Shortlist',
    shortDescription: 'Get university shortlists broken down by engineering discipline so each branch has its own clear research path.',
    priceTag: '',
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
      quote: 'Once the shortlist was broken down by branch, the whole Germany plan felt more organized.',
      student: 'Rohit Verma',
      outcome: 'Moved from scattered research to a usable shortlist',
    },
    checklistTitle: 'What you get',
    checklist: ['Branch-wise shortlist', 'Public-university fit check', 'Language and intake alignment', 'Balanced shortlist grouping'],
    requiredDocuments: ['Academic transcripts', 'Current degree and branch', 'Language-score status', 'Budget and intake preference'],
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
    title: 'APS Application',
    shortDescription: 'Get structured support for APS paperwork, sequencing, and submission readiness so your Germany timeline stays on track.',
    priceTag: '',
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
      quote: 'The process became much clearer once I understood the order and the document logic.',
      student: 'Sneha Iyer',
      outcome: 'Prepared APS with fewer avoidable mistakes',
    },
    checklistTitle: 'What you get',
    checklist: ['APS checklist', 'Document-order clarity', 'Submission readiness', 'Planning support alongside admissions'],
    requiredDocuments: ['Passport copy', 'Academic transcripts', 'Degree certificates', 'Any APS preparation notes'],
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
    shortDescription: 'Prepare for IELTS with clearer band targeting and a Germany-focused test strategy.',
    priceTag: '',
    badgeTone: 'paid',
    heroTitle: 'IELTS Preparation - Improve The Score That Shapes Your Options',
    heroSubtitle: 'Prepare for IELTS in a way that supports shortlist quality, admissions flexibility, and realistic intake planning.',
    urgencyLine: 'Useful when your English score is the main gap in your profile.',
    whatYouGet: [
      'Band-target planning',
      'Requirement-based prep strategy',
      'Study structure',
      'Mock-test direction',
      'Retake timing advice',
      'Germany-focused language planning',
    ],
    whyThisMatters: 'IELTS affects much more than one test date. It can widen or narrow your shortlist and change which programmes stay realistic.',
    processSteps: ['Check current level', 'Set target band', 'Follow the prep structure', 'Decide exam timing'],
    pricingOptions: [{ label: 'IELTS Preparation', price: '', note: 'Guided exam-prep support' }],
    proof: {
      line: 'A stronger IELTS plan creates stronger options later.',
      quote: 'The preparation stopped feeling random once it was tied to my university goals.',
      student: 'Karan Bedi',
      outcome: 'Improved score planning before final shortlisting',
    },
    checklistTitle: 'What you get',
    checklist: ['Band-target strategy', 'Prep structure', 'Requirement matching', 'Exam-timing guidance'],
    requiredDocuments: ['Current IELTS or mock score if available', 'Target intake', 'Target programme type'],
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
    shortDescription: 'Prepare for GRE only where it strengthens your target programmes and overall application strategy.',
    priceTag: '',
    badgeTone: 'paid',
    heroTitle: 'GRE Preparation - Prepare With Purpose, Not Guesswork',
    heroSubtitle: 'Use a focused GRE plan when your shortlist includes programmes where quant or test strength can improve your application.',
    urgencyLine: 'Best for students targeting GRE-relevant technical or analytics routes.',
    whatYouGet: [
      'GRE relevance check against shortlist',
      'Score-target planning',
      'Study-structure support',
      'Quant-priority guidance',
      'Mock-test direction',
      'Test-timing advice',
    ],
    whyThisMatters: 'Not every Germany programme requires GRE. The smarter move is to check relevance first and prepare only where it genuinely helps.',
    processSteps: ['Check GRE relevance', 'Set score target', 'Follow prep structure', 'Finalize exam timing'],
    pricingOptions: [{ label: 'GRE Preparation', price: '', note: 'Guided GRE planning support' }],
    proof: {
      line: 'GRE works best when it is aligned with the right shortlist.',
      quote: 'This helped me avoid spending time on GRE where it did not really matter.',
      student: 'Rishi Malhotra',
      outcome: 'Aligned GRE effort with realistic Germany goals',
    },
    checklistTitle: 'What you get',
    checklist: ['GRE requirement mapping', 'Score-target strategy', 'Prep planning', 'Exam-timing support'],
    requiredDocuments: ['Target programmes', 'Current GRE status or mock score if available', 'Preferred intake'],
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
    title: 'Germany Language (A1-B2)',
    shortDescription: 'Build German language readiness from A1 to B2 for studies, Ausbildung, and everyday life in Germany.',
    priceTag: '',
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
      quote: 'The roadmap made the language goal feel structured instead of overwhelming.',
      student: 'Anushka Mehta',
      outcome: 'Built stronger German readiness before moving ahead',
    },
    checklistTitle: 'What you get',
    checklist: ['Level roadmap', 'Goal-based planning', 'Speaking support direction', 'Test guidance where relevant'],
    requiredDocuments: ['Current German level if any', 'Target route or programme type', 'Preferred timeline'],
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
    shortDescription: 'Prepare for blocked account, insurance, finances, interview readiness, and the main visa-stage paperwork.',
    priceTag: '',
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
      quote: 'The guidance helped me focus on what actually mattered instead of second-guessing every document.',
      student: 'Aman Joseph',
      outcome: 'Handled the visa phase with more confidence',
    },
    checklistTitle: 'What you get',
    checklist: ['Visa checklist review', 'Blocked-account planning', 'Interview guidance', 'Final readiness support'],
    requiredDocuments: ['Passport copy', 'APS certificate', 'Admit letter', 'Blocked-account proof', 'Insurance details'],
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
    title: 'On Arrival Support',
    shortDescription: 'Get practical support for your first days in Germany, including early setup, reminders, and adjustment help.',
    priceTag: '',
    badgeTone: 'free',
    heroTitle: 'On Arrival Support - Settle In With Less Confusion',
    heroSubtitle: 'Move through the first phase after landing with more clarity on what to do first, what matters most, and how to settle in more smoothly.',
    urgencyLine: 'Best for students who want a calmer first week after landing in Germany.',
    whatYouGet: [
      'Arrival-week guidance',
      'Early setup reminders',
      'Practical first-step support',
      'Adjustment help',
      'Settlement clarity',
      'Less first-week confusion',
    ],
    whyThisMatters: 'The journey does not end with the visa. The first days after arrival are where many students need practical clarity the most.',
    processSteps: ['Review first priorities', 'Handle early setup tasks', 'Get practical reminders', 'Settle in with more confidence'],
    pricingOptions: [{ label: 'On Arrival Support', price: '', note: 'Post-landing practical support' }],
    proof: {
      line: 'Students settle in faster when the first priorities are already clear.',
      quote: 'It helped me know what mattered first instead of panicking over everything after landing.',
      student: 'Lavanya M',
      outcome: 'Started life in Germany with more confidence',
    },
    checklistTitle: 'What you get',
    checklist: ['Arrival-week support', 'Practical setup reminders', 'Early settlement help', 'First-step clarity'],
    requiredDocuments: ['Passport and visa copy', 'Accommodation details', 'Insurance details', 'Travel details if relevant'],
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
    shortDescription: 'Search for housing with better strategy, stronger scam awareness, and a more practical move-in plan.',
    priceTag: '',
    badgeTone: 'included',
    heroTitle: 'Accommodation Help - Search Smarter Before You Commit',
    heroSubtitle: 'Understand student housing, temporary stays, shared flats, and rental risks before you make a housing decision in Germany.',
    urgencyLine: 'Important for students moving to cities where housing pressure can get expensive quickly.',
    whatYouGet: [
      'Housing option comparison',
      'WG and dorm guidance',
      'Scam-awareness support',
      'Rental expectation clarity',
      'Budget-based search logic',
      'Move-in planning help',
    ],
    whyThisMatters: 'Housing is one of the most stressful parts of moving to Germany. Students make better decisions when they understand the market early.',
    processSteps: ['Understand housing options', 'Review realistic budget', 'Spot risky listings', 'Prepare for a smarter final decision'],
    pricingOptions: [{ label: 'Accommodation Help', price: '', note: 'Housing-guidance service' }],
    proof: {
      line: 'Better housing decisions protect students from panic spending and scams.',
      quote: 'The guidance helped me slow down and avoid a risky listing before I paid anything.',
      student: 'Pooja S',
      outcome: 'Made a safer and better housing choice',
    },
    checklistTitle: 'What you get',
    checklist: ['Housing strategy', 'Scam-awareness review', 'Rental expectation clarity', 'Decision support before booking'],
    requiredDocuments: ['Target city', 'Budget range', 'Preferred move-in date', 'Any shortlisted listings if available'],
    faqs: [
      { q: 'Do you guarantee housing?', a: 'No. The support improves search quality and decision-making, not unrealistic guarantees.' },
      { q: 'Can this help before visa approval?', a: 'Yes. It is useful for planning, budgeting, and avoiding risky prepayments early.' },
      { q: 'Why does this need guidance?', a: 'Because rushed housing choices often become expensive or risky in high-demand cities.' },
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
      quote: 'The support helped me understand whether the vocational route actually matched my strengths.',
      student: 'Nitesh Rao',
      outcome: 'Moved from confusion to a clearer Ausbildung decision',
    },
    checklistTitle: 'What you get',
    checklist: ['Route comparison', 'Language-readiness check', 'Field-direction clarity', 'A more realistic plan'],
    requiredDocuments: ['Academic background details', 'Current German level if any', 'Target field interest', 'Preferred timeline'],
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
  serviceCatalog.map((service) => ({
    id: service.id,
    title: service.title,
    status: 'not-started',
    enrolled: false,
    requiredDocuments: service.requiredDocuments,
    documentLinks: [],
    adminNote: '',
    updatedAt: new Date().toISOString(),
  }));
