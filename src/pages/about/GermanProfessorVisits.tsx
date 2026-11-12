import AboutStoryPage from '@/components/AboutStoryPage';

export default function GermanProfessorVisitsPage() {
  return (
    <AboutStoryPage
      title="German Professors Visits"
      subtitle="Bringing German academic perspectives directly to Indian students."
      ctaLabel="Join an Event"
      ctaTo="/contact"
      sections={[
        {
          title: 'Guest Lectures',
          text:
            'Professors share expectations, research trends, and admission insights to help students prepare effectively.',
          bullets: ['Research outlook', 'Academic expectations', 'Career insights'],
        },
        {
          title: 'Q&A Sessions',
          text:
            'Interactive sessions where students ask real questions and get clarity on programs and university life.',
          bullets: ['Program selection clarity', 'Application tips', 'Life in Germany guidance'],
        },
        {
          title: 'Collaborative Opportunities',
          text:
            'Build connections that open doors to research projects, labs, and future mentorship.',
          bullets: ['Research collaboration', 'Lab exposure', 'Mentorship networks'],
        },
      ]}
    />
  );
}
