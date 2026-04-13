import ServiceDetailPage from '@/components/ServiceDetailPage';

export default function StudentAccommodationPage() {
  return (
    <ServiceDetailPage
      title="Student Accommodation"
      subtitle="Find safe, student‑friendly housing options before you land."
      heroImage="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400&auto=format&fit=crop"
      ctaLabel="Find Accommodation Support"
      ctaTo="/contact"
      introTitle="Housing Support That Feels Secure"
      introText="We help students shortlist housing options, understand contracts, and avoid last‑minute stress. Your accommodation plan is prepared well before arrival."
      introImage="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1400&auto=format&fit=crop"
      features={[
        { title: 'Dorms & WGs', text: 'Student housing, shared apartments, and private rentals.' },
        { title: 'Verified Options', text: 'Guidance to avoid scams and secure safe housing.' },
        { title: 'Move‑in Support', text: 'Deposit, contracts, and checklists explained clearly.' },
      ]}
      checklistTitle="Accommodation Checklist"
      checklist={[
        'Preferred city & budget',
        'Housing type selection',
        'Contract review support',
        'Deposit and payment guidance',
        'Move‑in checklist',
      ]}
      storyBlocks={[
        {
          title: 'Shortlisting the Right Area',
          text:
            'We help you compare neighborhoods based on budget, commute, and student safety so your daily routine stays comfortable.',
          image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop',
        },
      ]}
      faqs={[
        { q: 'When should I start searching for housing?', a: 'Start early, ideally 3–6 months before intake.' },
        { q: 'Can BVF Germany help with contracts?', a: 'Yes, we review rental agreements and explain terms.' },
      ]}
    />
  );
}
