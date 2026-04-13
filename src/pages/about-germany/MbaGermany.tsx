import StudyProgramPage from '@/components/StudyProgramPage';

export default function MbaGermanyPage() {
  return (
    <StudyProgramPage
      title="MBA in Germany"
      subtitle="Germany can be a strong MBA destination for students who want a European business context, international cohorts, and access to major corporate hubs. The smartest first step is to decide whether you truly need an MBA now, whether your work experience is strong enough, and whether the programme's cost and career outcomes fit your goals."
      heroBadge="MBA pathway"
      heroImage="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop"
      heroHighlights={['Experience-sensitive', 'Mostly English-taught', 'Higher tuition than public academic masters']}
      primaryCta={{
        label: 'Check eligibility',
        to: '/tools',
      }}
      secondaryCta={{ label: 'Discuss my MBA fit', to: '/bookings' }}
      summaryFacts={[
        { label: 'Typical duration', value: '12 to 24 months' },
        { label: 'Teaching language', value: 'Mostly English' },
        { label: 'Most common provider type', value: 'Business schools and specialised universities' },
        { label: 'Decision point', value: 'Work experience, ROI, career target' },
      ]}
      overviewTitle="The MBA decision is less about Germany alone and more about timing, profile, and return on investment"
      overviewText="Unlike many public academic master's programmes in Germany, MBA programmes are often more experience-focused, more internationally oriented, and more expensive. That means students should assess whether they already have enough work experience, whether they need a classic MBA or a different management degree, and whether the target programme's outcomes justify the investment."
      overviewBullets={[
        'Many MBA programmes expect prior work experience rather than fresh graduates.',
        'English-taught delivery is common, but admission standards can still include interviews, essays, or test expectations.',
        'The strongest MBA applications connect your past experience, future goal, and reason for choosing that specific school.',
      ]}
      checklistTitle="Before you commit to an MBA shortlist"
      checklistItems={[
        'Check whether the school expects full-time work experience and how much.',
        'Decide whether you need a classic MBA, a management masters, or an executive format.',
        'Review tuition, scholarship, and employer-support reality early.',
        'Confirm whether the programme expects GMAT, GRE, interview rounds, or only a strong profile review.',
      ]}
      warningText="MBA branding can be persuasive, but programme quality, class profile, career services, accreditation, and total cost vary widely. Compare the full offer, not only the degree title."
      pathwaysTitle="Which business-study route fits you best right now?"
      pathwaysIntro="Students often get better results when they choose the right management route for their stage instead of forcing an MBA too early."
      pathways={[
        {
          title: 'Classic MBA route',
          audience: 'Path 1',
          summary: 'Best if you already have meaningful work experience and want a general management, leadership, or career-pivot qualification.',
          bullets: [
            'Usually stronger for applicants with 2 to 3+ years of experience.',
            'Often includes interviews, essays, and career-goal evaluation.',
            'Works best when you have a clear post-MBA direction.',
          ],
          linkLabel: 'Browse business programmes',
          linkTo: 'https://www.daad.de/en/studying-in-germany/universities/all-degree-programmes/',
        },
        {
          title: 'Management masters instead',
          audience: 'Path 2',
          summary: 'Best if you are early in your career, recently graduated, or stronger academically than professionally at this stage.',
          bullets: [
            'Often a smarter route for fresher applicants than a rushed MBA.',
            'Can still lead into consulting, analytics, finance, or business roles.',
            'Usually more academic and sometimes more affordable than an MBA.',
          ],
          linkLabel: 'Search via My GUIDE',
          linkTo: 'https://www.myguide.de/en/',
        },
        {
          title: 'Executive or part-time route',
          audience: 'Path 3',
          summary: 'Best if you are already employed and want to upskill without stepping out fully from work.',
          bullets: [
            'Useful for experienced professionals with stable career momentum.',
            'Needs a careful check on visa, time commitment, and employer flexibility.',
            'Not every applicant needs this route, but it can be the best ROI for some profiles.',
          ],
          linkLabel: 'Compare schools on Hochschulkompass',
          linkTo: 'https://www.hochschulkompass.de/en/study-in-germany.html',
        },
      ]}
      requirementsTitle="What MBA applicants usually need to present convincingly"
      requirementsIntro="A strong MBA file usually blends career story, academic readiness, and leadership potential rather than relying on grades alone."
      requirements={[
        {
          eyebrow: 'Experience',
          title: 'Work experience is often part of the core admission logic',
          text: 'Many MBA programmes value full-time professional experience because classroom learning often depends on peer discussion, leadership examples, and practical business context.',
          bullets: [
            'Some schools expect 2 to 3 years or more of experience.',
            'Leadership, ownership, or progression in your role strengthens the file.',
            'Fresh graduates may be better matched to management or specialised masters degrees instead.',
          ],
        },
        {
          eyebrow: 'Language and tests',
          title: 'English proof is common, but some schools ask for more',
          text: 'Most MBA programmes in Germany are English-taught, yet admissions can still involve language tests, essays, recommendations, interviews, and sometimes GMAT or GRE expectations.',
          bullets: [
            'IELTS or TOEFL is common for English delivery.',
            'Interview performance and clarity of career goals matter.',
            'Always verify whether a test is mandatory or optional for your target school.',
          ],
        },
        {
          eyebrow: 'Documents',
          title: 'Your story has to show why the MBA is the next logical move',
          text: 'An MBA file is usually stronger when your CV, essays, and recommendations show leadership potential, progression, and a clear reason for choosing Germany and that specific school.',
          bullets: [
            'Degree documents and transcripts',
            'CV with quantified work achievements',
            'Recommendation letters where requested',
            'Motivation essays, statement of goals, and interview preparation',
          ],
        },
      ]}
      stepsTitle="A better order for planning an MBA in Germany"
      stepsIntro="MBA decisions become clearer when students evaluate readiness and ROI before they build a school list."
      steps={[
        {
          title: 'Check whether an MBA is the right degree now',
          text: 'Compare an MBA against management masters and specialised business masters options before assuming MBA is the only route.',
        },
        {
          title: 'Define your post-degree goal',
          text: 'Clarify whether you want consulting, leadership growth, entrepreneurship, industry transition, or European market exposure.',
        },
        {
          title: 'Audit your profile honestly',
          text: 'Look at work experience length, role progression, leadership examples, grades, language proof, and whether you need test preparation.',
        },
        {
          title: 'Shortlist schools by fit and cost',
          text: 'Compare class profile, tuition, location, internships, alumni network, and employer visibility rather than choosing by prestige alone.',
        },
        {
          title: 'Build a strong narrative file',
          text: 'Prepare essays, CV, recommendations, interview preparation, and language proof in a way that clearly connects your past and next goal.',
        },
        {
          title: 'Plan funding and relocation',
          text: 'MBA budgets can be higher than other Germany study routes, so financing, scholarship strategy, and visa readiness should move in parallel.',
        },
      ]}
      planningTitle="MBA planning should focus hard on cost, ROI, and career outcome"
      planningIntro="Germany can offer strong business-school value, but MBA students should weigh tuition, opportunity cost, salary expectations, and post-study direction more carefully than most other applicants."
      planningCards={[
        {
          eyebrow: 'Investment',
          title: 'MBA tuition is often much higher than public academic masters',
          text: 'Unlike many public masters degrees in Germany, MBA programmes frequently carry substantial tuition. Students should evaluate total cost, not just headline tuition.',
          bullets: [
            'Include living costs, relocation, insurance, and lost income if leaving work.',
            'Compare scholarship options and employer support early.',
            'Ask whether the programme has measurable career-service strength.',
          ],
        },
        {
          eyebrow: 'Visa and transition',
          title: 'Your career and visa plan should support each other',
          text: 'If you need a student visa, financial proof and timing still matter. MBA applicants also need to think about how the programme will connect to internships, post-study opportunities, and networking in Germany or Europe.',
          bullets: [
            'Health insurance remains mandatory.',
            'Financial proof rules should be checked against current official guidance.',
            'School location can influence networking and employer access.',
          ],
        },
        {
          eyebrow: 'Common mistakes',
          title: 'A rushed MBA can be expensive and poorly timed',
          text: 'Students often apply too early in their career, underestimate tuition, or choose schools without checking whether the cohort, outcomes, and employer access really fit their goal.',
          bullets: [
            'Do not use MBA as a default label for every business ambition.',
            'Do not ignore the value of management masters alternatives.',
            'Do not assume a high tuition programme automatically gives stronger outcomes.',
          ],
        },
      ]}
      toolsTitle="Official tools to compare business-study options"
      tools={[
        {
          title: 'DAAD all degree programmes',
          description: 'Useful when comparing business, management, and international programmes across Germany.',
          href: 'https://www.daad.de/en/studying-in-germany/universities/all-degree-programmes/',
        },
        {
          title: 'My GUIDE',
          description: 'Helpful for exploring study options in Germany and narrowing down suitable programmes before deeper school research.',
          href: 'https://www.myguide.de/en/',
        },
        {
          title: 'Hochschulkompass',
          description: 'Useful for checking institutions, degree types, and broader study options in Germany.',
          href: 'https://www.hochschulkompass.de/en/study-in-germany.html',
        },
        {
          title: 'uni-assist',
          description: 'Important only when your target school uses uni-assist for international applications, so verify each school route individually.',
          href: 'https://www.uni-assist.de/en/',
        },
      ]}
      tracksTitle="Business focus areas students most often compare"
      tracksIntro="Students usually get a better outcome when they connect the programme focus directly to the role they want after graduation."
      tracks={[
        { title: 'Finance', text: 'Best for students targeting corporate finance, investment-related roles, or strategic financial management.', icon: 'FIN' },
        { title: 'Marketing', text: 'Useful for brand, growth, digital marketing, and go-to-market oriented career plans.', icon: 'MKT' },
        { title: 'Consulting', text: 'Good fit when you want structured problem-solving, strategy work, and client-facing progression.', icon: 'CONS' },
        { title: 'Operations and supply chain', text: 'Relevant for process improvement, industrial operations, and cross-border coordination roles.', icon: 'OPS' },
        { title: 'Entrepreneurship', text: 'Strong for students thinking about startup building, innovation, and venture-facing environments.', icon: 'VENT' },
        { title: 'Analytics and digital business', text: 'Useful for students blending business thinking with data-driven decision making.', icon: 'DATA' },
      ]}
      universitiesTitle="Schools students often compare for MBA and business study"
      universities={[
        'Mannheim Business School',
        'ESMT Berlin',
        'Frankfurt School of Finance and Management',
        'WHU - Otto Beisheim School of Management',
        'HHL Leipzig Graduate School of Management',
        'Technical University of Munich',
      ]}
      logos={[
        'Mannheim Business School',
        'ESMT Berlin',
        'Frankfurt School of Finance and Management',
        'WHU - Otto Beisheim School of Management',
        'HHL Leipzig Graduate School of Management',
        'Technical University of Munich',
      ]}
      faqs={[
        {
          q: 'Do I need work experience for an MBA in Germany?',
          a: 'In many cases, yes. A lot of MBA programmes expect meaningful professional experience because class discussions, leadership evaluation, and career outcomes are designed for applicants who have already worked full time.',
        },
        {
          q: 'Is an MBA always better than a management masters?',
          a: 'No. For early-career applicants, a management masters can often be a stronger and more affordable fit. MBA becomes more compelling when you already have enough professional experience and a clear reason to pursue a leadership or pivot-focused degree.',
        },
        {
          q: 'Are MBA programmes in Germany mostly in English?',
          a: 'Yes, many are. But English delivery does not mean low admission standards. Schools may still expect strong essays, interviews, recommendations, and sometimes test results.',
        },
        {
          q: 'What is the biggest MBA planning mistake students make?',
          a: 'Choosing by brand name or location alone. MBA value depends heavily on cohort quality, career services, industry links, tuition level, and whether the programme really fits your experience and next-step goal.',
        },
      ]}
      finalCtaTitle="Need help deciding whether Germany is the right MBA move for you?"
      finalCtaText="We can help you evaluate profile fit, school type, cost, and realistic post-study direction before you commit to an MBA application strategy."
      finalPrimaryCta={{ label: 'Book an MBA planning session', to: '/bookings' }}
      finalSecondaryCta={{
        label: 'Browse official business programmes',
        to: 'https://www.daad.de/en/studying-in-germany/universities/all-degree-programmes/',
        external: true,
      }}
    />
  );
}



