import ServiceDetailPage from '@/components/ServiceDetailPage';

export default function StudentFlightTicketsPage() {
  return (
    <ServiceDetailPage
      title="Student Flight Tickets"
      subtitle="Smart booking, student fares, and arrival planning for Germany."
      heroImage="https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1400&auto=format&fit=crop"
      ctaLabel="Get Ticket Support"
      ctaTo="/contact"
      introTitle="Book Smart, Travel Easy"
      introText="We help students find the best fares, plan baggage, and coordinate arrival so you can land in Germany without last‑minute stress."
      introImage="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1400&auto=format&fit=crop"
      features={[
        { title: 'Best Fare Windows', text: 'Seasonal price insights and flexible date planning.' },
        { title: 'Student Baggage', text: 'Extra baggage options and airline comparisons.' },
        { title: 'Arrival Coordination', text: 'Timing aligned with accommodation and university schedules.' },
      ]}
      checklistTitle="Flight Booking Checklist"
      checklist={[
        'Student fare eligibility',
        'Baggage allowances',
        'Airport arrival time',
        'Accommodation confirmation',
        'Local transport plan',
      ]}
      storyBlocks={[
        {
          title: 'Baggage & Essentials',
          text:
            'We guide you on extra baggage options, packing lists, and what to carry for your first semester.',
          image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1400&auto=format&fit=crop',
        },
      ]}
      faqs={[
        { q: 'Do you help with student fares?', a: 'Yes, we assist in finding student-friendly fares.' },
        { q: 'Can you help plan arrivals?', a: 'Yes, we align arrivals with accommodation and university schedules.' },
      ]}
    />
  );
}
