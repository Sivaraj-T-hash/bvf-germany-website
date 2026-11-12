import ServiceDetailPage from '@/components/ServiceDetailPage';

export default function StudyLoanGermanyPage() {
  return (
    <ServiceDetailPage
      title="Study Abroad Education Loan"
      subtitle="Comprehensive education loans tailored for studying in Germany. Access high loan amounts with low interest rates and zero collateral options."
      ctaLabel="Book Free Loan Consultation"
      ctaTo="/contact"
      introTitle="Why Apply for an Education Loan?"
      introText="Studying abroad is a major financial commitment. Instead of depleting your family's savings, an education loan allows you to cover 100% of your academic and living expenses. For Germany specifically, a loan helps you fund the mandatory Blocked Account upfront and also brings substantial tax benefits under Section 80E (for Indian students). We partner with top banks and NBFCs to provide fast, hassle-free approvals, often before your university admission is fully confirmed."
      features={[
        {
          title: 'Unsecured Loans Available',
          text: 'Get up to EUR 50,000 (approx. INR 45 Lakhs) without any collateral or property pledge, based solely on academic profile and co-applicant income.',
        },
        {
          title: 'Pre-Admission Sanction',
          text: 'Don\'t wait until the last minute. We can secure a loan sanction letter based on your GRE/IELTS scores and target universities, which helps in the visa process.',
        },
        {
          title: 'Coverage of All Expenses',
          text: 'Our loan partners cover tuition fees, the required Blocked Account amount, travel tickets, laptop purchases, and initial settling-in costs.',
        },
      ]}
      checklistTitle="Our Loan Processing Support"
      checklist={[
        'Profile evaluation & bank shortlisting',
        'Checklist of required financial documents',
        'Negotiation for lower interest rates',
        'Assistance with property valuation (for secured loans)',
        'Fast-track disbursement for Blocked Account funding',
      ]}
      storyBlocks={[
        {
          title: 'Secured vs. Unsecured Loans',
          text: 'Unsecured loans (without collateral) are faster to process but generally have slightly higher interest rates and strict co-applicant income requirements. Secured loans (with collateral like a house or fixed deposit) offer the lowest interest rates, longer repayment tenures, and higher approval chances for large amounts. We will help you choose the best option based on your family\'s financial standing.',
        },
        {
          title: 'Tax Benefits (Section 80E)',
          text: 'If you or your parents are paying the interest on your education loan, that entire interest amount can be claimed as a deduction from taxable income under Section 80E of the Income Tax Act for up to 8 years. This makes taking a loan extremely tax-efficient compared to self-funding.',
          align: 'right',
        },
        {
          title: 'Seamless Blocked Account Integration',
          text: 'One of the biggest hurdles is transferring funds to the German Blocked Account within the short timeframe before the visa appointment. We coordinate directly with your bank to ensure the loan amount is disbursed smoothly into your Expatrio, Fintiba, or Coracle account using the best forex rates.',
        },
      ]}

      banner={{
        title: 'Start Your Loan Process Early',
        subtitle: 'It takes 2-4 weeks to process an education loan. Apply today to avoid visa delays.',
        ctaLabel: 'Book Free Consultation Now',
        ctaTo: '/contact',
      }}
      faqs={[
        {
          q: 'Who can be a co-applicant for an education loan?',
          a: 'Usually, parents, siblings, or spouse. They must have a stable income (salary or business) and a good CIBIL score (credit score).',
        },
        {
          q: 'When should I start the loan application process?',
          a: 'You should ideally start the process 2-3 months before your expected visa appointment or immediately after receiving your first admission letter.',
        },
        {
          q: 'What is the typical interest rate?',
          a: 'Interest rates vary depending on the bank and loan type. Secured loans usually range from 8.5% to 10.5%, while unsecured loans range from 10.5% to 13.5%.',
        },
        {
          q: 'Is there a moratorium period?',
          a: 'Yes, most education loans offer a moratorium period (course duration + 6 months to 1 year). During this time, you usually only pay simple interest or partial interest, and the main EMI starts after you get a job.',
        },
      ]}
    />
  );
}
