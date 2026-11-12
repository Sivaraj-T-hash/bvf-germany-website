import ServiceDetailPage from '@/components/ServiceDetailPage';

export default function StudyLoanGermanyPage() {
  return (
    <ServiceDetailPage
      title="Study Abroad Education Loan"
      subtitle="Affordable, structured education loans so you can focus on your Germany dream."
      ctaLabel="Apply Now"
      ctaTo="/contact"
      introTitle="Loan Guidance That Removes the Stress"
      introText="BVF Germany helps you secure education loans with minimal hassle. You can apply before admission confirmation and access competitive rates from trusted lenders. Our team supports you through eligibility, documentation, and disbursement so you can focus on your studies."
      features={[
        {
          title: 'Personalized Guidance',
          text: 'Loan planning based on program, university, and total cost.',
        },
        {
          title: 'Admission Guidance',
          text: 'We align the loan process with your admission timeline.',
        },
        {
          title: 'Post-Admission Support',
          text: 'Disbursement coordination, forex guidance, and travel prep.',
        },
      ]}
      checklistTitle="Why Education Loans Make Sense"
      checklist={[
        'Income tax benefits under Section 80E',
        'Preserve family savings for emergencies',
        'Build a strong credit history early',
        'Loans that can cover tuition and living costs (limits depend on the lender)',
        'Loan sanction even before admission confirmation',
      ]}
      storyBlocks={[
        {
          title: 'Our Funding Advantage',
          text:
            'We help students understand their education-loan options for studying in Germany. With quick approvals and multiple partner options, you can choose a plan that fits your goals and budget.',
        },
        {
          title: 'Common Questions We Handle',
          text:
            'We answer funding questions around eligibility, co‑borrower requirements, repayment tenures, and loan disbursement timelines. Our experts simplify the process and ensure zero hidden charges.',
          align: 'right',
        },
        {
          title: 'Loan to Visa Alignment',
          text:
            'We align your loan approval timeline with blocked account and visa documentation so there are no delays in the final visa appointment.',
        },
      ]}
      logoSection={{
        title: 'Top Study Abroad Education Loan Providers',
        logos: [
          'https://upload.wikimedia.org/wikipedia/commons/9/9f/Axis_Bank_logo.svg',
          'https://upload.wikimedia.org/wikipedia/en/9/9e/HDFC_Credila_logo.svg',
          'https://upload.wikimedia.org/wikipedia/commons/4/4c/SBI_Logo.svg',
          'https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg',
          'https://upload.wikimedia.org/wikipedia/en/2/23/Bank_of_Maharashtra_logo.svg',
          'https://upload.wikimedia.org/wikipedia/en/1/1d/Canara_Bank_Logo.svg',
          'https://upload.wikimedia.org/wikipedia/en/4/42/InCred_Logo.png',
          'https://upload.wikimedia.org/wikipedia/en/3/3a/Bank_of_Baroda_logo.svg',
        ],
        ctaLabel: 'Request a Call',
        ctaTo: '/contact',
      }}
      banner={{
        title: 'Ready to Apply for Funding',
        subtitle: 'Your gateway for education in Germany with flexible repayment options.',
        ctaLabel: 'Start My Application',
        ctaTo: '/contact',
      }}
      faqs={[
        {
          q: 'What is the best way to finance higher education?',
          a: 'Most students use a mix of savings and education loans to keep finances stable and preserve family savings.',
        },
        {
          q: 'Who should opt for an education loan and why?',
          a: 'Students who want structured repayments, tax benefits, and a clear funding plan should consider loans.',
        },
        {
          q: 'Can I get a loan before admission confirmation?',
          a: 'Yes. Many providers offer preliminary approval before final admission.',
        },
      ]}
    />
  );
}
