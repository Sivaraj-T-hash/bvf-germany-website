import AboutStoryPage from '@/components/AboutStoryPage';

export default function SocialContributionPage() {
  return (
    <AboutStoryPage
      title="Social Contribution"
      subtitle="Giving back to the community through guidance, resources, and social impact."
      heroImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop"
      ctaLabel="Partner With Us"
      ctaTo="/contact"
      stats={[
        { value: '500+', label: 'Free Mentorships' },
        { value: '50+', label: 'Workshops' },
        { value: '10+', label: 'Community Partners' },
      ]}
      sections={[
        {
          title: 'Student Mentorship',
          text:
            'We mentor students from diverse backgrounds to make Germany education accessible and achievable.',
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop',
          bullets: ['Free webinars', 'Career guidance', 'Scholarship awareness'],
        },
        {
          title: 'Resource Sharing',
          text:
            'Practical checklists, templates, and resources help students succeed at every stage.',
          image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1400&auto=format&fit=crop',
          bullets: ['APS prep guides', 'Visa checklists', 'University planning tools'],
        },
        {
          title: 'Community Impact',
          text:
            'We collaborate with institutions to deliver high‑quality support and long‑term student success.',
          image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop',
          bullets: ['Workshops and sessions', 'Partner initiatives', 'Long-term student support'],
        },
      ]}
      gallery={[
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=900&auto=format&fit=crop',
      ]}
    />
  );
}
