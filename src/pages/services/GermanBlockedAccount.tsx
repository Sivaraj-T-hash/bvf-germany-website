import ServiceDetailPage from '@/components/ServiceDetailPage';

export default function GermanBlockedAccountPage() {
  return (
    <ServiceDetailPage
      title="Blocked Account in Germany"
      subtitle="Minimum amount, providers, documents, and step‑by‑step guidance for 2026."
      heroImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1400&auto=format&fit=crop"
      ctaLabel="Check Your Eligibility"
      ctaTo="/contact"
      introTitle="What is a Blocked Account?"
      introText="A blocked account is a special bank account required for most student visa applicants. You deposit a lump sum before travel, and withdraw a fixed monthly amount for living expenses after arriving in Germany."
      introImage="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1400&auto=format&fit=crop"
      features={[
        {
          title: 'Is it Mandatory?',
          text: 'Yes, in most cases for 2026 unless you have a full scholarship or official sponsorship.',
        },
        {
          title: 'Minimum Amount (2026)',
          text: 'Approx. EUR 11,208 per year (about EUR 934 per month) for visa proof.',
        },
        {
          title: 'Approved Providers',
          text: 'Fintiba, Expatrio, Coracle, Deutsche Bank and other accepted providers.',
        },
      ]}
      checklistTitle="Documents Required"
      checklist={[
        'Valid passport',
        'German university admission letter',
        'Visa application copy',
        'Completed application form',
        'Proof of payment',
        'Address details',
      ]}
      storyBlocks={[
        {
          title: 'Step‑by‑Step Process',
          text:
            'Choose an approved provider, complete the online application, upload required documents, transfer the blocked amount, receive the confirmation certificate, and submit it during your visa appointment. The process typically takes 5–10 working days.',
          image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400&auto=format&fit=crop',
        },
        {
          title: 'Common Mistakes to Avoid',
          text:
            'Sending the wrong transfer amount, choosing non‑approved banks, delaying account opening, or submitting incomplete documents can slow your visa process.',
          image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1400&auto=format&fit=crop',
          align: 'right',
        },
        {
          title: 'Provider Selection Support',
          text:
            'We compare processing time, fees, and customer support across providers so you can select the best option for your profile.',
          image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1400&auto=format&fit=crop',
        },
      ]}
      faqs={[
        {
          q: 'Is blocked account refundable?',
          a: 'Yes. The money remains yours and is released monthly after arrival; if the visa is rejected, the amount is refunded minus bank charges.',
        },
        {
          q: 'Can parents sponsor instead of a blocked account?',
          a: 'Yes, in some cases with a formal obligation letter or full scholarship support.',
        },
        {
          q: 'Which blocked account is best for Germany?',
          a: 'Fintiba, Expatrio, Coracle, and Deutsche Bank are popular accepted providers.',
        },
      ]}
    />
  );
}
