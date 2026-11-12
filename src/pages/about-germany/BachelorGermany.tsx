import StudyProgramPage from '@/components/StudyProgramPage';

export default function BachelorGermanyPage() {
  return (
    <StudyProgramPage
      title="Bachelor's Degree in Germany"
      subtitle="A bachelor's degree in Germany is a strong route for students who want tuition-free public university education, clear academic direction, and long-term career opportunities in Europe."
      heroBadge="Bachelor's pathway"
      heroHighlights={[
        'Duration: 3-4 years',
        'IELTS 6.0-6.5 or German B2',
        'Public universities with low semester fees',
      ]}
      primaryCta={{
        label: 'Apply for Bachelor guidance',
        to: '/bookings',
      }}
      secondaryCta={{ label: 'Explore study paths', to: '/study-in-germany' }}
      summaryFacts={[
        { label: 'Duration', value: '3-4 years' },
        { label: 'Eligibility', value: 'A-Levels / 12th Grade (PCM/PCB/Commerce)' },
        { label: 'Language Req', value: 'IELTS 6.0-6.5 or German B2' },
        { label: 'Tuition / Cost', value: 'Free (Semester fee EUR 150-350)' },
      ]}
      overviewTitle="Bachelor's in Germany works best when students plan recognition, language, and course fit early"
      overviewText="Germany offers strong public-university bachelor's programmes across engineering, computer science, business, medicine, and architecture. The smartest first move is to confirm your eligibility, language route, and course direction before applications open."
      overviewBullets={[
        'Top universities students often target include TU Munich, RWTH Aachen, Heidelberg, FU Berlin, and KIT.',
        'Popular fields include Mechanical Engineering, Computer Science, Business, Medicine, and Architecture.',
        'Most public universities stay tuition-free, with students paying only a semester contribution.',
      ]}
      checklistTitle="Bachelor planning checklist"
      checklistItems={[
        'Confirm whether your 12th-grade route supports your target subject and admission path.',
        'Choose between English and German language preparation before building the final shortlist.',
        'Plan APS, translations, and application documents early if you are applying from India.',
        'Track semester fees, city costs, and intake deadlines before applying widely.',
      ]}
      warningText="Bachelor's routes in Germany vary by university, subject, and language of instruction, so the official programme page should always be your final reference before submission."
      pathwaysTitle="Three core decisions shape a strong bachelor's application"
      pathwaysIntro="Students usually get better outcomes when they lock the route, language plan, and field direction before chasing rankings alone."
      pathways={[
        {
          title: 'Eligibility route',
          audience: 'Decision 1',
          summary: 'Your school background and subject stream should align with the course you want to pursue in Germany.',
          bullets: [
            'A-Levels and 12th Grade students should review subject fit carefully.',
            'PCM, PCB, and Commerce students should shortlist fields that match their academic background.',
            'BVF guidance helps connect eligibility to realistic course choices.',
          ],
          linkLabel: 'Check your route fit',
          linkTo: '/tools',
        },
        {
          title: 'Language route',
          audience: 'Decision 2',
          summary: 'Students should decide early whether their shortlist will be built around English-taught or German-taught programmes.',
          bullets: [
            'English-taught options often ask for IELTS 6.0 to 6.5.',
            'German-taught routes commonly need German B2.',
            'Your language choice directly changes the shortlist quality.',
          ],
          linkLabel: 'Plan language support',
          linkTo: '/services/germany-language',
        },
        {
          title: 'Field direction',
          audience: 'Decision 3',
          summary: 'The best bachelor plans start with a field you can sustain for 3 to 4 years, not just a famous university name.',
          bullets: [
            'Popular key fields include Mechanical Engineering, CS, Business, Medicine, and Architecture.',
            'A cleaner field direction usually leads to a stronger SOP, CV, and document story later.',
            'Choose by academic fit, not only by city or ranking.',
          ],
          linkLabel: 'See all study paths',
          linkTo: '/study-in-germany',
        },
      ]}
      requirementsTitle="What bachelor applicants usually need to prove"
      requirementsIntro="The strongest bachelor's applications keep academic fit, language readiness, and document quality aligned from the start."
      requirements={[
        {
          eyebrow: 'Eligibility',
          title: 'School background should support the target subject',
          text: 'German universities look closely at academic background and whether your subject stream fits the course you want to study.',
          bullets: [
            '12th Grade students from PCM often explore engineering and CS.',
            'PCB students often target science and health-linked pathways.',
            'Commerce students usually focus on business and management routes.',
          ],
        },
        {
          eyebrow: 'Language',
          title: 'Language proof changes which universities stay realistic',
          text: 'The exact shortlist depends on whether you are applying through English or German.',
          bullets: [
            "IELTS 6.0-6.5 is common for English-taught bachelor's routes.",
            'German B2 is a common baseline for German-taught programmes.',
            'Language planning should happen before final shortlisting, not after.',
          ],
        },
        {
          eyebrow: 'Cost',
          title: 'Public universities stay affordable, but planning still matters',
          text: 'Public routes are usually tuition-free, but semester fees and living costs still need planning.',
          bullets: [
            'Semester fee usually falls in the EUR 150-350 range.',
            'Accommodation, food, transport, and insurance should be planned separately.',
            'A stronger budget plan reduces last-minute stress after admission.',
          ],
        },
      ]}
      stepsTitle="A practical order for bachelor's applications"
      stepsIntro="Students usually move faster when they follow a clean order instead of preparing everything at once."
      steps={[
        {
          title: 'Select your field and route',
          text: 'Start with the subject that fits your school background and long-term interest.',
        },
        {
          title: 'Lock the language plan',
          text: 'Choose whether the shortlist will be English-first or German-first and begin preparation early.',
        },
        {
          title: 'Build the shortlist',
          text: 'Target strong public universities like TU Munich, RWTH Aachen, Heidelberg, FU Berlin, and KIT only after your route is clear.',
        },
        {
          title: 'Prepare APS and academic documents',
          text: 'Students applying from India should organize APS timing, marksheets, passport, and translations early.',
        },
        {
          title: 'Submit applications',
          text: 'Apply through the correct university or uni-assist process based on the course page.',
        },
        {
          title: 'Plan visa and relocation',
          text: 'Once admission starts moving, shift into blocked account, housing, insurance, and visa preparation.',
        },
      ]}
      planningTitle="Bachelor planning should connect academics, money, and timing"
      planningIntro="A strong bachelor's plan is not only about admission. It also includes fee expectations, language readiness, and city-level budget planning."
      planningCards={[
        {
          eyebrow: 'Top universities',
          title: 'Aim high, but shortlist realistically',
          text: 'Bachelor applicants often compare TU Munich, RWTH Aachen, Heidelberg, FU Berlin, and KIT because they combine public-university value with strong academic reputations.',
          bullets: [
            'Compare universities by field fit, not just overall reputation.',
            'Use deadlines and entry requirements to narrow the final list.',
            'Course language can be as important as university name.',
          ],
        },
        {
          eyebrow: 'Key fields',
          title: 'Field choice shapes every later step',
          text: 'Mechanical Engineering, CS, Business, Medicine, and Architecture are some of the most common bachelor interests for Indian students targeting Germany.',
          bullets: [
            'Different fields may expect different documents or subject preparation.',
            'Some routes become easier with stronger German.',
            'A clearer field choice improves SOP, CV, and admissions messaging.',
          ],
        },
        {
          eyebrow: 'Cost planning',
          title: 'Low tuition does not remove the need for a budget plan',
          text: 'Public tuition may stay free, but students still need to budget for semester fees, housing, travel, food, and insurance.',
          bullets: [
            'Semester fee usually stays around EUR 150-350.',
            'City cost differences matter a lot.',
            'Visa planning is easier when the money side is already organized.',
          ],
        },
      ]}
      toolsTitle="Useful BVF pages before you finalize a bachelor's plan"
      tools={[
        {
          title: 'Study in Germany overview',
          description: "Compare bachelor's, master's, and Ausbildung routes before you commit to one path.",
          href: '/study-in-germany',
        },
        {
          title: 'University Shortlisting',
          description: 'Get 5 to 10 realistic public-university matches based on your profile.',
          href: '/services/university-shortlist',
        },
        {
          title: 'APS Support',
          description: 'Plan APS early so your application timeline does not stall later.',
          href: '/services/aps-application',
        },
        {
          title: 'Book guidance',
          description: "Talk through the best bachelor's route for your profile with BVF Germany.",
          href: '/bookings',
        },
      ]}
      tracksTitle="Key fields students usually explore at bachelor's level"
      tracksIntro="Your strongest path is the one that matches both your academic background and long-term interest."
      tracks={[
        { title: 'Mechanical Engineering', text: 'A strong fit for students who enjoy physics, design, and problem solving.', icon: 'MECH' },
        { title: 'Computer Science', text: 'Popular with students interested in software, systems, and digital careers.', icon: 'CS' },
        { title: 'Business', text: 'Useful for commerce-focused students targeting management and finance routes.', icon: 'BIZ' },
        { title: 'Medicine', text: 'A demanding path that needs careful planning, strong academics, and language readiness.', icon: 'MED' },
        { title: 'Architecture', text: 'A route for students interested in design, planning, and technical creativity.', icon: 'ARC' },
        { title: 'Science Pathways', text: 'Good for students targeting lab-based, analytical, or research-linked study.', icon: 'SCI' },
      ]}
      universitiesTitle="Top universities commonly explored for bachelor's study"
      universities={[
        'Technical University of Munich',
        'RWTH Aachen University',
        'Heidelberg University',
        'FU Berlin',
        'Karlsruhe Institute of Technology',
      ]}
      logos={[
        'Technical University of Munich',
        'RWTH Aachen University',
        'Heidelberg University',
        'Karlsruhe Institute of Technology',
      ]}
      faqs={[
        {
          q: 'How long is a bachelor\'s degree in Germany?',
          a: 'The standard duration is 3 to 4 years, depending on the university and programme.',
        },
        {
          q: 'What language score is usually needed?',
          a: 'Many English-taught programmes ask for IELTS 6.0 to 6.5, while German-taught routes usually ask for German B2.',
        },
        {
          q: 'Is tuition really free?',
          a: 'At many public universities, yes. Students usually pay only a semester fee of around EUR 150 to EUR 350.',
        },
        {
          q: 'Which universities do students target most?',
          a: 'Common names include TU Munich, RWTH Aachen, Heidelberg, FU Berlin, and KIT.',
        },
      ]}
      finalCtaTitle="Need help planning your bachelor's route in Germany?"
      finalCtaText="We can help you shortlist the right universities, plan APS and language proof, and move toward a bachelor's application strategy that actually fits your profile."
      finalPrimaryCta={{ label: "Book bachelor's guidance", to: '/bookings' }}
      finalSecondaryCta={{
        label: 'Start shortlisting',
        to: '/services/university-shortlist',
      }}
    />
  );
}
