import StudyProgramPage from '@/components/StudyProgramPage';

export default function AusbildungGermanyPage() {
  return (
    <StudyProgramPage
      title="Ausbildung in Germany"
      subtitle="Ausbildung is Germany's structured vocational-training route for students who want practical learning, workplace exposure, and a clear skills-based path into employment. The most important first step is to check whether this route fits your academic stage, your German-language readiness, and the field you want to train in."
      heroBadge="Vocational training pathway"
      heroImage="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop"
      heroHighlights={['Practice-led training', 'German language matters', 'Career-focused route']}
      primaryCta={{
        label: 'Talk to an advisor',
        to: '/bookings',
      }}
      secondaryCta={{ label: 'Check your profile', to: '/tools' }}
      summaryFacts={[
        { label: 'Typical duration', value: '2 to 3.5 years' },
        { label: 'Training style', value: 'Company training plus vocational school' },
        { label: 'Language expectation', value: 'Mostly German-led' },
        { label: 'Best fit', value: 'Skills-first career pathway' },
      ]}
      overviewTitle="Ausbildung is for students who want a practical route, not a classic university degree"
      overviewText="Unlike a bachelor's or master's degree, Ausbildung is a vocational route built around practical training. Students usually split time between a company and vocational school, which means the route works best when you are comfortable with hands-on learning, daily workplace structure, and building language confidence for real-life communication."
      overviewBullets={[
        'This path suits students who want employable skills and practical work exposure early.',
        'German language readiness is often more important here than in many English-taught university programmes.',
        'The smartest shortlist starts with job role fit, training provider quality, and city practicality.',
      ]}
      checklistTitle="What to confirm before choosing Ausbildung"
      checklistItems={[
        'Whether Ausbildung fits your goal better than a university degree.',
        'Whether your current German level is realistic for training and workplace communication.',
        'Which field you want to train in and what that daily work actually looks like.',
        'How you will plan documents, finances, and relocation before the start date.',
      ]}
      warningText="Ausbildung is not a shortcut version of university. It is a different pathway with different expectations around language, training culture, employer fit, and day-to-day responsibility."
      pathwaysTitle="Which Ausbildung route sounds closest to your goal?"
      pathwaysIntro="Students usually do better when they start with the type of work they want to learn rather than choosing only by country or salary expectations."
      pathways={[
        {
          title: 'Technical and industrial training',
          audience: 'Path 1',
          summary: 'Useful for students interested in machines, production, electronics, automotive work, and practical technical systems.',
          bullets: [
            'Best for hands-on learners who like structured technical environments.',
            'Can connect well with Germany’s strong industrial sectors.',
            'Often needs steady German communication ability in real work settings.',
          ],
          linkLabel: 'Book guidance for technical routes',
          linkTo: '/bookings',
        },
        {
          title: 'Healthcare and care-related training',
          audience: 'Path 2',
          summary: 'Relevant for students exploring patient-facing, support, and care-oriented vocational roles.',
          bullets: [
            'Usually needs stronger communication comfort and responsibility in daily interaction.',
            'Can be demanding but practical and career-focused.',
            'Language preparation should be taken seriously from the start.',
          ],
          linkLabel: 'Discuss your profile',
          linkTo: '/tools',
        },
        {
          title: 'Hospitality, retail, and service training',
          audience: 'Path 3',
          summary: 'Good fit for students who are comfortable with customer-facing work, routines, and practical team environments.',
          bullets: [
            'Can suit students who enjoy active, people-oriented work.',
            'City choice, cost of living, and work environment matter a lot.',
            'Helps to shortlist by real job fit rather than broad popularity.',
          ],
          linkLabel: 'Compare Germany pathways',
          linkTo: '/about-germany',
        },
      ]}
      requirementsTitle="What Ausbildung applicants usually need to show"
      requirementsIntro="This route usually depends on practical fit, communication readiness, and application basics rather than only academic ambition."
      requirements={[
        {
          eyebrow: 'Language',
          title: 'German matters for daily training life',
          text: 'Because Ausbildung usually involves vocational school, workplace routines, and direct communication, German is often central to the route.',
          bullets: [
            'Daily communication can matter as much as formal classroom understanding.',
            'The stronger your German, the broader your realistic options usually become.',
            'Do not treat language as a last-minute step for this path.',
          ],
        },
        {
          eyebrow: 'Fit',
          title: 'Your chosen field should match your strengths and expectations',
          text: 'Students usually do better when they choose a training area that fits their strengths, comfort with practical work, and long-term interest.',
          bullets: [
            'Think about whether you prefer technical, service, healthcare, or trade settings.',
            'Check what the daily routine looks like before committing.',
            'A good fit usually reduces drop-off and confusion later.',
          ],
        },
        {
          eyebrow: 'Documents',
          title: 'A clean application still matters',
          text: 'Even for vocational routes, your file should be organized, clear, and ready for review.',
          bullets: [
            'Academic records and identity documents',
            'CV and supporting paperwork if requested',
            'Language proof where needed',
            'Clear preparation for interviews or employer communication',
          ],
        },
      ]}
      stepsTitle="How to plan an Ausbildung application in a better order"
      stepsIntro="The strongest route usually starts with fit, then language, then field selection, then practical application planning."
      steps={[
        {
          title: 'Decide if Ausbildung is truly your best route',
          text: 'Compare this pathway against bachelor and business or engineering study options before locking in your direction.',
        },
        {
          title: 'Pick a training field',
          text: 'Start with the kind of work you want to learn, not just a broad idea of studying in Germany.',
        },
        {
          title: 'Plan your German improvement',
          text: 'Language readiness can decide how realistic your application is, so this should begin early.',
        },
        {
          title: 'Prepare your documents and profile',
          text: 'Keep academic records, CV, identity documents, and any field-relevant preparation in order before applying.',
        },
        {
          title: 'Apply with a realistic shortlist',
          text: 'Choose roles, providers, and cities that match your profile rather than applying randomly everywhere.',
        },
        {
          title: 'Prepare relocation and next steps',
          text: 'Once your route becomes clear, move early on finances, housing, and travel planning.',
        },
      ]}
      planningTitle="Ausbildung still needs planning around language, money, and everyday life"
      planningIntro="Students often focus only on the training opportunity, but real success also depends on communication, city affordability, housing, and how prepared you are for a structured work routine."
      planningCards={[
        {
          eyebrow: 'Budget',
          title: 'Living costs still need a realistic plan',
          text: 'Even with a practical training route, accommodation, food, transport, insurance, and first-month setup costs need early planning.',
          bullets: [
            'City choice can change your budget significantly.',
            'Do not assume a practical route removes all financial planning needs.',
            'Daily living costs should be understood before you commit.',
          ],
        },
        {
          eyebrow: 'Lifestyle',
          title: 'This route is structured and responsibility-heavy',
          text: 'Ausbildung often works best for students who are ready for routine, practical expectations, and real communication in a work setting.',
          bullets: [
            'Punctuality and consistency matter.',
            'Workplace communication can feel demanding at first.',
            'A good mental picture of daily life helps prevent wrong expectations.',
          ],
        },
        {
          eyebrow: 'Common mistakes',
          title: 'Students often choose by trend instead of fit',
          text: 'A lot of confusion comes from picking Ausbildung only because it sounds practical or popular, without checking language, field suitability, and lifestyle readiness.',
          bullets: [
            'Do not skip field research.',
            'Do not underestimate the language side.',
            'Do not treat this as identical to a university route.',
          ],
        },
      ]}
      toolsTitle="Useful BVF pages to open before you go deeper"
      tools={[
        {
          title: 'About Germany overview',
          description: 'Compare Ausbildung with bachelor’s, engineering, and business-management routes before deciding what fits you best.',
          href: '/about-germany',
        },
        {
          title: 'BVF tools',
          description: 'Use our tools to understand your current profile and where you may need stronger preparation.',
          href: '/tools',
        },
        {
          title: 'Book a guidance session',
          description: 'Get help deciding whether Ausbildung is a good fit and what next steps make sense for your case.',
          href: '/bookings',
        },
        {
          title: 'Resources',
          description: 'Explore supporting materials that can help you plan more clearly before applying.',
          href: '/resources',
        },
      ]}
      tracksTitle="Ausbildung fields students often ask about"
      tracksIntro="The right field usually depends on your strengths, language comfort, and the kind of daily work you can genuinely see yourself doing."
      tracks={[
        { title: 'Industrial and manufacturing roles', text: 'Good fit for students who prefer machines, systems, and process-driven practical work.', icon: 'TECH' },
        { title: 'Automotive and maintenance roles', text: 'Useful for students interested in vehicles, tools, and technical troubleshooting environments.', icon: 'AUTO' },
        { title: 'Healthcare support roles', text: 'Relevant for students who are comfortable with responsibility, care routines, and people-facing work.', icon: 'CARE' },
        { title: 'Hospitality and service roles', text: 'A strong option for active, customer-facing students who work well in dynamic team settings.', icon: 'SERV' },
        { title: 'Retail and operations roles', text: 'Suitable for students who are organized, practical, and comfortable with customer or store processes.', icon: 'SHOP' },
        { title: 'Trade and skilled-work roles', text: 'Can fit students who want a concrete hands-on trade route rather than a classroom-heavy study path.', icon: 'WORK' },
      ]}
      universitiesTitle="Training sectors students commonly explore under Ausbildung"
      universities={[
        'Industrial and manufacturing training providers',
        'Automotive and technical training routes',
        'Healthcare and care-focused training pathways',
        'Hospitality and hotel-management training routes',
        'Retail and customer-service training pathways',
        'Trade and practical skilled-work routes',
      ]}
      logos={[
        'Technical University of Munich',
        'RWTH Aachen University',
        'Heidelberg University',
        'University of Bonn',
        'University of Stuttgart',
        'Karlsruhe Institute of Technology',
      ]}
      faqs={[
        {
          q: 'Is Ausbildung the same as a university degree in Germany?',
          a: 'No. Ausbildung is a vocational training pathway, while a bachelor’s or master’s route is an academic university degree pathway. The structure, expectations, and long-term fit can be very different.',
        },
        {
          q: 'Do I need German for Ausbildung?',
          a: 'In most cases, strong German readiness is very important because the route usually includes workplace communication and vocational-school learning in German-led settings.',
        },
        {
          q: 'Who should consider Ausbildung seriously?',
          a: 'Students who prefer practical learning, early workplace exposure, and a skills-first route often find Ausbildung more suitable than a traditional academic degree.',
        },
        {
          q: 'What is the most common mistake students make with Ausbildung?',
          a: 'They choose it only because it sounds practical or popular, without checking language readiness, field fit, and whether they are actually comfortable with the daily training environment.',
        },
      ]}
      finalCtaTitle="Need help deciding whether Ausbildung is your best Germany route?"
      finalCtaText="We can help you compare Ausbildung with academic study routes, evaluate your readiness, and choose a more realistic next step before you commit."
      finalPrimaryCta={{ label: 'Book an Ausbildung guidance call', to: '/bookings' }}
      finalSecondaryCta={{
        label: 'Compare all Germany routes',
        to: '/about-germany',
      }}
    />
  );
}
