import ServiceDetailPage from '@/components/ServiceDetailPage';

export default function ServiceGermanyPage() {
  return (
    <ServiceDetailPage
      title="Service in Germany"
      subtitle="On‑ground support for accommodation, insurance, and settling in."
      heroImage="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1400&auto=format&fit=crop"
      ctaLabel="Get Arrival Support"
      ctaTo="/contact"
      introTitle="Support That Feels Like Home"
      introText="Moving to a new country can feel overwhelming. BVF Germany stays with you even after admission — helping with accommodation, city orientation, insurance, and more."
      introImage="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400&auto=format&fit=crop"
      features={[
        {
          title: 'Accommodation Support',
          text: 'Options for dorms, WG, and private rentals with move‑in guidance.',
        },
        {
          title: 'Health Insurance',
          text: 'Mandatory insurance setup soon after arrival.',
        },
        {
          title: 'Visa Extension',
          text: 'Guidance for visa extensions and document renewals.',
        },
      ]}
      checklistTitle="On‑Ground Services"
      checklist={[
        'Airport pickup support',
        'City orientation & local travel',
        'Accommodation assistance',
        'Health insurance setup',
        'Community connections',
      ]}
      storyBlocks={[
        {
          title: 'Accommodation & Safety',
          text:
            'We help students find secure housing and guide them through rental processes so they feel safe and settled quickly.',
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400&auto=format&fit=crop',
        },
        {
          title: 'After‑Arrival Support',
          text:
            'Even after you reach Germany, our team remains available. We understand the challenges of adapting to a new culture and provide continued guidance.',
          image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop',
          align: 'right',
        },
        {
          title: 'Local Registration & Banking',
          text:
            'We guide you through city registration, student IDs, and basic banking setup so you can focus on academics.',
          image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400&auto=format&fit=crop',
        },
      ]}
      faqs={[
        {
          q: 'Do you provide airport pickup?',
          a: 'Yes, we assist with airport pickup and your first accommodation transfer.',
        },
        {
          q: 'Is health insurance mandatory?',
          a: 'Yes, health insurance is mandatory for all students in Germany.',
        },
      ]}
    />
  );
}
