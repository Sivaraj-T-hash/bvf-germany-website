import StudyProgramPage from '@/components/StudyProgramPage';

export default function MsGermanyPage() {
  return (
    <StudyProgramPage
      title="MS in Germany"
      subtitle="Germany is especially attractive for master's students who want research depth, strong technical ecosystems, and more English-taught options than at the bachelor's level. The key decision is whether your earlier degree, language route, and career goal line up with a realistic master's shortlist."
      heroBadge="Master's pathway"
      heroImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop"
      heroHighlights={['More English options', 'Strong research links', 'Academic fit matters most']}
      primaryCta={{
        label: 'Check eligibility',
        to: '/tools',
      }}
      secondaryCta={{ label: 'Build my shortlist', to: '/bookings' }}
      summaryFacts={[
        { label: 'Typical duration', value: '3 to 4 semesters' },
        { label: 'Strongest fields', value: 'STEM, data, engineering, research-led programmes' },
        { label: 'Language split', value: 'Many English-taught options' },
        { label: 'Decision point', value: 'Degree fit, modules, language, funding' },
      ]}
      overviewTitle="A strong MS shortlist starts with fit, not just rankings"
      overviewText="Germany offers many master's programmes that combine academic depth, practical projects, and strong links to research groups or industry. But admissions teams usually care most about whether your bachelor's degree actually matches the target master's curriculum, whether your language proof is ready, and whether your application explains why this programme is the right academic progression for you."
      overviewBullets={[
        'Check whether the masters is consecutive and expects a closely related undergraduate background.',
        'Use English-taught options strategically, but do not ignore the value of basic German for internships and life in Germany.',
        'Match your shortlist to your module history, career direction, and funding reality.',
      ]}
      checklistTitle="What to confirm before applying for an MS"
      checklistItems={[
        'Whether your bachelor degree is academically related to the target programme.',
        'Whether the course is consecutive, partially related, or open to broader backgrounds.',
        'Whether the university uses uni-assist, direct application, or a specialised portal.',
        'Whether you need IELTS, TOEFL, German proof, APS, or additional module evidence.',
      ]}
      warningText="At master's level, titles can look similar while admission expectations differ sharply. Read the admission regulations, not just the marketing summary, before you decide a programme is a fit."
      pathwaysTitle="Which master's route fits your profile?"
      pathwaysIntro="Most applicants do better when they identify the right academic route first instead of applying broadly to every English-taught programme they find."
      pathways={[
        {
          title: 'Direct consecutive masters',
          audience: 'Path 1',
          summary: 'Best if your undergraduate degree strongly matches the target field and the programme expects a clear academic continuation.',
          bullets: [
            'Common in engineering, computer science, data, and natural sciences.',
            'Module overlap is often important.',
            'Strongest route for students with a clear subject progression.',
          ],
          linkLabel: 'Search international programmes',
          linkTo: 'https://www.myguide.de/en/',
        },
        {
          title: 'Interdisciplinary or adjacent route',
          audience: 'Path 2',
          summary: 'Best if your background is related but not identical, and you are targeting programmes that allow adjacent academic profiles.',
          bullets: [
            'Works when the university explicitly allows mixed or overlapping backgrounds.',
            'Requires especially careful reading of module and eligibility rules.',
            'Useful for fields such as data science, management, or digital transformation.',
          ],
          linkLabel: 'Browse all degree programmes',
          linkTo: 'https://www.daad.de/en/studying-in-germany/universities/all-degree-programmes/',
        },
        {
          title: 'Research or applied specialisation',
          audience: 'Path 3',
          summary: 'Best if you already know whether you want a thesis-heavy research track or a more industry-oriented application route.',
          bullets: [
            'Check labs, institutes, industry links, and thesis options.',
            'Useful when you are comparing technical universities with applied sciences institutions.',
            'A better long-term choice than using rankings alone.',
          ],
          linkLabel: 'Explore universities in Germany',
          linkTo: 'https://www.hochschulkompass.de/en/study-in-germany.html',
        },
      ]}
      requirementsTitle="What master's applicants usually need to show"
      requirementsIntro="The strongest MS applications are usually coherent: the earlier degree, target programme, language route, and future goal all reinforce each other."
      requirements={[
        {
          eyebrow: 'Academic background',
          title: 'Your previous degree has to make sense for the target course',
          text: 'A masters in Germany is often a continuation of earlier study, not a total academic restart. Admissions teams may compare your transcript and course modules against the programme requirements in detail.',
          bullets: [
            'Check whether the programme is described as consecutive.',
            'Review credit, ECTS, and subject-module expectations.',
            'If your background is adjacent, prioritise programmes that explicitly allow that flexibility.',
          ],
        },
        {
          eyebrow: 'Language',
          title: 'English opens doors, but exact proof still matters',
          text: 'Many masters programmes are taught in English, especially in STEM. Others are German-taught or bilingual. The university decides which test and score combinations it accepts.',
          bullets: [
            'English routes commonly expect IELTS or TOEFL.',
            'German routes may expect B2 or C1 proof depending on the programme.',
            'Basic German still helps with networking, housing, and internships.',
          ],
        },
        {
          eyebrow: 'Documents',
          title: 'Your file should make your academic story easy to understand',
          text: 'At masters level, a clean, coherent file matters. Admissions teams should be able to see what you studied, what projects or research you completed, and why this next step is logical.',
          bullets: [
            'Degree certificate and transcripts',
            'CV, motivation letter, and recommendation letters if required',
            'Language proof and passport documents',
            'Module descriptions or syllabus evidence where the programme requests them',
          ],
        },
      ]}
      stepsTitle="A practical MS application sequence"
      stepsIntro="The best master's applications usually move from fit-checking to evidence-building, then to applications, then to funding and visa planning."
      steps={[
        {
          title: 'Define the target field',
          text: 'Narrow your goal to a few connected areas instead of applying randomly across many unrelated masters subjects.',
        },
        {
          title: 'Check academic fit',
          text: 'Read the programme-specific admission regulations and compare them with your transcript, credits, and modules before you commit.',
        },
        {
          title: 'Lock the language route',
          text: 'Confirm whether you are targeting English-taught, German-taught, or bilingual options and schedule the right language test early.',
        },
        {
          title: 'Build the file',
          text: 'Prepare transcripts, CV, motivation letter, references if needed, and any supporting academic documents or project summaries.',
        },
        {
          title: 'Apply through the correct channel',
          text: 'Some universities take direct applications, many use uni-assist, and some have their own internal graduate portals.',
        },
        {
          title: 'Plan funding and visa in parallel',
          text: 'As soon as you are progressing toward admission, work on finances, visa timing, housing, and insurance preparation so you do not lose time later.',
        },
      ]}
      planningTitle="Budget and visa planning should start before admission arrives"
      planningIntro="Even when tuition is manageable, relocation costs, city choice, and visa proof can become the real bottlenecks for master's students."
      planningCards={[
        {
          eyebrow: 'Cost planning',
          title: 'Public tuition can be low, but relocation is not free',
          text: 'Many public universities remain affordable, but masters students still need a realistic budget for housing, insurance, transport, study needs, and the first months of relocation.',
          bullets: [
            'Semester contributions still apply.',
            'Private institutions can cost far more than public universities.',
            'Housing pressure differs significantly by city.',
          ],
        },
        {
          eyebrow: 'Visa and insurance',
          title: 'Your admission plan and visa plan should move together',
          text: 'If you need a student visa, make sure financial proof, insurance planning, and embassy timing are aligned. Do not wait until the last moment after receiving an offer.',
          bullets: [
            'Health insurance is mandatory for study and enrolment.',
            'Blocked-account or equivalent financial proof rules should be checked against current official guidance.',
            'APS may still be part of the route for some applicants depending on nationality and stage.',
          ],
        },
        {
          eyebrow: 'Common mistakes',
          title: 'The biggest risk is applying to programmes that do not fit',
          text: 'Students often waste money and time applying to attractive English-taught programmes that are not actually compatible with their bachelor background or project profile.',
          bullets: [
            'Do not ignore module mismatch warnings.',
            'Do not delay your language test until application deadlines are too close.',
            'Do not assume every English-taught programme is open to every background.',
          ],
        },
      ]}
      toolsTitle="Official tools that help you verify your MS route"
      tools={[
        {
          title: 'My GUIDE',
          description: 'A useful starting point from DAAD and partners for finding programmes and getting oriented around suitable study options in Germany.',
          href: 'https://www.myguide.de/en/',
        },
        {
          title: 'DAAD all degree programmes',
          description: 'Helpful when you want to browse detailed programme entries and compare admission information across universities.',
          href: 'https://www.daad.de/en/studying-in-germany/universities/all-degree-programmes/',
        },
        {
          title: 'uni-assist',
          description: 'Essential for many international masters applications when the university relies on uni-assist processing.',
          href: 'https://www.uni-assist.de/en/',
        },
        {
          title: 'Hochschulkompass',
          description: 'Useful for broader comparison of programmes and institutions before you finalise a shortlist.',
          href: 'https://www.hochschulkompass.de/en/study-in-germany.html',
        },
      ]}
      tracksTitle="Common MS specialisations students compare"
      tracksIntro="Germany is especially attractive for specialised master's study where academic depth, research links, and applied industry exposure can work together."
      tracks={[
        { title: 'Computer science', text: 'Strong for systems, software, AI, distributed computing, and research-led technical careers.', icon: 'CS' },
        { title: 'Data science and AI', text: 'Popular for students moving toward analytics, machine learning, and intelligent systems work.', icon: 'DATA' },
        { title: 'Mechanical engineering', text: 'A good route for students aiming at advanced design, production, manufacturing, and mobility sectors.', icon: 'MECH' },
        { title: 'Electrical engineering', text: 'Useful for automation, circuits, power, and control systems pathways.', icon: 'ELEC' },
        { title: 'Automation and robotics', text: 'Strong option where interdisciplinary engineering and intelligent systems meet.', icon: 'ROBO' },
        { title: 'Renewable energy', text: 'A growing field for students interested in energy transition, sustainability, and infrastructure.', icon: 'ENER' },
      ]}
      universitiesTitle="Universities students often shortlist for MS study"
      universities={[
        'Technical University of Munich',
        'RWTH Aachen University',
        'Heidelberg University',
        'Technical University of Berlin',
        'Karlsruhe Institute of Technology',
        'University of Stuttgart',
        'TU Darmstadt',
        'University of Bonn',
      ]}
      logos={[
        'Technical University of Munich',
        'RWTH Aachen University',
        'Heidelberg University',
        'Technical University of Berlin',
        'Karlsruhe Institute of Technology',
        'University of Stuttgart',
      ]}
      faqs={[
        {
          q: 'Is Germany a good option for an English-taught MS?',
          a: 'Yes, especially in STEM fields. Germany offers many English-taught masters options, but each programme still sets its own proof, academic background, and application requirements, so students should shortlist based on fit rather than language alone.',
        },
        {
          q: 'Can I change my field completely for an MS in Germany?',
          a: 'Sometimes, but many masters degrees are consecutive and expect a related undergraduate background. A partial shift is possible in some interdisciplinary programmes, but total field changes are less common and should be checked carefully.',
        },
        {
          q: 'How important is basic German if my MS is in English?',
          a: 'It is still useful. Even when the classroom language is English, basic German can improve internships, networking, day-to-day life, and sometimes part-time work options.',
        },
        {
          q: 'What makes a masters application more competitive?',
          a: 'A clear fit between your previous degree and the target programme, on-time language proof, a well-organised document file, and a shortlist built on realistic academic alignment usually matter more than generic motivational language.',
        },
      ]}
      finalCtaTitle="Need help building a realistic MS shortlist?"
      finalCtaText="We can help you narrow programmes by fit, language, deadlines, and budget so your master's plan is stronger before you start paying for applications and translations."
      finalPrimaryCta={{ label: 'Book an MS planning session', to: '/bookings' }}
      finalSecondaryCta={{ label: 'Open My GUIDE', to: 'https://www.myguide.de/en/', external: true }}
    />
  );
}



