import StudyProgramPage from '@/components/StudyProgramPage';

export default function EngineeringGermanyPage() {
  return (
    <StudyProgramPage
      title="Engineering in Germany"
      subtitle="Germany remains one of the most credible destinations for engineering because the academic system is closely tied to manufacturing, automation, mobility, energy, and applied research. The best decision is not only which university to target, but whether your profile fits a bachelor's route, a master's route, or a more applied university-of-applied-sciences pathway."
      heroBadge="Engineering pathway"
      heroHighlights={['Industry-linked study', 'Strong applied labs', 'Public and applied-university options']}
      primaryCta={{
        label: 'Check eligibility',
        to: '/tools',
      }}
      secondaryCta={{ label: 'Talk to an advisor', to: '/bookings' }}
      summaryFacts={[
        { label: 'Best known for', value: 'Mechanical, automotive, electrical, production' },
        { label: 'Study formats', value: 'University and university of applied sciences' },
        { label: 'Language split', value: 'German-heavy at bachelor level, broader at master level' },
        { label: 'Decision point', value: 'Academic depth vs applied industry route' },
      ]}
      overviewTitle="Engineering in Germany works best when your academic path and career style match the institution"
      overviewText="DAAD's engineering overview highlights how broad the subject landscape is in Germany, from classical mechanical and electrical engineering to interdisciplinary areas such as mechatronics, automation, and environmental technologies. That means students should decide early whether they want a theory-strong university environment, an applied university-of-applied-sciences route, or a specialised master's after a relevant undergraduate degree."
      overviewBullets={[
        'Technical universities suit students looking for deeper theory, research, and long-term technical specialization.',
        'Universities of applied sciences suit students who want closer links to practice, industry projects, and application-led teaching.',
        'Language planning matters early because many engineering programmes at bachelor level are still German-led.',
      ]}
      checklistTitle="Before you shortlist engineering programmes"
      checklistItems={[
        'Decide whether you are applying for a bachelor route, a masters route, or an applied-sciences pathway.',
        'Check whether your school or bachelor degree background is academically aligned with the target engineering field.',
        'Confirm the teaching language and whether internships or practical semesters are built into the curriculum.',
        'Review whether the university expects specific math, physics, or module prerequisites.',
      ]}
      warningText="Engineering admissions can look similar on the surface, but course structure, language expectations, and module prerequisites vary sharply across universities. Always compare the programme handbook, not only the course title."
      pathwaysTitle="Which engineering route sounds closest to your profile?"
      pathwaysIntro="Students usually get better outcomes when they choose a route that matches their preparation level and learning style instead of chasing only the highest-ranked name."
      pathways={[
        {
          title: 'Bachelor in engineering',
          audience: 'Path 1',
          summary: 'Best if you are applying after school and want a full engineering degree path in Germany from the foundation level upward.',
          bullets: [
            'Recognition and language are the first filters.',
            'German-taught routes are more common than English-taught ones at this level.',
            'Good fit if you want the full long-term academic route in Germany.',
          ],
          linkLabel: 'Check admission route',
          linkTo: 'https://www2.daad.de/deutschland/nach-deutschland/voraussetzungen/en/57293-database-on-admission-requirements/',
        },
        {
          title: 'Master in engineering',
          audience: 'Path 2',
          summary: 'Best if you already have a related undergraduate degree and want to specialise in areas such as automotive, robotics, energy, or data-driven engineering.',
          bullets: [
            'Academic fit and module matching matter more than broad interest alone.',
            'English-taught options are much more available at this level.',
            'Great route for students targeting specialised research or industry roles.',
          ],
          linkLabel: 'Find engineering programmes',
          linkTo: 'https://www.daad.de/en/studying-in-germany/universities/subject-groups/engineering/',
        },
        {
          title: 'Applied sciences route',
          audience: 'Path 3',
          summary: 'Best if you want a more practice-oriented environment with project work, industry ties, and often a direct employability focus.',
          bullets: [
            'Common in universities of applied sciences.',
            'Can be especially strong for industry-facing students.',
            'Still verify whether the degree route and visa plan fit your long-term goals.',
          ],
          linkLabel: 'Browse study options',
          linkTo: 'https://www.hochschulkompass.de/en/study-in-germany.html',
        },
      ]}
      requirementsTitle="What engineering applicants usually need to prove"
      requirementsIntro="Engineering decisions are often made on academic fit, preparation, and language readiness rather than broad statements of motivation."
      requirements={[
        {
          eyebrow: 'Academic fit',
          title: 'Math and technical background matter',
          text: 'Engineering programmes expect a credible academic base. For bachelor routes this usually means strong school preparation in math and science. For masters routes, universities often check whether your prior modules align with the target specialisation.',
          bullets: [
            'Mechanical and automotive pathways often expect strong math and physics grounding.',
            'Electrical and electronics pathways can be stricter on technical-module overlap.',
            'For masters routes, read the admission regulations carefully for module requirements.',
          ],
        },
        {
          eyebrow: 'Language',
          title: 'Language track changes your shortlist',
          text: 'At bachelor level, engineering often remains German-heavy. At masters level, there are more English-taught options, but programme-specific proof still matters.',
          bullets: [
            'German-taught routes may expect strong B2 to C1 ability.',
            'English-taught routes often expect IELTS or TOEFL-level proof.',
            'Basic German still helps with internships, daily life, and networking even in English programmes.',
          ],
        },
        {
          eyebrow: 'Documents',
          title: 'Project and curriculum detail can help',
          text: 'Engineering applications often become stronger when your transcripts, syllabus context, projects, and practical exposure are easy to understand for the admissions team.',
          bullets: [
            'Detailed transcripts and degree certificates',
            'CV with projects, internships, and lab exposure',
            'Language certificates and translations where needed',
            'Motivation statement where requested by the programme',
          ],
        },
      ]}
      stepsTitle="A cleaner way to build an engineering application"
      stepsIntro="Students usually save time when they narrow field, language, and institution type before they begin applying widely."
      steps={[
        {
          title: 'Narrow the field',
          text: 'Decide whether you want classical engineering, interdisciplinary engineering, or data-heavy technical areas such as AI, automation, or embedded systems.',
        },
        {
          title: 'Choose institution type',
          text: 'Compare technical universities with universities of applied sciences based on how theoretical or industry-linked you want the learning environment to be.',
        },
        {
          title: 'Check academic fit',
          text: 'For masters applications especially, compare your modules with the admission regulations before you pay any application fee or translation cost.',
        },
        {
          title: 'Confirm language route',
          text: 'Lock your shortlist based on German or English requirements and book exams early enough for the intake you want.',
        },
        {
          title: 'Prepare documents and applications',
          text: 'Organise transcripts, CV, language proof, and any project or internship evidence. Then apply directly or through uni-assist depending on the university.',
        },
        {
          title: 'Plan finances and relocation',
          text: 'Once you have admission progress, line up housing, visa timing, and practical arrival planning because technical hubs can have competitive housing markets.',
        },
      ]}
      planningTitle="Engineering planning is about more than tuition"
      planningIntro="Students often focus on tuition first, but city choice, lab access, internship potential, language preparation, and housing availability can matter just as much in engineering routes."
      planningCards={[
        {
          eyebrow: 'Budget',
          title: 'Plan for city and lab reality, not only brochure pricing',
          text: 'Public routes may be affordable academically, but engineering students should still budget for equipment, software needs, housing, transport, and daily living costs.',
          bullets: [
            'Semester contributions still apply at many public universities.',
            'Cities with strong engineering ecosystems may also have tighter housing markets.',
            'Private providers can carry far higher tuition than public options.',
          ],
        },
        {
          eyebrow: 'Visa and work',
          title: 'Internship planning starts before arrival',
          text: 'If you need a visa, your financial proof, insurance, and arrival timeline must be aligned. If you want internships, basic German can widen opportunities even when the degree is English-taught.',
          bullets: [
            'Health insurance remains mandatory.',
            'Blocked-account and embassy guidance should be checked against current official rules.',
            'Internship readiness improves when language and CV preparation start early.',
          ],
        },
        {
          eyebrow: 'Common mistakes',
          title: 'The title can mislead you',
          text: 'Students often apply to any course with "engineering" in the title without checking whether it is theoretical, applied, interdisciplinary, or even truly aligned with their background.',
          bullets: [
            'Compare curricula, not just programme names.',
            'Do not assume all engineering routes are equally practice-oriented.',
            'Do not ignore module gaps in masters applications.',
          ],
        },
      ]}
      toolsTitle="Official tools to validate engineering choices"
      tools={[
        {
          title: 'DAAD engineering subject overview',
          description: 'Helpful for understanding how broad engineering study options in Germany really are and where major subject clusters sit.',
          href: 'https://www.daad.de/en/studying-in-germany/universities/subject-groups/engineering/',
        },
        {
          title: 'Hochschulkompass',
          description: 'Useful for searching engineering programmes by degree level, place, and institution type.',
          href: 'https://www.hochschulkompass.de/en/study-in-germany.html',
        },
        {
          title: 'uni-assist',
          description: 'Important for many international applications, especially when the university does not take your file directly.',
          href: 'https://www.uni-assist.de/en/',
        },
        {
          title: 'DAAD admission requirements database',
          description: 'Start here if you are entering engineering after school and need to know whether direct admission is possible.',
          href: 'https://www2.daad.de/deutschland/nach-deutschland/voraussetzungen/en/57293-database-on-admission-requirements/',
        },
      ]}
      tracksTitle="Engineering areas students most often compare"
      tracksIntro="Germany is especially strong when students match their specialisation to a real sector rather than choosing a broad label too late."
      tracks={[
        { title: 'Mechanical engineering', text: 'Strong fit for design, production, manufacturing systems, and industrial process roles.', icon: 'MECH' },
        { title: 'Automotive and mobility', text: 'A classic Germany draw for students interested in vehicles, systems, and mobility innovation.', icon: 'AUTO' },
        { title: 'Electrical and electronics', text: 'Useful for power systems, controls, hardware, and industrial electronics pathways.', icon: 'ELEC' },
        { title: 'Mechatronics and robotics', text: 'Good for students who want interdisciplinary study across mechanics, controls, and computing.', icon: 'ROBO' },
        { title: 'Embedded systems and AI', text: 'Growing route for students interested in intelligent products, sensors, and software-linked engineering.', icon: 'AI' },
        { title: 'Energy and sustainability', text: 'Strong option for students interested in renewables, grids, and climate-linked infrastructure.', icon: 'ENER' },
      ]}
      universitiesTitle="Universities students often consider for engineering"
      universities={[
        'Technical University of Munich',
        'RWTH Aachen University',
        'Karlsruhe Institute of Technology',
        'Technical University of Berlin',
        'TU Darmstadt',
        'University of Stuttgart',
        'TU Dresden',
        'TU Braunschweig',
      ]}
      logos={[
        'Technical University of Munich',
        'RWTH Aachen University',
        'Karlsruhe Institute of Technology',
        'Technical University of Berlin',
        'University of Stuttgart',
        'TU Dresden',
      ]}
      faqs={[
        {
          q: 'Is Germany better for engineering at bachelor or masters level?',
          a: 'It can be strong at both levels, but the decision depends on your current profile. Bachelor routes are often more language- and recognition-sensitive, while masters routes put more weight on academic alignment and specialisation fit.',
        },
        {
          q: 'Are English-taught engineering programmes common?',
          a: 'They are much more common at masters level than at bachelor level. At bachelor level, many engineering routes still lean strongly toward German.',
        },
        {
          q: 'Should I choose a technical university or a university of applied sciences?',
          a: 'Choose based on your learning style and goal. Technical universities often lean more theoretical and research-oriented. Universities of applied sciences often feel more practice-led and closer to application and project work.',
        },
        {
          q: 'What is the most common reason engineering applications get rejected?',
          a: 'For masters routes, academic mismatch is a common issue. Students often apply based on interest or ranking without checking whether their earlier degree content actually fits the programme requirements.',
        },
      ]}
      finalCtaTitle="Need help choosing the right engineering route?"
      finalCtaText="We can help you narrow field, institution type, language route, and realistic application targets so your shortlist is stronger before you spend time and money on the formal process."
      finalPrimaryCta={{ label: 'Book an engineering planning call', to: '/bookings' }}
      finalSecondaryCta={{
        label: 'Open official engineering guide',
        to: 'https://www.daad.de/en/studying-in-germany/universities/subject-groups/engineering/',
        external: true,
      }}
    />
  );
}



