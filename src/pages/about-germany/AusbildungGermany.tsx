import StudyProgramPage from '@/components/StudyProgramPage';

export default function AusbildungGermanyPage() {
  return (
    <StudyProgramPage
      title="Ausbildung in Germany"
      subtitle="Ausbildung is Germany's vocational training route for students who want paid practical training, German workplace exposure, and a skills-first path into employment."
      heroBadge="Vocational training"
      heroHighlights={[
        'Duration: 2-3 years',
        'German B1-B2 mandatory',
        'Paid apprenticeship with monthly stipend',
      ]}
      primaryCta={{
        label: 'Discuss Ausbildung fit',
        to: '/bookings',
      }}
      secondaryCta={{ label: 'Compare study paths', to: '/study-in-germany' }}
      summaryFacts={[
        { label: 'Duration', value: '2-3 years' },
        { label: 'Eligibility', value: '10th-12th Grade, no degree required' },
        { label: 'Language Req', value: 'German B1-B2 (mandatory)' },
        { label: 'Tuition / Cost', value: 'Paid apprenticeship - EUR 600-EUR 1,200/month stipend' },
      ]}
      overviewTitle="Ausbildung is built for students who want practical training instead of a classic university degree"
      overviewText="Germany's Ausbildung route combines workplace training and vocational learning, making it a strong option for students who want hands-on skills, early earning potential, and a direct career path."
      overviewBullets={[
        'The route is open to students after 10th to 12th Grade and does not require a degree.',
        'German B1 to B2 is mandatory because daily training and workplace communication happen in German.',
        'Common key fields include Nursing, IT, Mechatronics, Hospitality, and Logistics.',
      ]}
      checklistTitle="Ausbildung planning checklist"
      checklistItems={[
        'Confirm that a practical, work-based route suits you better than a university degree.',
        'Plan German B1 to B2 early because the language requirement is mandatory.',
        'Choose a training field that fits your strengths and daily-work preference.',
        'Understand stipend expectations, accommodation planning, and relocation before committing.',
      ]}
      warningText="Ausbildung is not a shortcut version of university study. It is a different route with workplace expectations, mandatory German, and a more practical day-to-day routine."
      pathwaysTitle="Three decisions shape a realistic Ausbildung plan"
      pathwaysIntro="Students usually do better when they decide whether the route fits their lifestyle, language readiness, and field interest before they apply."
      pathways={[
        {
          title: 'Route fit',
          audience: 'Decision 1',
          summary: 'Ausbildung is strongest for students who prefer structured, practical training over classroom-heavy academic study.',
          bullets: [
            'It can be a strong fit after 10th, 11th, or 12th Grade.',
            'No university degree is required to begin this route.',
            'The best decision starts with honest lifestyle fit, not trend-following.',
          ],
          linkLabel: 'Compare all Germany routes',
          linkTo: '/study-in-germany',
        },
        {
          title: 'Language readiness',
          audience: 'Decision 2',
          summary: 'German is mandatory for Ausbildung, so language planning should start before field-specific applications.',
          bullets: [
            'German B1 to B2 is usually required.',
            'Workplace communication makes language more important than students often expect.',
            'A stronger language base usually creates more options and smoother settlement.',
          ],
          linkLabel: 'Plan German language support',
          linkTo: '/services/germany-language',
        },
        {
          title: 'Field choice',
          audience: 'Decision 3',
          summary: 'The best Ausbildung plans begin with the kind of daily work you can realistically see yourself doing for 2 to 3 years.',
          bullets: [
            'Popular fields include Nursing, IT, Mechatronics, Hospitality, and Logistics.',
            'Your field should match both your strengths and communication comfort.',
            'A better field match reduces the risk of confusion after arrival.',
          ],
          linkLabel: 'Talk through my field options',
          linkTo: '/bookings',
        },
      ]}
      requirementsTitle="What Ausbildung applicants usually need to prove"
      requirementsIntro="The strongest Ausbildung plans balance language readiness, practical fit, and a realistic expectation of work life in Germany."
      requirements={[
        {
          eyebrow: 'Eligibility',
          title: 'School completion is enough to begin planning the route',
          text: 'Students can usually start Ausbildung planning after 10th to 12th Grade, without needing a university degree.',
          bullets: [
            "The route is open even if you do not have a bachelor's degree.",
            'It is a skills-first path rather than an academic-university path.',
            'Field choice matters more than collecting extra academic certificates.',
          ],
        },
        {
          eyebrow: 'Language',
          title: 'German B1-B2 is mandatory, not optional',
          text: 'Because the route is practical and workplace-focused, students need German for both training and everyday life.',
          bullets: [
            'German B1 to B2 is the usual language requirement.',
            'Communication comfort affects training performance directly.',
            'Students should treat German prep as a core step, not a side task.',
          ],
        },
        {
          eyebrow: 'Cost',
          title: 'Ausbildung is paid, but budgeting still matters',
          text: 'Students receive a stipend, but they should still plan for housing, transport, food, and first-month setup in Germany.',
          bullets: [
            'Training pay is typically about EUR 600 to EUR 1,200 per month, depending on the field.',
            'Living costs still change by city.',
            'A better budget plan helps students pick the right training location.',
          ],
        },
      ]}
      stepsTitle="A practical order for Ausbildung planning"
      stepsIntro="Students usually move faster when they handle route fit and language before searching widely for training positions."
      steps={[
        {
          title: 'Decide if Ausbildung fits your goals',
          text: "Compare Ausbildung with bachelor's and master's pathways before you commit to the vocational route.",
        },
        {
          title: 'Choose the field',
          text: 'Start with Nursing, IT, Mechatronics, Hospitality, Logistics, or another practical area that fits your strengths.',
        },
        {
          title: 'Build German B1-B2 readiness',
          text: 'Treat language as a major milestone because it directly affects training and daily life.',
        },
        {
          title: 'Prepare your profile and documents',
          text: 'Keep academic records, identity proof, CV, and any relevant field experience organized before applying.',
        },
        {
          title: 'Apply in realistic locations',
          text: 'Ausbildung is available Germany-wide, so compare city cost and field demand before finalizing where to apply.',
        },
        {
          title: 'Plan arrival and settlement',
          text: 'Once the route is clear, move into accommodation, travel, insurance, and early-city planning.',
        },
      ]}
      planningTitle="Ausbildung planning should connect field, language, and lifestyle"
      planningIntro="Students usually do best in Ausbildung when they understand the daily reality of the route before they arrive in Germany."
      planningCards={[
        {
          eyebrow: 'Field planning',
          title: 'Choose the work itself, not just the country',
          text: 'The route can work well across Nursing, IT, Mechatronics, Hospitality, and Logistics when students pick a field that genuinely fits their strengths.',
          bullets: [
            'Practical comfort matters as much as salary or popularity.',
            'Different fields demand different styles of communication and daily work.',
            'The right field match creates a more stable long-term outcome.',
          ],
        },
        {
          eyebrow: 'Location',
          title: 'Ausbildung is available Germany-wide',
          text: 'Students should compare cities and states by field demand, rent, and settling ease rather than assuming every location feels the same.',
          bullets: [
            'The route is Germany-wide across all states.',
            'Cheaper cities can ease the first-year budget.',
            'Location planning should happen alongside field planning.',
          ],
        },
        {
          eyebrow: 'Money planning',
          title: 'A stipend helps, but life still needs budgeting',
          text: 'The monthly stipend can support the route, but students still need to budget carefully for housing, food, transport, and personal expenses.',
          bullets: [
            'Training pay is typically about EUR 600 to EUR 1,200 per month, depending on the field.',
            'Major cities can still be expensive to live in.',
            'A clearer financial plan makes the route more sustainable.',
          ],
        },
      ]}
      toolsTitle="Useful BVF pages before you finalize an Ausbildung plan"
      tools={[
        {
          title: 'Study in Germany overview',
          description: "Compare Ausbildung against bachelor's and master's routes before choosing one.",
          href: '/study-in-germany',
        },
        {
          title: 'German Language Guidance',
          description: 'Build the B1 to B2 German level needed for vocational training.',
          href: '/services/germany-language',
        },
        {
          title: 'Accommodation Help',
          description: 'Plan housing early if you are moving into an Ausbildung city.',
          href: '/services/accommodation-help',
        },
        {
          title: 'Book route guidance',
          description: 'Talk through whether Ausbildung is the right Germany path for you.',
          href: '/bookings',
        },
      ]}
      tracksTitle="Key Ausbildung fields students usually compare"
      tracksIntro="The strongest Ausbildung plans begin with a field that matches both your personality and your practical strengths."
      tracks={[
        { title: 'Nursing', text: 'A strong route for students comfortable with responsibility, care routines, and people-facing work.', icon: 'NUR' },
        { title: 'IT', text: 'Useful for students interested in systems, support, and technology-linked work environments.', icon: 'IT' },
        { title: 'Mechatronics', text: 'A practical technical route that blends mechanics, systems, and hands-on problem solving.', icon: 'MECH' },
        { title: 'Hospitality', text: 'A service-focused route for students who work well in fast-moving team environments.', icon: 'HOSP' },
        { title: 'Logistics', text: 'A strong option for students interested in movement, operations, and structured workflows.', icon: 'LOG' },
        { title: 'Service Roles', text: 'Additional practical routes can fit students who prefer active, work-based learning over classroom-heavy study.', icon: 'SERV' },
      ]}
      universitiesTitle="Ausbildung opportunities are available across Germany"
      universities={[
        'Germany-wide training providers across all states',
        'Nursing-focused routes',
        'IT and systems training pathways',
        'Mechatronics and technical training routes',
        'Hospitality pathways',
        'Logistics pathways',
      ]}
      logos={[]}
      faqs={[
        {
          q: 'How long does Ausbildung usually take?',
          a: 'The usual duration is 2 to 3 years, depending on the field and training route.',
        },
        {
          q: 'Do I need a degree for Ausbildung?',
          a: 'No. Many Ausbildung routes accept students after 10th to 12th grade, and no degree is required.',
        },
        {
          q: 'How much German do I need?',
          a: 'German B1 to B2 is mandatory because the route involves workplace communication and vocational learning in German.',
        },
        {
          q: 'Is Ausbildung paid?',
          a: 'Yes. The brief you shared lists a typical paid apprenticeship stipend of EUR 600 to EUR 1,200 per month.',
        },
      ]}
      finalCtaTitle="Need help deciding if Ausbildung is the right Germany route for you?"
      finalCtaText="We can help you compare Ausbildung with academic study, plan German readiness, and choose a training field that fits your strengths before you commit."
      finalPrimaryCta={{ label: 'Book Ausbildung guidance', to: '/bookings' }}
      finalSecondaryCta={{
        label: 'Compare all study paths',
        to: '/study-in-germany',
      }}
    />
  );
}
