import AboutStoryPage from '@/components/AboutStoryPage';

export default function SocialContributionPage() {
  return (
    <AboutStoryPage
      title="Social Contribution"
      subtitle="Giving back to the community through guidance, resources, and social impact."
      ctaLabel="Partner With Us"
      ctaTo="/contact"
      sections={[
        {
          title: 'Student Mentorship',
          text:
            'We mentor students from diverse backgrounds to make Germany education accessible and achievable.',
          bullets: ['Free webinars', 'Career guidance', 'Scholarship awareness'],
        },
        {
          title: 'Resource Sharing',
          text:
            'Practical checklists, templates, and resources help students succeed at every stage.',
          bullets: ['APS prep guides', 'Visa checklists', 'University planning tools'],
        },
        {
          title: 'Community Impact',
          text:
            'We collaborate with institutions to deliver high‑quality support and long‑term student success.',
          bullets: ['Workshops and sessions', 'Partner initiatives', 'Long-term student support'],
        },
      ]}
    />
  );
}
