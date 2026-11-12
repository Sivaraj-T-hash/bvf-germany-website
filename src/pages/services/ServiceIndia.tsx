import ServiceDetailPage from '@/components/ServiceDetailPage';

export default function ServiceIndiaPage() {
  return (
    <ServiceDetailPage
      title="Service in India"
      subtitle="Counseling, admissions, and document support before you fly to Germany."
      ctaLabel="Book a Counseling"
      ctaTo="/contact"
      introTitle="Counseling That Removes Confusion"
      introText="Students often feel overwhelmed by university choices, course selection, and eligibility requirements. BVF Germany simplifies the process with structured counseling and clear steps that reduce anxiety for students and parents alike."
      features={[
        {
          title: 'Personalized Guidance',
          text: 'We map the best university options based on profile and goals.',
        },
        {
          title: 'Admission Guidance',
          text: 'Applications, timelines, and updates handled with precision.',
        },
        {
          title: 'Post‑Admission Support',
          text: 'SOP/LOR reviews and preparation for the next steps.',
        },
      ]}
      checklistTitle="What We Help With"
      checklist={[
        'University shortlisting',
        'SOP & LOR guidance',
        'APS document review',
        'Admission tracking & follow‑ups',
        'Language preparation roadmap',
      ]}
      storyBlocks={[
        {
          title: 'Admission Support',
          text:
            'Once counseling is complete, we move into the application process. We stay updated on university policies and deadlines and guide you step‑by‑step to avoid mistakes.',
        },
        {
          title: 'SOP & LOR Assistance',
          text:
            'We help you craft a clear, powerful Statement of Purpose and Letters of Recommendation that strengthen your admission chances.',
          align: 'right',
        },
        {
          title: 'APS Interview Preparation',
          text:
            'Mock interviews and topic‑wise preparation help you explain your academic subjects confidently and pass APS smoothly.',
        },
      ]}
      faqs={[
        {
          q: 'Do you help with university shortlisting?',
          a: 'Yes, we build a shortlist based on your academic profile and budget.',
        },
        {
          q: 'Can I get SOP/LOR review support?',
          a: 'Absolutely. Our team provides editing and university‑specific guidance.',
        },
      ]}
    />
  );
}
