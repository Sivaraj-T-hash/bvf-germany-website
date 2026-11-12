import ServiceDetailPage from '@/components/ServiceDetailPage';

export default function GermanBlockedAccountPage() {
  return (
    <ServiceDetailPage
      title="Blocked Account in Germany"
      subtitle="Complete guide to the mandatory German blocked account for 2026. Minimum amounts, top providers, required documents, and a seamless step‑by‑step opening process."
      ctaLabel="Book Free Consultation Now"
      ctaTo="/contact"
      introTitle="What is a Blocked Account (Sperrkonto)?"
      introText="A blocked account (Sperrkonto) is a special bank account tailored for international students applying for a German student visa. It serves as financial proof that you can support yourself during your studies. You deposit a required lump sum before traveling, and once you arrive in Germany, a fixed monthly amount is unblocked and transferred to your current account to cover living expenses like rent, groceries, and insurance. For the year 2026, the required amount ensures you have a stable financial start without worrying about part-time jobs immediately."
      features={[
        {
          title: 'Is it Mandatory for the Visa?',
          text: 'Yes, it is practically mandatory for all international students unless you have a fully-funded official scholarship (like DAAD) or a recognized sponsor in Germany (Verpflichtungserklärung).',
        },
        {
          title: 'Minimum Amount Requirements (2026)',
          text: 'As of 2026, the German government requires €11,904 per year, which is €992 per month. The amount follows the standard BAföG rate for students and can change, so we confirm the latest official figure during your consultation.',
        },
        {
          title: 'Approved & Recommended Providers',
          text: 'We recommend digital providers like Expatrio, Fintiba, and Coracle for their speed and low fees. Traditional banks like Deutsche Bank are also accepted but typically take much longer to process.',
          link: 'https://www.expatrio.com?fp_ref=bvf-germany',
          linkText: 'Open Expatrio Blocked Account'
        },
      ]}
      checklistTitle="Documents Required to Open an Account"
      checklist={[
        'A valid Passport (bio-data page)',
        'Letter of Admission from a German University',
        'Your current address and contact details',
        'Tax Identification Number (TIN) from your home country (if applicable)',
        'Source of funds declaration (sometimes required for large transfers)'
      ]}
      storyBlocks={[
        {
          title: 'Step‑by‑Step Opening Process',
          text: '1. Compare providers and select one that fits your needs.\n2. Complete the online application on the provider\'s portal (takes less than 10 minutes).\n3. Receive your IBAN details for the blocked account.\n4. Transfer the required amount (€11,904 for one year, as of 2026) using standard bank transfer or platforms like Remitly/Wise.\n5. Wait for the funds to arrive (usually 3-5 days). Once confirmed, you will receive your "06 Blocked Amount Confirmation", which is the exact document the embassy needs for your visa.',
        },
        {
          title: 'Important: Activating the Account After Arrival',
          text: 'Your blocked account does not work like a normal debit account. Once you arrive in Germany, you must open a regular checking account (Girokonto) at a local bank (e.g., Sparkasse, TK, N26). You then provide this local IBAN to your blocked account provider, who will automatically transfer your monthly allowance (EUR 934) to your new checking account every month.',
          align: 'right',
        },
        {
          title: 'Common Mistakes to Avoid',
          text: 'Delaying the account opening can delay your visa. Also, make sure to transfer slightly more than the exact amount to cover intermediary bank fees; otherwise, the account won\'t be fully funded and the confirmation letter won\'t be issued. Always use your application reference number in the transfer remarks.',
        },
      ]}
      faqs={[
        {
          q: 'Is the money in the blocked account safe?',
          a: 'Yes, absolutely. The approved providers operate under strict German federal banking regulations (BaFin). Your money is held in an escrow account securely.',
        },
        {
          q: 'What happens if my visa gets rejected?',
          a: 'If your visa is rejected, your money is completely safe. You need to provide the official visa rejection letter to your provider, and they will refund the full blocked amount back to the original bank account (minus the setup fee and transfer fees).',
        },
        {
          q: 'Can I withdraw more than the monthly limit in an emergency?',
          a: 'No. The German government sets strict rules. You can only access the maximum allowed monthly amount (€992 as of 2026) to ensure the funds last for the entire year.',
        },
        {
          q: 'Do I need to renew the blocked account for my second year?',
          a: 'If you need to extend your residence permit and haven\'t found a part-time job or other means of financial proof, the local Foreigners\' Office (Ausländerbehörde) may ask you to show a new blocked account for the subsequent year.',
        }
      ]}
    />
  );
}
