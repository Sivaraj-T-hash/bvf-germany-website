import StudyProgramPage from '@/components/StudyProgramPage';

export default function EngineeringGermanyPage() {
  return (
    <StudyProgramPage
      title="Master's in Engineering in Germany"
      subtitle="Germany is one of the strongest destinations for engineering students who want public-university education, industry-linked specializations, and a high-value technical degree."
      heroBadge="Engineering master's"
      heroHighlights={[
        'Duration: 2 years (4 semesters)',
        'IELTS 6.5-7.0 or German B2/C1',
        'Public universities with low semester fees',
      ]}
      primaryCta={{
        label: 'Plan my engineering route',
        to: '/bookings',
      }}
      secondaryCta={{ label: 'View all study paths', to: '/study-in-germany' }}
      summaryFacts={[
        { label: 'Duration', value: '2 years (4 semesters)' },
        { label: 'Eligibility', value: 'B.Tech / B.E. in relevant field (min 55-60%)' },
        { label: 'Language Req', value: 'IELTS 6.5-7.0 or German B2/C1' },
        { label: 'Tuition / Cost', value: 'Free (Semester fee EUR 150-350)' },
      ]}
      overviewTitle="Engineering in Germany is strongest when your previous degree matches the specialization"
      overviewText="Engineering admissions in Germany usually reward students who align their bachelor's degree, modules, and language profile with the exact specialisation they want to pursue. The more precise the fit, the stronger the shortlist becomes."
      overviewBullets={[
        'Top engineering universities often shortlisted include TU Munich, TU Berlin, Stuttgart, Darmstadt, and Hamburg.',
        'Popular specialisations include Mechanical, Electrical, Civil, CS, Automotive, and Robotics.',
        'Public universities usually remain tuition-free, with students paying only semester fees.',
      ]}
      checklistTitle="Engineering shortlist checklist"
      checklistItems={[
        'Confirm that your B.Tech or B.E. background matches the target engineering field.',
        'Plan IELTS 6.5 to 7.0 or German B2/C1 before finalizing the shortlist.',
        'Compare module overlap, not just university rankings.',
        'Check intake deadlines, APS timing, and technical-document requirements early.',
      ]}
      warningText="Engineering course titles can look similar across Germany, but the curriculum, technical prerequisites, and language expectations can vary sharply by university."
      pathwaysTitle="Three core decisions shape a stronger engineering application"
      pathwaysIntro="Students usually do better when they decide the specialisation, university type, and language route before they apply widely."
      pathways={[
        {
          title: 'Specialisation fit',
          audience: 'Decision 1',
          summary: 'Engineering admissions get stronger when your undergraduate modules line up with the master\'s specialisation you want next.',
          bullets: [
            'Mechanical and Automotive routes often expect strong math and design foundations.',
            'Electrical and Robotics programmes usually check technical-module depth closely.',
            'CS-linked technical routes often reward stronger computing exposure.',
          ],
          linkLabel: 'Check your engineering fit',
          linkTo: '/tools',
        },
        {
          title: 'Language route',
          audience: 'Decision 2',
          summary: 'Students should choose early whether the shortlist will focus on English-taught or German-taught engineering programmes.',
          bullets: [
            'IELTS 6.5 to 7.0 is common for English-taught programmes.',
            'German B2/C1 is common for German-taught routes.',
            'Basic German still helps internships and post-study employability even in English programmes.',
          ],
          linkLabel: 'Plan language prep',
          linkTo: '/services/germany-language',
        },
        {
          title: 'University style',
          audience: 'Decision 3',
          summary: 'Choose between theory-heavy technical universities and more applied routes based on how you want to study and work later.',
          bullets: [
            'Technical universities often suit research and deep specialization.',
            'Applied routes can feel closer to project work and industry practice.',
            'The best-fit environment depends on your long-term career style.',
          ],
          linkLabel: 'Shortlist engineering universities',
          linkTo: '/services/university-shortlist',
        },
      ]}
      requirementsTitle="What engineering applicants usually need to prove"
      requirementsIntro="Engineering admissions usually revolve around academic alignment, language proof, and the quality of your technical profile."
      requirements={[
        {
          eyebrow: 'Eligibility',
          title: 'Your degree should align with the specialisation',
          text: 'A relevant B.Tech or B.E. is the baseline, but universities often look deeper at subject overlap and percentage requirements.',
          bullets: [
            'Most programmes expect a relevant engineering background.',
            'A 55 to 60 percent academic range is a common benchmark in the brief you shared.',
            'Projects, internships, and labs can strengthen the technical story.',
          ],
        },
        {
          eyebrow: 'Language',
          title: 'Language proof shapes both shortlist size and program quality',
          text: 'Engineering students should usually plan around IELTS 6.5 to 7.0 for English-taught courses or German B2/C1 for German-medium routes.',
          bullets: [
            'English-taught options are common at master\'s level.',
            'German-taught routes can widen your university options further.',
            'Stronger language planning also helps internships and networking later.',
          ],
        },
        {
          eyebrow: 'Cost',
          title: 'Low tuition still needs a realistic total budget',
          text: 'Public universities may stay tuition-free, but engineering students should still plan for semester fees, housing, travel, and student life costs.',
          bullets: [
            'Semester fee usually stays around EUR 150-350.',
            'Major technical cities can carry higher rent pressure.',
            'Budget planning becomes easier when the target cities are narrowed early.',
          ],
        },
      ]}
      stepsTitle="A practical order for engineering applications"
      stepsIntro="Students usually save time when they narrow the field and language route before building a large university list."
      steps={[
        {
          title: 'Choose the engineering specialization',
          text: 'Start with the subject you want to pursue next: Mechanical, Electrical, Civil, CS, Automotive, or Robotics.',
        },
        {
          title: 'Check academic match',
          text: 'Compare your B.Tech or B.E. modules with the target programme to avoid weak-fit applications.',
        },
        {
          title: 'Plan IELTS or German',
          text: 'Language proof should be scheduled around the shortlist and intake, not left to the last minute.',
        },
        {
          title: 'Build a targeted shortlist',
          text: 'Focus on universities like TU Munich, TU Berlin, Stuttgart, Darmstadt, and Hamburg only after fit and language are clear.',
        },
        {
          title: 'Prepare APS and technical documents',
          text: 'Get transcripts, degree proof, passport, CV, APS, and supporting technical details ready for applications.',
        },
        {
          title: 'Move into visa and settlement planning',
          text: 'Once admissions are moving, shift into visa, housing, blocked account, and relocation preparation.',
        },
      ]}
      planningTitle="Engineering planning should connect specialization, city, and employability"
      planningIntro="Germany rewards engineering students who pick the right technical route early and then build the rest of the application around that fit."
      planningCards={[
        {
          eyebrow: 'Top universities',
          title: 'Use top names carefully and realistically',
          text: 'Engineering students often compare TU Munich, TU Berlin, Stuttgart, Darmstadt, and Hamburg because they offer strong technical reputations and public-university value.',
          bullets: [
            'University reputation matters, but curriculum fit matters more.',
            'Language and city cost should be considered alongside ranking.',
            'The best shortlist balances ambition with academic realism.',
          ],
        },
        {
          eyebrow: 'Key fields',
          title: 'Engineering is broad, so field choice matters early',
          text: 'Popular fields include Mechanical, Electrical, Civil, Computer Science, Automotive, and Robotics.',
          bullets: [
            'Automotive and Robotics often require precise module alignment.',
            'CS-linked technical routes may need stronger computing background.',
            'Civil and Mechanical can differ sharply in document and course expectations.',
          ],
        },
        {
          eyebrow: 'Cost planning',
          title: 'Public tuition is low, but technical-city costs still matter',
          text: 'Even with free tuition, technical students should plan for housing, transport, equipment, and daily living costs around their target city.',
          bullets: [
            'Semester fee usually stays around EUR 150-350.',
            'Rent pressure can rise in major industrial hubs.',
            'A strong city budget plan helps later visa preparation too.',
          ],
        },
      ]}
      toolsTitle="Useful BVF pages before you finalize your engineering route"
      tools={[
        {
          title: 'Study in Germany overview',
          description: 'Compare engineering against other Germany pathways before you commit.',
          href: '/study-in-germany',
        },
        {
          title: 'University Shortlisting',
          description: 'Get a realistic list of engineering universities based on profile and field.',
          href: '/services/university-shortlist',
        },
        {
          title: 'IELTS Preparation',
          description: 'Target the language score many English-taught engineering programmes expect.',
          href: '/services/ielts-preparation',
        },
        {
          title: 'Book engineering guidance',
          description: 'Talk through field fit, universities, and application timing with BVF Germany.',
          href: '/bookings',
        },
      ]}
      tracksTitle="Key engineering fields students explore most"
      tracksIntro="The stronger the specialisation match, the stronger the shortlist usually becomes."
      tracks={[
        { title: 'Mechanical Engineering', text: 'A strong route for design, thermals, manufacturing, and core engineering systems.', icon: 'MECH' },
        { title: 'Electrical Engineering', text: 'Useful for power systems, electronics, controls, and high-value technical roles.', icon: 'ELEC' },
        { title: 'Civil Engineering', text: 'Relevant for structures, infrastructure, transport, and construction pathways.', icon: 'CIV' },
        { title: 'Computer Science', text: 'Popular for software-linked engineering, systems, and data-heavy technical routes.', icon: 'CS' },
        { title: 'Automotive', text: 'A classic Germany draw for students targeting mobility and vehicle systems.', icon: 'AUTO' },
        { title: 'Robotics', text: 'A strong path for students blending mechanics, controls, automation, and AI.', icon: 'ROBO' },
      ]}
      universitiesTitle="Top universities students compare for engineering"
      universities={[
        'Technical University of Munich',
        'Technical University of Berlin',
        'University of Stuttgart',
        'TU Darmstadt',
        'University of Hamburg',
      ]}
      logos={[
        'Technical University of Munich',
        'Technical University of Berlin',
        'University of Stuttgart',
      ]}
      faqs={[
        {
          q: 'How long is a master\'s in engineering in Germany?',
          a: 'The standard duration is 2 years, usually spread across 4 semesters.',
        },
        {
          q: 'What academic background is usually needed?',
          a: 'A relevant B.Tech or B.E. is the standard eligibility route, usually with at least 55 to 60 percent depending on the programme.',
        },
        {
          q: 'What language score is commonly expected?',
          a: 'Many English-taught programmes ask for IELTS 6.5 to 7.0, while German-medium programmes often ask for German B2 or C1.',
        },
        {
          q: 'Which universities do students target most?',
          a: 'Commonly considered universities include TU Munich, TU Berlin, Stuttgart, Darmstadt, and Hamburg.',
        },
      ]}
      finalCtaTitle="Need help with a master's in engineering shortlist?"
      finalCtaText="We can help you match your technical background to the right universities, language plan, and application order before you start spending money on the process."
      finalPrimaryCta={{ label: 'Book engineering guidance', to: '/bookings' }}
      finalSecondaryCta={{
        label: 'Start shortlisting',
        to: '/services/university-shortlist',
      }}
    />
  );
}
