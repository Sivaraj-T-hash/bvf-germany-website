import ServiceDetailPage from '@/components/ServiceDetailPage';

export default function StudentHealthInsurancePage() {
  return (
    <ServiceDetailPage
      title="Student Health Insurance"
      subtitle="Mandatory health coverage that meets university and visa requirements."
      heroImage="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1400&auto=format&fit=crop"
      ctaLabel="Get Insurance Guidance"
      ctaTo="/contact"
      introTitle="Health Insurance Made Simple"
      introText="Health insurance is mandatory for students in Germany. We explain public vs private options, help you enroll, and provide proof for university registration."
      introImage="https://images.unsplash.com/photo-1504814532849-92784a7d7577?q=80&w=1400&auto=format&fit=crop"
      features={[
        { title: 'Public vs Private', text: 'Compare costs, coverage, and visa acceptance.' },
        { title: 'Enrollment Support', text: 'Step‑by‑step assistance for registration and documents.' },
        { title: 'Renewal Guidance', text: 'Plan changes and renewal support after arrival.' },
      ]}
      checklistTitle="Insurance Checklist"
      checklist={[
        'Visa‑compliant insurance option',
        'Enrollment documents',
        'University submission proof',
        'Renewal reminders',
        'Emergency support contacts',
      ]}
      storyBlocks={[
        {
          title: 'Public vs Private Options',
          text:
            'We explain which insurance types are accepted by universities and embassies, and help you choose the right plan.',
          image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1400&auto=format&fit=crop',
        },
      ]}
      faqs={[
        { q: 'Is health insurance mandatory in Germany?', a: 'Yes, it is required for all students.' },
        { q: 'Do you help with insurance proof?', a: 'Yes, we guide you through documentation submission.' },
      ]}
    />
  );
}
