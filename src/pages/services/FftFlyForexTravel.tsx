import ServiceDetailPage from '@/components/ServiceDetailPage';

export default function FftFlyForexTravelPage() {
  return (
    <ServiceDetailPage
      title="FFT – Fly, Forex, Travel"
      subtitle="Tickets, forex, and travel prep handled end‑to‑end."
      ctaLabel="Book Free Consultation Now"
      ctaTo="/contact"
      introTitle="Travel Ready from Day One"
      introText="We simplify your travel planning so you arrive in Germany prepared and confident. From flight tickets to forex assistance, we cover every detail."
      features={[
        { title: 'Flight Tickets', text: 'Student fares, baggage support, and flexible routes.' },
        { title: 'Forex Assistance', text: 'Guidance on choosing regulated forex options and making safe transfers.' },
        { title: 'Arrival Planning', text: 'Checklists and guidance for a smooth landing.' },
      ]}
      checklistTitle="Travel Readiness Checklist"
      checklist={[
        'Passport & visa documents',
        'Forex card and cash backup',
        'Travel insurance',
        'University address & contacts',
        'Local SIM and transport plan',
      ]}
      storyBlocks={[
        {
          title: 'Forex Services',
          text:
            'Different countries have different currencies and exchange rules. We assist with forex guidance so students can focus on the journey without financial stress.',
        },
        {
          title: 'Airport & First‑Week Support',
          text:
            'We help you plan arrival timing, local transport, and first‑week essentials so you settle quickly without confusion.',
          align: 'right',
        },
      ]}
      faqs={[
        { q: 'Do you help with student flight tickets?', a: 'Yes, we provide student fares and baggage guidance.' },
        { q: 'Can you assist with forex?', a: 'Yes, we help you choose safe and affordable forex options.' },
      ]}
    />
  );
}
