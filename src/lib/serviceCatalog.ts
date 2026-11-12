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
  | 'university'
  | 'application'
  | 'ielts'
  | 'gre'
  | 'language'
  | 'visa'
  | 'arrival'
  | 'accommodation'
  | 'sop'
  | 'cv'
  | 'loan'
  | 'insurance'
  | 'uni-application';

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
    id: 'university-shortlisting',
    slug: 'university-shortlist',
    icon: 'university',
    title: 'University Shortlisting',
    shortDescription: 'Help students identify the best-fit universities based on their academic profile.',
    priceTag: 'Included in 999 University List package',
    badgeTone: 'included',
    heroTitle: 'University Shortlisting for Public Universities in Germany',
    heroSubtitle:
      'We assess your academics, English score, and intake goals, then match you with 5 to 10 suitable public universities.',
    urgencyLine: 'High-impact starting service for students who want a realistic shortlist before applications begin.',
    whatYouGet: [
      'Profile assessment covering grades, backlogs, and English score',
      'Match with 5 to 10 suitable public universities',
      'Shortlist report with course and admission requirements',
      'Application deadline calendar for your intake',
    ],
    whyThisMatters:
      'A strong shortlist saves time, reduces wasted application fees, and keeps your Germany journey focused on realistic options instead of random university names.',
    processSteps: [
      'Share your academics, backlogs, and preferred intake',
      'We review your profile and route fit',
      'You receive a shortlist report with requirements',
      'We map deadlines so your application plan stays on track',
    ],
    pricingOptions: [
      {
        label: '999 University List Package',
        price: 'INR 999',
        note: 'Includes shortlisting guidance and shortlist report',
        featured: true,
      },
    ],
    proof: {
      line: 'Shortlists work best when they are built on fit, not guesswork.',
      quote: 'The report made it obvious which universities were realistic and which deadlines I had to respect.',
      student: 'Rohit Verma',
      outcome: 'Moved from random research to a focused shortlist',
    },
    checklistTitle: 'What appears in your shortlist package',
    checklist: [
      'Profile assessment summary',
      '5 to 10 university matches',
      'Admission requirement notes',
      'Intake-wise deadline calendar',
    ],
    requiredDocuments: [
      '10th, 12th, and latest degree marksheets',
      'Backlog history if applicable',
      'Current IELTS or English-score status',
      'Preferred course and intake',
    ],
    emoji: 'UNI',
    faqs: [
      {
        q: 'How many universities do you shortlist?',
        a: 'The shortlist usually includes 5 to 10 suitable universities based on your profile, course, and intake.',
      },
      {
        q: 'Do you include admission requirements?',
        a: 'Yes. The shortlist report includes admission requirements and deadline guidance for each selected option.',
      },
      {
        q: 'How does the process work?',
        a: '1. Profile Check -> 2. Eligibility Assessment -> 3. Shortlist Preparation -> 4. Review & Finalize.',
      },
    ],
  },
  {
    id: 'aps-application-support',
    slug: 'aps-application',
    icon: 'application',
    title: 'APS Application Support',
    shortDescription: 'APS certificate support for Indian students applying to German universities.',
    priceTag: 'Pricing on request',
    badgeTone: 'premium',
    heroTitle: 'APS Application Support for Indian Students',
    heroSubtitle:
      'APS is mandatory for Indian students applying to German universities. We help you understand the process, documents, and timing before intake deadlines get close.',
    urgencyLine: 'High-priority service because APS delays can affect both admissions and visa timelines.',
    whatYouGet: [
      'Clear explanation of what the APS certificate is and why it matters',
      'Document checklist covering 10th, 12th, and degree marksheets',
      'Guidance on booking the APS appointment in New Delhi or Mumbai',
      'Timeline planning: apply 3 to 4 months before intake',
      'Clarity that APS validity is lifetime once issued',
    ],
    whyThisMatters:
      'APS is now a mandatory checkpoint for Indian students. Missing documents or applying too late can slow the entire Germany process.',
    processSteps: [
      'Understand APS eligibility and timeline',
      'Prepare marksheets, certificates, and identity documents',
      'Book your APS slot and complete the file',
      'Track APS status while continuing shortlist and application work',
    ],
    pricingOptions: [
      {
        label: 'APS Support',
        price: 'Pricing on request',
        note: 'Contact BVF Germany for the latest APS support fee',
        featured: true,
      },
    ],
    proof: {
      line: 'APS goes smoother when the document order is clear from day one.',
      quote: 'I finally understood what to upload, what to carry, and when to apply before my intake.',
      student: 'Sneha Iyer',
      outcome: 'Prepared APS with fewer mistakes and better timing',
    },
    checklistTitle: 'APS support covers',
    checklist: [
      'APS certificate explanation',
      'Marksheet and document checklist',
      'Appointment booking guidance',
      'Timeline planning before intake',
      'Lifetime validity clarification',
    ],
    requiredDocuments: [
      'Passport copy',
      '10th and 12th marksheets',
      'Degree marksheets and certificate',
      'Any supporting identity or academic documents requested by APS',
    ],
    emoji: 'APS',
    faqs: [
      {
        q: 'Is APS mandatory for Indian students?',
        a: 'Yes. APS is mandatory for Indian students applying to German universities and is also used later in the visa process.',
      },
      {
        q: 'When should I apply for APS?',
        a: 'Plan APS 3 to 4 months before your intake so it does not delay applications or visa preparation.',
      },
      {
        q: 'What is the document checklist?',
        a: 'Typically: 10th & 12th marksheets, Degree certificate, Semester marksheets, Passport copy, and Identity proof.',
      },
    ],
  },
  {
    id: 'ielts-preparation',
    slug: 'ielts-preparation',
    icon: 'ielts',
    title: 'IELTS Preparation',
    shortDescription: 'English proficiency support for universities that ask for IELTS 6.0 to 7.0.',
    priceTag: 'Free study material tier + guided coaching',
    badgeTone: 'paid',
    heroTitle: 'IELTS Preparation for Germany Admissions',
    heroSubtitle:
      'Most English-taught German programmes ask for IELTS 6.0 to 7.0. We help you target the right band and prepare with the right study plan.',
    urgencyLine: 'High-priority service for students whose shortlist depends on English-language proof.',
    whatYouGet: [
      'Band requirement guidance by university and programme',
      'Study material support for listening, reading, writing, and speaking',
      'Mock test access and score review direction',
      'Use of the IELTS Bank Requirements Checker tool',
      'Registration direction for IDP and British Council',
    ],
    whyThisMatters:
      'Your IELTS band can widen or narrow your shortlist. A better score often creates stronger options for English-taught programmes in Germany.',
    processSteps: [
      'Check your target band based on university requirements',
      'Follow a section-wise study plan',
      'Take mocks and review weak areas',
      'Book the exam through IDP or British Council at the right time',
    ],
    pricingOptions: [
      {
        label: 'Free Study Material Tier',
        price: 'Free',
        note: 'Basic guidance and self-study material access',
      },
      {
        label: 'Guided IELTS Coaching',
        price: 'Pricing on request',
        note: 'Structured prep with mock-test direction',
        featured: true,
      },
    ],
    proof: {
      line: 'IELTS works best when prep is linked to your actual university targets.',
      quote: 'The band strategy kept me from wasting time on generic prep that did not match my shortlist.',
      student: 'Karan Bedi',
      outcome: 'Improved language planning before applications',
    },
    checklistTitle: 'IELTS prep includes',
    checklist: [
      'Band target by university',
      'Listening, reading, writing, and speaking material guidance',
      'Mock test access',
      'IELTS Bank Requirements Checker support',
      'IDP and British Council registration direction',
    ],
    requiredDocuments: [
      'Current IELTS score or mock score if available',
      'Target university list',
      'Preferred intake timeline',
    ],
    emoji: 'IELTS',
    faqs: [
      {
        q: 'What IELTS band do German universities usually ask for?',
        a: 'Most English-taught programmes ask for IELTS 6.0 to 7.0, depending on the university and course.',
      },
      {
        q: 'Do you provide study material?',
        a: 'Yes. We provide section-wise study material and mock test access to help you target your required band.',
      },
      {
        q: 'Can I check university requirements?',
        a: 'Yes, you can use our IELTS Bank Requirements Checker tool in the Free Tools section.',
      },
    ],
  },
  {
    id: 'gre-preparation',
    slug: 'gre-preparation',
    icon: 'gre',
    title: 'GRE Preparation',
    shortDescription: 'GRE guidance for select German master\'s programmes that prefer stronger quant scores.',
    priceTag: 'Pricing on request',
    badgeTone: 'paid',
    heroTitle: 'GRE Preparation for Competitive German Programmes',
    heroSubtitle:
      'GRE is not required for every programme, but it matters for some competitive master\'s courses. We help you decide when GRE is worth the effort and how to prepare for a 310+ score target.',
    urgencyLine: 'Medium-priority service used mainly for select technical and business programmes.',
    whatYouGet: [
      'Clarity on when GRE is needed for Germany',
      'Quant-focused strategy for score improvement',
      'Verbal and AWA fundamentals',
      'Score target planning for 310+ competitive applications',
    ],
    whyThisMatters:
      'GRE only helps when it matches your target programme list. The goal is to prepare with purpose instead of spending months on a test that your shortlist does not even need.',
    processSteps: [
      'Check whether GRE is required for your target courses',
      'Set a realistic score target',
      'Build a quant-first prep plan',
      'Add verbal and AWA practice before the test date',
    ],
    pricingOptions: [
      {
        label: 'GRE Coaching',
        price: 'Pricing on request',
        note: 'Focused support for GRE-relevant programmes',
        featured: true,
      },
    ],
    proof: {
      line: 'GRE should support the shortlist, not distract from it.',
      quote: 'This helped me focus on the programmes where GRE really made a difference.',
      student: 'Rishi Malhotra',
      outcome: 'Aligned GRE prep with actual Germany targets',
    },
    checklistTitle: 'GRE prep includes',
    checklist: [
      'GRE relevance check for Germany',
      'Quant strategy',
      'Verbal and AWA basics',
      '310+ score-target planning',
    ],
    requiredDocuments: [
      'Target programme list',
      'Current GRE score or mock score if available',
      'Preferred intake timeline',
    ],
    emoji: 'GRE',
    faqs: [
      {
        q: 'Is GRE required for all German master\'s programmes?',
        a: 'No. GRE is only required or preferred for select programmes, so a shortlist-based requirement check comes first.',
      },
      {
        q: 'What score should I target?',
        a: 'A 310+ score is a good target for many competitive programmes that consider GRE seriously.',
      },
      {
        q: 'Should I prepare for GRE and IELTS together?',
        a: 'You can, but only if the timeline stays realistic and does not weaken your core application work.',
      },
    ],
  },
  {
    id: 'german-language',
    slug: 'germany-language',
    icon: 'language',
    title: 'German Language (A1-C1)',
    shortDescription: 'German-language planning for Ausbildung, bachelor\'s routes, and long-term Germany readiness.',
    priceTag: 'Guided coaching pricing on request',
    badgeTone: 'paid',
    heroTitle: 'German Language Guidance from A1 to C1',
    heroSubtitle:
      'German is required for Ausbildung and many bachelor\'s programmes, and it also helps daily life, internships, and long-term settlement in Germany.',
    urgencyLine: 'High-priority service for Ausbildung students and applicants targeting German-taught study routes.',
    whatYouGet: [
      'Level guide from A1 beginner to C1 advanced',
      'Online course options such as Goethe Institut and DW Learn German',
      'Exam booking direction for major language tests',
      'Language requirement guidance by programme type',
      'Guided coaching option for structured improvement',
    ],
    whyThisMatters:
      'German is often the difference between a broad shortlist and a narrow one. It is especially important for Ausbildung, many bachelor\'s degrees, and smoother life after arrival.',
    processSteps: [
      'Check your current level and target programme type',
      'Map the level you need for your route',
      'Choose a study format or guided coaching plan',
      'Book the right exam once your level is ready',
    ],
    pricingOptions: [
      {
        label: 'Guided German Coaching',
        price: 'Pricing on request',
        note: 'Structured support for A1 to C1 progression',
        featured: true,
      },
    ],
    proof: {
      line: 'German readiness opens more routes than students expect.',
      quote: 'Once I understood the level required for my route, the whole plan became more realistic.',
      student: 'Anushka Mehta',
      outcome: 'Built a clearer language roadmap before applications',
    },
    checklistTitle: 'German language support includes',
    checklist: [
      'A1 to C1 level roadmap',
      'Goethe Institut and DW Learn German options',
      'Exam booking direction',
      'Programme-wise language requirement guidance',
      'Guided coaching for students who want structure',
    ],
    requiredDocuments: [
      'Current German level if any',
      'Target programme or Ausbildung route',
      'Preferred timeline',
    ],
    emoji: 'DE',
    faqs: [
      {
        q: 'Is German mandatory for Ausbildung?',
        a: 'Yes. Ausbildung usually requires German B1 to B2. German is also essential for daily life and long-term career growth.',
      },
      {
        q: 'What are the language levels?',
        a: 'A1-A2 (Beginner), B1-B2 (Intermediate/Ausbildung level), C1-C2 (Advanced/University level).',
      },
      {
        q: 'Where can I take the exams?',
        a: 'Goethe Institut and TestDaF are the most recognized. We provide direct links and booking guidance.',
      },
    ],
  },
  {
    id: 'student-loan',
    slug: 'study-loan',
    icon: 'loan',
    title: 'Student Loan',
    shortDescription: 'Education loans for Germany from top Indian banks like SBI, Axis, and HDFC Credila.',
    priceTag: 'Assistance Included',
    badgeTone: 'included',
    heroTitle: 'Education Loans for Your Germany Journey',
    heroSubtitle:
      'We help you secure education loans from trusted Indian banks with competitive interest rates and flexible repayment options.',
    urgencyLine: 'Crucial for students who need funding proof for their blocked account and living expenses.',
    whatYouGet: [
      'Partnerships with SBI, Axis Bank, and HDFC Credila',
      'Guidance on loan amounts up to 100% of costs',
      'Interest rate comparison and processing fee clarity',
      'Document assistance for loan application',
      'Sanction letter support for visa appointment',
    ],
    whyThisMatters:
      'Securing a loan early ensures your blocked account transfer happens on time, avoiding last-minute visa delays.',
    processSteps: [
      'Profile and eligibility check with banks',
      'Document collection and submission',
      'Bank verification and property/security assessment',
      'Loan sanction and letter issuance',
      'Disbursement to your blocked account',
    ],
    pricingOptions: [
      {
        label: 'Loan Assistance',
        price: 'Included',
        note: 'Part of our comprehensive service packages',
        featured: true,
      },
    ],
    proof: {
      line: 'Funding should be the least of your worries when moving to Germany.',
      quote: 'The loan process was much smoother with the right bank connects and document help.',
      student: 'Rahul Gupta',
      outcome: 'Secured full funding for Master\'s in Engineering',
    },
    checklistTitle: 'Loan support covers',
    checklist: [
      'Bank selection (SBI, Axis, HDFC Credila)',
      'Interest rate comparison',
      'Required document checklist',
      'Sanction letter follow-up',
    ],
    requiredDocuments: [
      'Admission letter from German university',
      'Academic records',
      'Co-applicant income proof',
      'KYC documents',
    ],
    emoji: 'LOAN',
    faqs: [
      {
        q: 'Which banks do you work with?',
        a: 'We assist with loans from major Indian banks including SBI, Axis, and HDFC Credila.',
      },
      {
        q: 'What are the interest rates?',
        a: 'Interest rates vary by bank and profile, typically ranging from 8.5% to 11.5%.',
      },
    ],
  },
  {
    id: 'blocked-account-service',
    slug: 'blocked-account',
    icon: 'visa',
    title: 'Expatrio Blocked Account',
    shortDescription: 'Open your mandatory German blocked account with Expatrio or Fintiba.',
    priceTag: 'Partner Service',
    badgeTone: 'included',
    heroTitle: 'Secure Your Blocked Account for German Visa',
    heroSubtitle:
      'The blocked account is a mandatory visa requirement. We guide you through opening it with official partners like Expatrio and Fintiba.',
    urgencyLine: 'Must be completed at least 4-6 weeks before your visa appointment.',
    whatYouGet: [
      'Direct links to Expatrio and Fintiba portals',
      'Guidance on the EUR 11,208 requirement (2024)',
      'Step-by-step transfer assistance from India',
      'Confirmation letter for VFS appointment',
      'Activation support after landing in Germany',
    ],
    whyThisMatters:
      'Without a blocked account confirmation, your student visa application will not be processed by the German embassy.',
    processSteps: [
      'Select provider (Expatrio/Fintiba)',
      'Register online with passport',
      'Transfer funds via secure channel',
      'Download confirmation certificate',
    ],
    pricingOptions: [
      {
        label: 'Opening Support',
        price: 'Included',
        note: 'Assistance with portal and transfer',
        featured: true,
      },
    ],
    proof: {
      line: 'Fast confirmation is key for early visa slots.',
      quote: 'Got my Expatrio confirmation in just 2 days. The process was explained perfectly.',
      student: 'Snehal P.',
      outcome: 'Completed financial proof in record time',
    },
    checklistTitle: 'Blocked Account essentials',
    checklist: [
      'Provider selection (Expatrio/Fintiba)',
      'EUR 11,208 deposit (2024 figure)',
      'Transfer confirmation letter',
      'Activation guide',
    ],
    requiredDocuments: [
      'Valid Passport',
      'Admission Letter (for some providers)',
      'Fund transfer details',
    ],
    emoji: 'LOCK',
    faqs: [
      {
        q: 'Which provider is faster?',
        a: 'Both Expatrio and Fintiba are fast, usually providing confirmation within 1-3 business days after funds arrive.',
      },
    ],
  },
  {
    id: 'health-insurance-service',
    slug: 'health-insurance',
    icon: 'insurance',
    title: 'Health Insurance',
    shortDescription: 'Mandatory German health insurance for students (TK, AOK, Barmer).',
    priceTag: 'Approx 110-120 EUR/mo',
    badgeTone: 'included',
    heroTitle: 'German Health Insurance for Students',
    heroSubtitle:
      'Health insurance is mandatory for enrollment and visa. We help you choose between public providers like TK, AOK, and Barmer.',
    urgencyLine: 'Required for both your visa application and university enrollment.',
    whatYouGet: [
      'Comparison of public providers (TK, AOK, Barmer)',
      'Approx cost of 110-120 EUR per month for students',
      'Digital insurance certificate for visa',
      'Travel insurance coverage (if included)',
      'Support with enrollment after arrival',
    ],
    whyThisMatters:
      'Public health insurance in Germany is high-quality and mandatory. Having it sorted ensures you are covered from day one.',
    processSteps: [
      'Choose a provider (TK is most popular)',
      'Submit enrollment application',
      'Receive digital insurance certificate',
      'Activate after arriving in Germany',
    ],
    pricingOptions: [
      {
        label: 'Insurance Guidance',
        price: 'Included',
        note: 'Part of our arrival and visa packages',
        featured: true,
      },
    ],
    proof: {
      line: 'Health coverage is peace of mind in a new country.',
      quote: 'Got my TK certificate instantly. One less thing to worry about for my visa.',
      student: 'Vikram S.',
      outcome: 'Secured mandatory coverage effortlessly',
    },
    checklistTitle: 'Insurance includes',
    checklist: [
      'Public provider (TK/AOK/Barmer)',
      'Visa-ready digital certificate',
      'Monthly premium approx 115 EUR',
      'Full medical & hospital coverage',
    ],
    requiredDocuments: [
      'Passport copy',
      'University admission letter',
      'Bank details (for SEPA)',
    ],
    emoji: 'MED',
    faqs: [
      {
        q: 'Which provider is best for students?',
        a: 'TK (Techniker Krankenkasse) is highly recommended for its English support and student-friendly app.',
      },
    ],
  },
  {
    id: 'university-application-service',
    slug: 'university-application',
    icon: 'uni-application',
    title: 'University Application',
    shortDescription: 'End-to-end support for uni-assist and direct university applications.',
    priceTag: 'Guided Support',
    badgeTone: 'paid',
    heroTitle: 'Step-by-Step University Applications',
    heroSubtitle:
      'We handle the complex uni-assist portal and direct applications, ensuring all documents meet German standards.',
    urgencyLine: 'Deadlines are strict! Winter intake typically closes by July 15th.',
    whatYouGet: [
      'uni-assist account setup and management',
      'Document verification for German standards',
      'Direct application portal support',
      'Deadline tracking and submission alerts',
      'VPD (Vorprüfungsdokumentation) assistance',
    ],
    whyThisMatters:
      'A single missing document or a late submission can result in an instant rejection. We ensure your file is perfect.',
    processSteps: [
      'Document review and notarization guidance',
      'uni-assist / Portal account creation',
      'Uploading and fee payment',
      'Tracking and responding to queries',
      'Final admit coordination',
    ],
    pricingOptions: [
      {
        label: 'Application Package',
        price: 'Pricing on request',
        note: 'Full handling of up to 5 applications',
        featured: true,
      },
    ],
    proof: {
      line: 'Deadlines don\'t wait, and neither should you.',
      quote: 'BVF handled my uni-assist application while I focused on my IELTS. Worth every rupee.',
      student: 'Megha D.',
      outcome: 'Admitted to 3 top public universities',
    },
    checklistTitle: 'Application process',
    checklist: [
      'uni-assist handling',
      'Direct portal support',
      'Document notarization guidance',
      'Deadline management',
    ],
    requiredDocuments: [
      'APS Certificate',
      'Bachelor/School Marksheets',
      'IELTS/German Certificates',
      'SOP & CV',
    ],
    emoji: 'APPLY',
    faqs: [
      {
        q: 'What is uni-assist?',
        a: 'It is a centralized service used by many German universities to process international applications.',
      },
    ],
  },
  {
    id: 'visa-guidance',
    slug: 'visa-guidance',
    icon: 'visa',
    title: 'Visa Guidance',
    shortDescription: 'Student visa support for documents, blocked account, VFS booking, and embassy readiness.',
    priceTag: 'Pricing on request',
    badgeTone: 'premium',
    heroTitle: 'German Student Visa Guidance for Indian Students',
    heroSubtitle:
      'Once you have your admission letter, we help you organize the Type D visa process, financial proof, APS, blocked account, insurance, and appointment planning.',
    urgencyLine: 'High-priority service because visa readiness can make or break the final stage of your Germany journey.',
    whatYouGet: [
      'Eligibility check based on admission letter first',
      'Document guidance: passport, admission letter, blocked account, insurance, photos, APS certificate',
      'Blocked account guidance with the EUR 11,208 yearly requirement',
      'VFS Global India appointment booking direction',
      'Processing timeline guidance: usually 4 to 12 weeks',
      'Embassy direction for New Delhi, Mumbai, Chennai, and Kolkata',
    ],
    whyThisMatters:
      'The visa stage needs exact paperwork, correct sequencing, and strong timeline control. A small document error can delay travel and housing plans.',
    processSteps: [
      'Confirm admission and APS readiness',
      'Prepare blocked account, insurance, and visa documents',
      'Book the VFS appointment and organize the final file',
      'Track processing while planning travel and arrival',
    ],
    pricingOptions: [
      {
        label: 'Visa Guidance',
        price: 'Pricing on request',
        note: 'Contact BVF Germany for the latest visa support fee',
        featured: true,
      },
    ],
    proof: {
      line: 'The visa phase feels safer when the paperwork has a clear order.',
      quote: 'I stopped second-guessing every document once the blocked account, APS, and VFS steps were mapped properly.',
      student: 'Aman Joseph',
      outcome: 'Handled the visa stage with better confidence',
    },
    checklistTitle: 'Visa guidance covers',
    checklist: [
      'Type D visa document checklist',
      'Blocked account guidance',
      'Health insurance guidance',
      'VFS appointment direction',
      'Processing-time expectations',
      'Embassy city guidance',
    ],
    requiredDocuments: [
      'Passport',
      'Admission letter',
      'APS certificate',
      'Blocked account proof',
      'Health insurance proof',
      'Visa photos and supporting forms',
    ],
    emoji: 'VISA',
    faqs: [
      {
        q: 'Can I apply for the visa before getting admission?',
        a: 'No. The first key eligibility item is your university admission letter, followed by the rest of the visa file.',
      },
      {
        q: 'How much money is needed in the blocked account?',
        a: 'The visa guidance page uses the EUR 11,208 per year blocked-account requirement figure provided in your brief.',
      },
      {
        q: 'How long does the visa usually take?',
        a: 'Processing often takes 4 to 12 weeks, depending on the case and appointment timeline.',
      },
    ],
  },
  {
    id: 'on-arrival-support',
    slug: 'on-arrival-support',
    icon: 'arrival',
    title: 'On Arrival Support',
    shortDescription: 'Post-landing support for pickup, SIM, bank account, Anmeldung, insurance, and city setup.',
    priceTag: 'INR 2,999 package',
    badgeTone: 'paid',
    heroTitle: 'On Arrival Support for Your First Days in Germany',
    heroSubtitle:
      'The process does not end at visa approval. We help you settle faster once you land, from airport coordination to SIM cards and address registration.',
    urgencyLine: 'High-priority service for students who want a calmer first week after reaching Germany.',
    whatYouGet: [
      'Airport pickup coordination support',
      'SIM card registration guidance for Telekom, Vodafone, and O2',
      'German bank account guidance for Deutsche Bank, N26, and DKB',
      'Anmeldung address registration guidance',
      'Health insurance enrollment direction for TK, AOK, and Barmer',
      'City orientation and transport card setup support',
    ],
    whyThisMatters:
      'Students often feel most overwhelmed in the first few days after landing. On Arrival Support helps you prioritize the practical tasks that matter first.',
    processSteps: [
      'Confirm your arrival date and city plan',
      'Prepare your first-week checklist before departure',
      'Handle SIM, bank, Anmeldung, and insurance tasks',
      'Complete city orientation and transport setup',
    ],
    pricingOptions: [
      {
        label: 'On Arrival Package',
        price: 'INR 2,999',
        note: 'Suggested package for first-week support',
        featured: true,
      },
    ],
    proof: {
      line: 'Landing feels easier when the first-week priorities are already mapped.',
      quote: 'It helped me know what to do first instead of feeling lost after arriving.',
      student: 'Lavanya M',
      outcome: 'Settled into Germany faster and with less stress',
    },
    checklistTitle: 'On Arrival Support includes',
    checklist: [
      'Airport pickup coordination',
      'SIM registration guidance',
      'German bank account setup guidance',
      'Anmeldung support direction',
      'Health insurance enrollment support',
      'City orientation and transport card setup',
    ],
    requiredDocuments: [
      'Passport and visa copy',
      'Accommodation address if available',
      'Travel itinerary',
      'Insurance and university details',
    ],
    emoji: 'ARR',
    faqs: [
      {
        q: 'Does this include airport pickup?',
        a: 'It includes pickup coordination support and first-week planning guidance around your arrival.',
      },
      {
        q: 'Will you help with SIM and bank account setup?',
        a: 'Yes. The service covers guidance for SIM registration and German bank account setup.',
      },
      {
        q: 'Is this a separate package?',
        a: 'Yes. The recommended price in your brief is INR 2,999 for the On Arrival package.',
      },
    ],
  },
  {
    id: 'accommodation-help',
    slug: 'accommodation',
    icon: 'accommodation',
    title: 'Accommodation Help',
    shortDescription: 'Housing support covering dorms, WG search, private platforms, and realistic rent expectations.',
    priceTag: 'Pricing on request',
    badgeTone: 'paid',
    heroTitle: 'Accommodation Help Before and After Arrival',
    heroSubtitle:
      'We help you understand German housing options, compare platforms, and avoid rushed decisions before you commit to a room or rental.',
    urgencyLine: 'Medium-priority service that becomes critical in expensive housing markets like Munich and Frankfurt.',
    whatYouGet: [
      'Student dormitory guidance through Studentenwerk',
      'WG search direction using WG-Gesucht.de and Immoscout24',
      'Private-platform guidance using Spotahome and HousingAnywhere',
      'Average rent expectations of EUR 400 to EUR 800 per month depending on city',
      'Cost-based city comparison from Leipzig and Dresden to Munich and Frankfurt',
    ],
    whyThisMatters:
      'Accommodation decisions affect budget, stress, and scam risk. Better planning helps students avoid panic payments and unrealistic rent expectations.',
    processSteps: [
      'Choose your city and budget range',
      'Compare dorm, WG, and private-platform options',
      'Check listings carefully before paying',
      'Finalize the safest available option for your timeline',
    ],
    pricingOptions: [
      {
        label: 'Accommodation Help',
        price: 'Pricing on request',
        note: 'Contact BVF Germany for the latest housing-support fee',
        featured: true,
      },
    ],
    proof: {
      line: 'Housing decisions get safer when students know the market before they pay.',
      quote: 'The city and platform comparison saved me from rushing into the wrong listing.',
      student: 'Pooja S',
      outcome: 'Found a more realistic housing strategy before arrival',
    },
    checklistTitle: 'Accommodation help covers',
    checklist: [
      'Studentenwerk dorm guidance',
      'WG and shared-flat search direction',
      'Private-platform recommendations',
      'EUR 400 to EUR 800 rent expectations',
      'Cheap vs expensive city comparison',
    ],
    requiredDocuments: [
      'Target city',
      'Budget range',
      'Expected move-in date',
      'Any listings already shortlisted',
    ],
    emoji: 'HOME',
    faqs: [
      {
        q: 'Do you guarantee accommodation?',
        a: 'No. The service focuses on better search strategy, safer decisions, and realistic market guidance.',
      },
      {
        q: 'Which sites should I check for shared flats?',
        a: 'WG-Gesucht.de and Immoscout24 are two of the platforms included in the service guidance.',
      },
      {
        q: 'What rent should I expect?',
        a: 'The content uses an average rent range of EUR 400 to EUR 800 per month, depending on the city.',
      },
    ],
  },
  {
    id: 'sop-lor-writing',
    slug: 'sop-lor-writing',
    icon: 'sop',
    title: 'SOP & LOR Writing',
    shortDescription: 'Personalized SOP drafting and LOR guidance for stronger university applications.',
    priceTag: 'INR 1,499 SOP | INR 999 LOR',
    badgeTone: 'premium',
    heroTitle: 'SOP and LOR Writing for Germany Applications',
    heroSubtitle:
      'We help students build a cleaner university narrative with a personalized SOP and a clear LOR structure for professors or employers.',
    urgencyLine: 'High-priority service for students who already have a shortlist and now need a stronger written application file.',
    whatYouGet: [
      'Personalized SOP based on academic background and future goals',
      'Structure guidance covering motivation, academic journey, why Germany, and career plan',
      'LOR template and guidance for professors or employers',
      'Two revision rounds included',
      'Turnaround time of 5 to 7 working days',
    ],
    whyThisMatters:
      'A strong SOP and a credible LOR can lift the quality of the full application by making your academic story easier to trust and understand.',
    processSteps: [
      'Share your background, target courses, and goals',
      'Receive a first SOP draft and LOR structure',
      'Review and request up to two revisions',
      'Finalize the university-ready documents within 5 to 7 working days',
    ],
    pricingOptions: [
      {
        label: 'SOP Writing',
        price: 'INR 1,499',
        note: 'Personalized drafting + 2 revisions. Sample: Motivation → Academic Journey → Why Germany → Career Plan.',
        featured: true,
      },
      {
        label: 'LOR Writing Support',
        price: 'INR 999',
        note: 'Template + guidance for professors/employers.',
      },
    ],
    proof: {
      line: 'Good writing helps admissions teams trust your direction faster.',
      quote: 'The SOP finally sounded like my real story and not a copied template.',
      student: 'Aditi Sharma',
      outcome: 'Submitted a stronger, more personal application file',
    },
    checklistTitle: 'SOP & LOR writing includes',
    checklist: [
      'Personalized SOP draft',
      'Why Germany and career-plan structure',
      'LOR template plus recommender guidance',
      'Two revision rounds',
      '5 to 7 working day turnaround',
    ],
    requiredDocuments: [
      'Academic transcripts',
      'Resume or CV',
      'Target university list',
      'Career goals and key achievements',
    ],
    emoji: 'SOP',
    faqs: [
      {
        q: 'How many revisions are included?',
        a: 'Two revision rounds are included in the SOP and LOR writing process.',
      },
      {
        q: 'What is the turnaround time?',
        a: 'The expected turnaround is 5 to 7 working days.',
      },
      {
        q: 'Do you write the LOR completely?',
        a: 'We provide a strong template and guidance that can be finalized with your professor or employer.',
      },
    ],
  },
  {
    id: 'cv-writing',
    slug: 'cv-writing',
    icon: 'cv',
    title: 'CV Writing',
    shortDescription: 'German-format Lebenslauf writing for university and job applications.',
    priceTag: 'INR 999 per CV',
    badgeTone: 'paid',
    heroTitle: 'German-Format CV Writing for Universities and Jobs',
    heroSubtitle:
      'We create a clean tabular Lebenslauf in the format German universities and employers expect, then deliver it in editable and shareable formats.',
    urgencyLine: 'High-priority service for students who need a clear, German-style CV before applications, internships, or jobs.',
    whatYouGet: [
      'European CV format with photo, personal details, and tabular layout',
      'Academic and work-experience sections structured properly',
      'Skills, languages, and extracurricular sections refined for clarity',
      'Delivered as both Word and PDF',
      'Turnaround time of 3 to 5 working days',
    ],
    whyThisMatters:
      'A German-format CV is often expected to look more structured and detail-oriented than a generic resume. Clean formatting makes your application feel more credible.',
    processSteps: [
      'Share your current resume and target use case',
      'We convert it into a German-style tabular CV',
      'Review layout, wording, and personal details',
      'Receive the final version in Word and PDF within 3 to 5 working days',
    ],
    pricingOptions: [
      {
        label: 'CV Writing',
        price: 'INR 999',
        note: 'German tabular Lebenslauf format. Delivered in Word and PDF.',
        featured: true,
      },
    ],
    proof: {
      line: 'A better CV helps the rest of the application feel organized too.',
      quote: 'The Lebenslauf format looked much more professional than my old resume.',
      student: 'Nikhil Rao',
      outcome: 'Upgraded to a cleaner university and job-ready CV',
    },
    checklistTitle: 'CV writing includes',
    checklist: [
      'German tabular Lebenslauf format',
      'Academic and work-experience cleanup',
      'Skills, languages, and extracurricular sections',
      'Word and PDF export',
      '3 to 5 working day turnaround',
    ],
    requiredDocuments: [
      'Current resume or CV',
      'Academic background summary',
      'Work or internship details',
      'Target use case: university, internship, or job',
    ],
    emoji: 'CV',
    faqs: [
      {
        q: 'What format do you use?',
        a: 'The service uses a German-style tabular Lebenslauf format suitable for university and job applications.',
      },
      {
        q: 'Will I get an editable file?',
        a: 'Yes. The final CV is delivered in both Word and PDF formats.',
      },
      {
        q: 'How fast is the turnaround?',
        a: 'The expected turnaround time is 3 to 5 working days.',
      },
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
