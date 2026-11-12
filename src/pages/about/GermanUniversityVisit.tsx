import AboutStoryPage from '@/components/AboutStoryPage';

export default function GermanUniversityVisitPage() {
  return (
    <AboutStoryPage
      title="Our Visit to German University"
      subtitle="Insights from campus visits that help students choose the right university."
      ctaLabel="Talk to Us"
      ctaTo="/contact"
      sections={[
        {
          title: 'Campus Insights',
          text:
            'We explore facilities, labs, and student services to share practical insights that help students make informed choices.',
          bullets: ['Lab infrastructure', 'Student housing', 'Campus life'],
        },
        {
          title: 'Faculty Interactions',
          text:
            'Meetings with professors help us understand program expectations and research scope — which we pass on to students.',
          bullets: ['Research opportunities', 'Curriculum updates', 'Admission expectations'],
        },
        {
          title: 'Student Feedback',
          text:
            'We capture real student experiences about academics, life, and career outcomes to support future applicants.',
          bullets: ['Course workload', 'City life', 'Internship experiences'],
        },
      ]}
    />
  );
}
