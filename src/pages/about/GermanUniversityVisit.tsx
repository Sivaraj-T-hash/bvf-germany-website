import AboutStoryPage from '@/components/AboutStoryPage';

export default function GermanUniversityVisitPage() {
  return (
    <AboutStoryPage
      title="Our Visit to German University"
      subtitle="Insights from campus visits that help students choose the right university."
      heroImage="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1400&auto=format&fit=crop"
      ctaLabel="Talk to Us"
      ctaTo="/contact"
      stats={[
        { value: '2x', label: 'Visits Each Year' },
        { value: '25+', label: 'Universities Met' },
        { value: '100%', label: 'Student‑first Focus' },
      ]}
      sections={[
        {
          title: 'Campus Insights',
          text:
            'We explore facilities, labs, and student services to share practical insights that help students make informed choices.',
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop',
          bullets: ['Lab infrastructure', 'Student housing', 'Campus life'],
        },
        {
          title: 'Faculty Interactions',
          text:
            'Meetings with professors help us understand program expectations and research scope — which we pass on to students.',
          image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop',
          bullets: ['Research opportunities', 'Curriculum updates', 'Admission expectations'],
        },
        {
          title: 'Student Feedback',
          text:
            'We capture real student experiences about academics, life, and career outcomes to support future applicants.',
          image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1400&auto=format&fit=crop',
          bullets: ['Course workload', 'City life', 'Internship experiences'],
        },
      ]}
      gallery={[
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=900&auto=format&fit=crop',
      ]}
    />
  );
}
