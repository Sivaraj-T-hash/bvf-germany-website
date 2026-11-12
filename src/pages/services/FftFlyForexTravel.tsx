import ServiceDetailPage from '@/components/ServiceDetailPage';

export default function FftFlyForexTravelPage() {
  return (
    <ServiceDetailPage
      title="FFT – Fly, Forex, Travel"
      subtitle="Tickets, forex, and travel prep handled end‑to‑end."
      heroImage="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop"
      ctaLabel="Book Free Consultation Now"
      ctaTo="/contact"
      introTitle="Travel Ready from Day One"
      introText="We simplify your travel planning so you arrive in Germany prepared and confident. From flight tickets to forex assistance, we cover every detail."
      introImage="https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1400&auto=format&fit=crop"
      features={[
        { title: 'Flight Tickets', text: 'Student fares, baggage support, and flexible routes.' },
        { title: 'Forex Assistance', text: 'Trusted exchange partners and safe transfers.' },
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
          image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1400&auto=format&fit=crop',
        },
        {
          title: 'Airport & First‑Week Support',
          text:
            'We help you plan arrival timing, local transport, and first‑week essentials so you settle quickly without confusion.',
          image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1400&auto=format&fit=crop',
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
