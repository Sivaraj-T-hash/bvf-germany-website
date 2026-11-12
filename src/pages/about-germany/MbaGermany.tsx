import StudyProgramPage from '@/components/StudyProgramPage';

export default function MbaGermanyPage() {
  return (
    <StudyProgramPage
      title="Master's in Business Management in Germany"
      subtitle="Germany is a strong option for students who want a management degree with public-university value, international business exposure, and long-term employability in Europe."
      heroBadge="Business management master's"
      heroImage="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop"
      heroHighlights={[
        'Duration: 1.5-2 years',
        'IELTS 6.5-7.0 and sometimes GMAT',
        'Public and business-school pathways',
      ]}
      primaryCta={{
        label: 'Plan my business route',
        to: '/bookings',
      }}
      secondaryCta={{ label: 'Explore study paths', to: '/study-in-germany' }}
      summaryFacts={[
        { label: 'Duration', value: '1.5-2 years' },
        { label: 'Eligibility', value: 'BBA / B.Com / MBA-equivalent (min 55%)' },
        { label: 'Language Req', value: 'IELTS 6.5-7.0, sometimes GMAT' },
        { label: 'Tuition / Cost', value: 'Free (Semester fee EUR 150-350)' },
      ]}
      overviewTitle="Business management in Germany works best when students choose the right degree and the right career story"
      overviewText="Students targeting business programmes in Germany usually do better when they connect prior academics, future job goals, and the right programme type before they start applying. Germany offers strong routes across international business, supply chain, finance, and marketing."
      overviewBullets={[
        'Top universities commonly compared include Mannheim, Frankfurt, Cologne, HHL Leipzig, and WHU.',
        'Popular key fields include International Business, Supply Chain, Finance, and Marketing.',
        'Many public-university routes remain tuition-free, with only low semester fees to plan for.',
      ]}
      checklistTitle="Business management checklist"
      checklistItems={[
        'Confirm whether your degree background supports a management-focused master\'s route.',
        'Plan IELTS 6.5 to 7.0 early and check whether your shortlist includes GMAT-sensitive programmes.',
        'Choose between public-university value and more premium business-school pathways.',
        'Build a career story that explains why Germany and why this business field now.',
      ]}
      warningText="Business and management programmes can look similar at first glance, but admission style, tuition, test expectations, and career outcomes can vary widely by school."
      pathwaysTitle="Three decisions shape a better business-management application"
      pathwaysIntro="Students usually get better results when they decide the degree type, field focus, and test plan before finalizing the shortlist."
      pathways={[
        {
          title: 'Degree fit',
          audience: 'Decision 1',
          summary: 'Your prior academic background should connect naturally to the management programme you want to pursue next.',
          bullets: [
            'BBA and B.Com students usually fit naturally into management and business routes.',
            'Equivalent business-focused degrees can also support the shortlist.',
            'The cleaner the academic match, the easier the application story becomes.',
          ],
          linkLabel: 'Check your profile',
          linkTo: '/tools',
        },
        {
          title: 'Test and language plan',
          audience: 'Decision 2',
          summary: 'The strongest business applications usually map IELTS and any GMAT need before the final list is locked.',
          bullets: [
            'IELTS 6.5 to 7.0 is a common range for business programmes.',
            'Some more competitive programmes may also consider GMAT.',
            'Language and test planning should happen before deadlines get close.',
          ],
          linkLabel: 'Plan IELTS support',
          linkTo: '/services/ielts-preparation',
        },
        {
          title: 'Career focus',
          audience: 'Decision 3',
          summary: 'A better business shortlist starts with the career direction you want after graduation, not just a school name.',
          bullets: [
            'Popular fields include International Business, Supply Chain, Finance, and Marketing.',
            'The best course choice depends on the role you want after study.',
            'A clearer goal improves your SOP, CV, and interview readiness later.',
          ],
          linkLabel: 'Build a shortlist',
          linkTo: '/services/university-shortlist',
        },
      ]}
      requirementsTitle="What business-management applicants usually need to prove"
      requirementsIntro="Admissions usually revolve around academic fit, English readiness, and the credibility of your business-career direction."
      requirements={[
        {
          eyebrow: 'Eligibility',
          title: 'Business or commerce background is the usual baseline',
          text: 'Students usually need a BBA, B.Com, or equivalent background and a clear academic foundation for management study.',
          bullets: [
            'A minimum 55 percent benchmark is the figure in the brief you shared.',
            'A cleaner academic match usually improves shortlist quality.',
            'CV, internships, and project exposure can strengthen the file further.',
          ],
        },
        {
          eyebrow: 'Language',
          title: 'English proof is central for most business routes',
          text: 'Most business-management routes in Germany are English-led, so IELTS planning is a core part of the application.',
          bullets: [
            'IELTS 6.5 to 7.0 is a common range.',
            'Some programmes may also ask for or value GMAT.',
            'A stronger English score can widen the shortlist.',
          ],
        },
        {
          eyebrow: 'Cost',
          title: 'Public value is strong, but premium schools may cost more',
          text: 'Many business routes remain affordable at public universities, but more premium business-school options can carry higher costs and should be evaluated carefully.',
          bullets: [
            'Public routes often stay tuition-free with low semester fees.',
            'Private or premium schools can increase total cost sharply.',
            'Career outcome should always be compared against the cost of the degree.',
          ],
        },
      ]}
      stepsTitle="A practical order for business-management applications"
      stepsIntro="Students usually make better choices when they connect degree fit, career goal, and test planning in a clean sequence."
      steps={[
        {
          title: 'Choose the field direction',
          text: 'Start with International Business, Supply Chain, Finance, Marketing, or another business field you genuinely want to pursue.',
        },
        {
          title: 'Check academic fit',
          text: 'Confirm that your BBA, B.Com, or equivalent degree matches the target programme requirements.',
        },
        {
          title: 'Plan IELTS and GMAT if needed',
          text: 'Lock your English timeline first, then add GMAT only where the shortlist actually needs it.',
        },
        {
          title: 'Shortlist the right universities',
          text: 'Compare Mannheim, Frankfurt, Cologne, HHL Leipzig, and WHU only after your field and test plan are clear.',
        },
        {
          title: 'Prepare SOP, CV, and documents',
          text: 'Build a clear business story through your SOP, CV, transcripts, and any experience that supports your career direction.',
        },
        {
          title: 'Move into visa and settlement work',
          text: 'Once applications progress, begin blocked account, housing, and visa planning early.',
        },
      ]}
      planningTitle="Business management planning should connect ROI, tests, and career direction"
      planningIntro="A strong Germany business plan is not just about a school name. It is about degree fit, affordability, and the role you want after graduation."
      planningCards={[
        {
          eyebrow: 'Top universities',
          title: 'Shortlist schools that match your field and budget',
          text: 'Students often compare Mannheim, Frankfurt, Cologne, HHL Leipzig, and WHU because they are recognizable names in Germany business education.',
          bullets: [
            'School prestige matters less when the programme does not fit your direction.',
            'Public-university value and premium business-school cost should be weighed carefully.',
            'A strong shortlist balances reputation, affordability, and outcome.',
          ],
        },
        {
          eyebrow: 'Key fields',
          title: 'Business fields should connect to real career plans',
          text: 'International Business, Supply Chain, Finance, and Marketing were the key fields highlighted in your brief and each one needs its own shortlist logic.',
          bullets: [
            'Finance and Supply Chain may reward different project or internship backgrounds.',
            'Marketing and International Business often need a different application story.',
            'Field clarity strengthens SOP, LOR, and interview preparation later.',
          ],
        },
        {
          eyebrow: 'Cost planning',
          title: 'Low tuition helps, but ROI should stay central',
          text: 'Public routes can remain tuition-free, but students should still compare living costs, semester fees, and the career value of each programme.',
          bullets: [
            'Semester fee usually stays around EUR 150-350 for public routes.',
            'Premium business-school pathways may cost more.',
            'The best decision balances cost with employability and long-term fit.',
          ],
        },
      ]}
      toolsTitle="Useful BVF pages before you finalize a business shortlist"
      tools={[
        {
          title: 'Study in Germany overview',
          description: 'Compare business management against engineering, bachelor\'s, and Ausbildung pathways.',
          href: '/study-in-germany',
        },
        {
          title: 'University Shortlisting',
          description: 'Get a realistic business-school and public-university shortlist based on your profile.',
          href: '/services/university-shortlist',
        },
        {
          title: 'SOP & LOR Writing',
          description: 'Build a stronger management application story with structured writing support.',
          href: '/services/sop-lor-writing',
        },
        {
          title: 'Book business guidance',
          description: 'Talk through degree type, ROI, and applications with BVF Germany.',
          href: '/bookings',
        },
      ]}
      tracksTitle="Key business fields students usually compare"
      tracksIntro="The strongest shortlist is usually built around the role you want after graduation."
      tracks={[
        { title: 'International Business', text: 'A strong fit for students who want cross-border business exposure and global management roles.', icon: 'IB' },
        { title: 'Supply Chain', text: 'Useful for students interested in logistics, operations, and industrial business systems.', icon: 'SCM' },
        { title: 'Finance', text: 'A good path for students targeting financial analysis, banking, and business decision-making roles.', icon: 'FIN' },
        { title: 'Marketing', text: 'Relevant for students interested in brand, growth, communication, and market strategy.', icon: 'MKT' },
        { title: 'Business Analytics', text: 'A smart route for students blending business thinking with data-driven decisions.', icon: 'DATA' },
        { title: 'Management Strategy', text: 'Useful for students who want broad business understanding and leadership-linked roles.', icon: 'STR' },
      ]}
      universitiesTitle="Top universities students compare for business management"
      universities={[
        'Mannheim Business School',
        'Frankfurt School of Finance and Management',
        'University of Cologne',
        'HHL Leipzig Graduate School of Management',
        'WHU - Otto Beisheim School of Management',
      ]}
      logos={[
        'Mannheim Business School',
        'Frankfurt School of Finance and Management',
        'HHL Leipzig Graduate School of Management',
        'WHU - Otto Beisheim School of Management',
      ]}
      faqs={[
        {
          q: 'How long is a master\'s in business management in Germany?',
          a: 'The standard duration is usually 1.5 to 2 years, depending on the programme and university.',
        },
        {
          q: 'What academic background is usually expected?',
          a: 'A BBA, B.Com, or equivalent business-focused degree with at least 55 percent is the basic eligibility benchmark from your brief.',
        },
        {
          q: 'Do I always need GMAT?',
          a: 'No. IELTS 6.5 to 7.0 is common, and GMAT is only asked for by some programmes.',
        },
        {
          q: 'Which universities are most commonly compared?',
          a: 'Your brief highlighted Mannheim, Frankfurt, Cologne, HHL Leipzig, and WHU as key names for business-management planning.',
        },
      ]}
      finalCtaTitle="Need help with a business-management shortlist in Germany?"
      finalCtaText="We can help you connect your degree background, target field, tests, and universities into a Germany application plan that feels realistic and worth the investment."
      finalPrimaryCta={{ label: 'Book business guidance', to: '/bookings' }}
      finalSecondaryCta={{
        label: 'Start shortlisting',
        to: '/services/university-shortlist',
      }}
    />
  );
}
