import AboutStoryPage from '@/components/AboutStoryPage';

export default function GermanProfessorVisitsPage() {
  return (
    <AboutStoryPage
      title="German Professors Visits"
      subtitle="Bringing German academic perspectives directly to Indian students."
      heroImage="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop"
      ctaLabel="Join an Event"
      ctaTo="/contact"
      stats={[
        { value: '30+', label: 'Sessions Hosted' },
        { value: '15+', label: 'Guest Professors' },
        { value: '100%', label: 'Student Focus' },
      ]}
      sections={[
        {
          title: 'Guest Lectures',
          text:
            'Professors share expectations, research trends, and admission insights to help students prepare effectively.',
          image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1400&auto=format&fit=crop',
          bullets: ['Research outlook', 'Academic expectations', 'Career insights'],
        },
        {
          title: 'Q&A Sessions',
          text:
            'Interactive sessions where students ask real questions and get clarity on programs and university life.',
          image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1400&auto=format&fit=crop',
          bullets: ['Program selection clarity', 'Application tips', 'Life in Germany guidance'],
        },
        {
          title: 'Collaborative Opportunities',
          text:
            'Build connections that open doors to research projects, labs, and future mentorship.',
          image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop',
          bullets: ['Research collaboration', 'Lab exposure', 'Mentorship networks'],
        },
      ]}
      gallery={[
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
      ]}
    />
  );
}
