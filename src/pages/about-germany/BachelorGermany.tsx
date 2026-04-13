import StudyProgramPage from '@/components/StudyProgramPage';

export default function BachelorGermanyPage() {
  return (
    <StudyProgramPage
      title="Bachelor's in Germany for International Students"
      subtitle="Germany offers respected 3-year bachelor's degrees, mostly at public universities with low tuition or no tuition fees. The real decision is not whether Germany is worth considering, but which admission route applies to you, what language proof you need, and what to prepare before you apply."
      heroBadge="Bachelor pathway"
      heroImage="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1600&auto=format&fit=crop"
      heroHighlights={['Recognition first', 'German-taught is most common', 'Studienkolleg may be required']}
      primaryCta={{
        label: 'Check your eligibility',
        to: '/tools',
      }}
      secondaryCta={{ label: 'Book application planning', to: '/bookings' }}
      summaryFacts={[
        { label: 'Typical duration', value: '6 to 8 semesters' },
        { label: 'Teaching language', value: 'Mostly German, some English' },
        { label: 'Tuition context', value: 'Public universities often low or no tuition' },
        { label: 'Big decision', value: 'Direct entry vs Studienkolleg vs prior study' },
      ]}
      overviewTitle="Start by identifying your admission route, not just your dream course"
      overviewText="DAAD's admission guidance makes one thing clear: not every international school certificate leads straight into a German bachelor's programme. Depending on your school-leaving qualification, you may qualify for direct admission, need a Studienkolleg foundation year, or need prior university study in your home country before you can apply."
      overviewBullets={[
        'Check whether your school qualification is recognised for direct higher-education entry.',
        'Confirm whether your target programme is taught in German or English before planning tests.',
        'Expect the final admission decision to depend on the university, programme, and your complete document set.',
      ]}
      checklistTitle="What to confirm before you shortlist programmes"
      checklistItems={[
        'Which Germany study route fits you best: direct bachelor entry, Studienkolleg, or a guided preparation path.',
        'Whether your target course is German-taught, English-taught, or mixed-language.',
        'Whether the university applies directly or through uni-assist.',
        'Whether you need APS, certified translations, and which BVF tools or resources can support your next step.',
      ]}
      warningText="Requirements vary by university and final admission decisions are made by the institution. Treat general guidance as orientation, then verify every requirement on the programme page before you apply."
      pathwaysTitle="Choose the admission path that sounds most like you"
      pathwaysIntro="These are the three routes students usually need to check first. If you are unsure, start with the BVF Germany route hub and tools before spending time on applications, language exams, or document translations."
      pathways={[
        {
          title: 'Direct admission',
          audience: 'Path 1',
          summary: 'Some school-leaving qualifications such as certain EU/EEA credentials or the IB Diploma can lead directly to bachelor entry in Germany.',
          bullets: [
            'Best fit if your school certificate is already recognised for higher education entry.',
            'Still confirm course-specific language requirements and application channel.',
            'Use the BVF Germany route pages to understand what to shortlist and prepare next.',
          ],
          linkLabel: 'Explore Germany routes',
          linkTo: '/about-germany#paths',
        },
        {
          title: 'Need Studienkolleg',
          audience: 'Path 2',
          summary: 'If your qualification is not enough for direct admission, you may need a one-year Studienkolleg and the Feststellungsprufung before starting a degree.',
          bullets: [
            'Common for many non-EU school certificates.',
            'Useful when your academic route needs a formal bridge into German higher education.',
            'Plan extra time for language preparation and application timing.',
          ],
          linkLabel: 'Open Bachelor resources',
          linkTo: '/resources',
        },
        {
          title: 'Prior study required',
          audience: 'Path 3',
          summary: 'Some applicants must complete comparable university study in their home country before becoming eligible for a German bachelor programme.',
          bullets: [
            'Often relevant when Class 12 alone is not enough for direct entry.',
            'Module and study-field comparability can matter, not just the number of semesters.',
            'Check this before assuming you can apply straight after school.',
          ],
          linkLabel: 'Use BVF tools',
          linkTo: '/tools#eligibility',
        },
      ]}
      requirementsTitle="The requirements students usually overlook"
      requirementsIntro="A strong bachelor application is usually less about writing long essays and more about getting recognition, language, and documents right early."
      requirements={[
        {
          eyebrow: 'Eligibility',
          title: 'Qualification recognition comes first',
          text: 'Do not shortlist only on ranking or city. First verify whether your qualification gives direct access, requires a Studienkolleg, or needs prior study in your home country.',
          bullets: [
            'Use the BVF Germany route hub to identify the best-fit study path first.',
            'Use the BVF tools page to estimate profile strength and next steps.',
            'If you are an Indian applicant, confirm whether APS will later be needed for your file.',
          ],
        },
        {
          eyebrow: 'Language',
          title: 'German is still the main route for bachelor study',
          text: 'Most bachelor programmes in Germany are taught in German. English-taught options exist, but they are fewer than at the masters level and programme-specific proof matters.',
          bullets: [
            'German-taught programmes commonly expect B2 to C1 evidence such as TestDaF, DSH, Goethe, or telc depending on the university.',
            'English-taught programmes usually expect IELTS or TOEFL proof.',
            'Always read the exact language section on the university page.',
          ],
          note: 'A course being listed in English somewhere does not replace the official programme page requirement.',
        },
        {
          eyebrow: 'Documents',
          title: 'Prepare formal documents earlier than you think',
          text: 'International applications often fail on missing or incorrectly formatted documents rather than weak intent. Certified translations, scans, and naming conventions matter.',
          bullets: [
            'School certificates and transcripts',
            'Passport copy and photographs if requested',
            'Language certificate and CV',
            'Certified translations for non-German or non-English documents where required',
          ],
        },
      ]}
      stepsTitle="How to apply in a practical order"
      stepsIntro="The smoothest applications start with recognition and language planning before students rush into portal uploads."
      steps={[
        {
          title: 'Research programmes',
          text: 'Use Hochschulkompass, DAAD, and university websites to shortlist programmes by language, city, and application intake.',
        },
        {
          title: 'Confirm your route',
          text: 'Start with the BVF Germany overview and bachelor pathway page to understand whether you may qualify directly, need Studienkolleg, or need a slower preparation route.',
        },
        {
          title: 'Plan language proof',
          text: 'Book your German or English exam around realistic application timelines. Do not wait until the last deadline window.',
        },
        {
          title: 'Prepare documents',
          text: 'Collect school records, translations, passport copy, CV, and any route-specific forms. Keep clean digital scans ready for uploads.',
        },
        {
          title: 'Apply through the right channel',
          text: 'Some universities accept international applications directly, while many use uni-assist. The programme page decides which route applies.',
        },
        {
          title: 'Prepare for visa after admission',
          text: 'Once admitted, move quickly on blocked account planning, health insurance, and embassy appointment preparation if you need a student visa.',
        },
      ]}
      planningTitle="Plan costs, visa, and timing before you get the offer"
      planningIntro="Bachelor study in Germany can be affordable, but the application route still requires budget planning. Costs depend on city, housing, insurance, and whether you attend a public or private institution."
      planningCards={[
        {
          eyebrow: 'Cost planning',
          title: 'Public can be affordable, but living costs are real',
          text: 'Public universities often charge only semester contributions, while private universities can be much more expensive. Your monthly budget should include rent, food, insurance, transport, and study materials.',
          bullets: [
            'Public universities often have low semester fees rather than full tuition.',
            'Private providers can be significantly more expensive.',
            'Living costs vary by city and housing availability.',
          ],
        },
        {
          eyebrow: 'Visa and insurance',
          title: 'Non-EU students need a financial and insurance plan',
          text: 'If you need a visa, expect to prove financial resources, health insurance, and an admission basis. Embassy processes and blocked-account requirements can change, so verify the latest official amount before applying.',
          bullets: [
            'Student visa after receiving the admission basis or required documents',
            'Health insurance is mandatory after arrival and often needed for enrolment',
            'Blocked-account requirements should be checked against the latest official guidance',
          ],
          note: 'For Indian, Chinese, and Vietnamese applicants, APS may also be part of the process depending on the route.',
        },
        {
          eyebrow: 'Common mistakes',
          title: 'Most delays come from avoidable errors',
          text: 'Students often lose time by assuming all bachelor programmes are in English, applying before checking qualification recognition, or waiting too long to organise certified translations and exam scores.',
          bullets: [
            'Do not rely on generic deadlines alone; always verify on the university page.',
            'Do not assume Class 12 alone is enough for every route.',
            'Do not upload incomplete or unclear scans to application portals.',
          ],
        },
      ]}
      toolsTitle="Useful BVF tools and resources to open before you pay for application help"
      tools={[
        {
          title: 'Germany study route hub',
          description: 'Start with the BVF Germany overview page to compare bachelor, engineering, masters, and MBA pathways before deciding what fits you best.',
          href: '/about-germany',
        },
        {
          title: 'BVF free tools',
          description: 'Use the CGPA converter, IELTS checker, and eligibility starter section to estimate your current profile and next move.',
          href: '/tools#eligibility',
        },
        {
          title: 'Resources page',
          description: 'Open BVF resources for planning sheets, support bundles, and practical materials that help you shortlist and prepare better.',
          href: '/resources',
        },
        {
          title: 'Book a guidance session',
          description: 'Move from general information to a personalized route when you need clarity on admissions, language, or university shortlisting.',
          href: '/bookings',
        },
      ]}
      tracksTitle="Popular bachelor study options students often explore"
      tracksIntro="Your best-fit route depends on language ability, academic preparation, and whether you want a broad degree or a more technical subject from the start."
      tracks={[
        { title: 'Engineering and technology', text: 'Strong option if you already enjoy math, physics, and problem-solving and can handle structured technical coursework.', icon: 'ENG' },
        { title: 'Business and economics', text: 'Useful for students who want management, finance, or international business pathways with strong employability.', icon: 'BIZ' },
        { title: 'Computer science', text: 'A strong path for students interested in software, systems, and applied digital skills.', icon: 'CS' },
        { title: 'Natural sciences', text: 'Good fit if you want lab-based study and may later pursue research-heavy masters options.', icon: 'TAG' },
        { title: 'Social sciences', text: 'Relevant for policy, society, communication, and interdisciplinary future pathways.', icon: 'SOC' },
        { title: 'Design and media', text: 'More portfolio-sensitive and often more specific in admission requirements, so check carefully.', icon: 'ART' },
      ]}
      universitiesTitle="Universities students often shortlist for bachelor's study"
      universities={[
        'Technical University of Munich',
        'RWTH Aachen University',
        'Heidelberg University',
        'University of Hamburg',
        'University of Cologne',
        'Karlsruhe Institute of Technology',
        'University of Bonn',
        'University of Stuttgart',
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
          q: 'Can I apply to a German bachelor programme directly after Class 12?',
          a: 'Sometimes yes, sometimes no. The answer depends on whether your school-leaving qualification supports direct higher-education entry. Many students need either Studienkolleg or prior university study in their home country, so map your route clearly before assuming you qualify directly.',
        },
        {
          q: 'Are English-taught bachelor programmes common in Germany?',
          a: 'They exist, but they are less common than English-taught masters programmes. Most bachelor programmes are still taught in German, so language planning is often one of the biggest early decisions.',
        },
        {
          q: 'Do I always need Studienkolleg?',
          a: 'No. Studienkolleg is only one route. Some applicants qualify directly, while others may need prior university study instead. Your exact pathway depends on your qualification and country-specific recognition route.',
        },
        {
          q: 'What is the safest way to avoid application mistakes?',
          a: 'Check qualification recognition first, then confirm language requirements on the programme page, then prepare documents in the exact format requested. Most avoidable errors come from skipping one of those three steps.',
        },
      ]}
      finalCtaTitle="Ready to start your bachelor's application plan?"
      finalCtaText="Start with recognition, then shortlist realistic programmes, then prepare language proof and documents in the right order. If you want help building a route that matches your qualification, we can help you map it clearly."
      finalPrimaryCta={{ label: 'Book 30-minute session', to: '/bookings' }}
      finalSecondaryCta={{
        label: 'Open BVF resources',
        to: '/resources',
      }}
    />
  );
}


