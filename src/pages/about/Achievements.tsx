import AboutStoryPage from '@/components/AboutStoryPage';

export default function AchievementsPage() {
  return (
    <AboutStoryPage
      title="Achievements"
      subtitle="Milestones that reflect our student-first promise and community impact."
      heroImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop"
      ctaLabel="View Success Stories"
      ctaTo="/blog"
      stats={[
        { value: '5,000+', label: 'Visa Approvals' },
        { value: '100K+', label: 'Student Community' },
        { value: '98%', label: 'APS Success' },
      ]}
      sections={[
        {
          title: 'Student Success Highlights',
          text:
            'Thousands of students have secured APS approvals and German university admissions with our guidance. Our structured process helps reduce uncertainty and improve outcomes.',
          image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1400&auto=format&fit=crop',
          bullets: ['APS approvals', 'Visa successes', 'Top university admits'],
        },
        {
          title: 'Community Growth',
          text:
            'A large and active student community shares experiences and helps new aspirants. We host events, sessions, and mentorship circles to keep students confident and informed.',
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop',
          bullets: ['Workshops and events', 'Mentorship circles', 'Online resources'],
        },
        {
          title: 'Trusted Partnerships',
          text:
            'We collaborate with verified institutions and service providers to deliver consistent, transparent, and high‑quality support throughout the journey.',
          image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400&auto=format&fit=crop',
          bullets: ['Banking partners', 'Accommodation networks', 'Career mentors'],
        },
      ]}
      gallery={[
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=900&auto=format&fit=crop',
      ]}
    />
  );
}
