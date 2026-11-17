import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomepageFaqSection, { homepageFaqs } from '@/components/HomepageFaqSection';
import PricingTeaserSection from '@/components/PricingTeaserSection';
import ProfileEvaluationForm from '@/components/ProfileEvaluationForm';
import Footer from '@/components/Footer';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof IntersectionObserver;

describe('Homepage FAQ Section', () => {
  const renderFaqs = () =>
    render(
      <BrowserRouter>
        <HomepageFaqSection />
      </BrowserRouter>
    );

  it('renders section eyebrow, main heading, and official supporting text', () => {
    renderFaqs();
    expect(screen.getByText(/FREQUENTLY ASKED QUESTIONS/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Clear Answers for Your Journey to Germany\./i,
        level: 2,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Practical, straightforward answers to help you understand public university admissions, APS verification, costs, timelines, and how BVF guides you\./i
      )
    ).toBeInTheDocument();
  });

  it('renders all six curated FAQ questions', () => {
    renderFaqs();
    expect(homepageFaqs).toHaveLength(6);
    for (const faq of homepageFaqs) {
      expect(screen.getByText(faq.question)).toBeInTheDocument();
    }
  });

  it('toggles accordion items when clicked with accessible aria attributes', () => {
    renderFaqs();
    const firstQuestionBtn = screen.getByRole('button', {
      name: new RegExp(homepageFaqs[0].question, 'i'),
    });
    expect(firstQuestionBtn).toHaveAttribute('aria-expanded', 'true');

    // Click second question
    const secondQuestionBtn = screen.getByRole('button', {
      name: new RegExp(homepageFaqs[1].question, 'i'),
    });
    expect(secondQuestionBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(secondQuestionBtn);
    expect(secondQuestionBtn).toHaveAttribute('aria-expanded', 'true');
    expect(firstQuestionBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders official statutory note and link to full /faqs route', () => {
    renderFaqs();
    expect(
      screen.getByText(
        /Official visa requirements, blocked account minimums, and university deadlines are established by German authorities\./i
      )
    ).toBeInTheDocument();
    const allFaqsLink = screen.getByRole('link', { name: /Explore all FAQs/i });
    expect(allFaqsLink).toBeInTheDocument();
    expect(allFaqsLink).toHaveAttribute('href', '/faqs');
  });
});

describe('Pricing Teaser Section', () => {
  const renderPricing = () =>
    render(
      <BrowserRouter>
        <PricingTeaserSection />
      </BrowserRouter>
    );

  it('renders section eyebrow, heading, and supporting copy', () => {
    renderPricing();
    expect(screen.getByText(/TRANSPARENT, HONEST PRICING/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /One Complete Package Covers Your Entire Journey\./i,
        level: 2,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /You pay in two clear parts, and the second installment is due only after you receive your official university admission offer letter\./i
      )
    ).toBeInTheDocument();
  });

  it('renders the approved package price and two-part breakdown', () => {
    renderPricing();
    expect(screen.getByText('₹59,999')).toBeInTheDocument();
    expect(screen.getByText('₹29,999')).toBeInTheDocument();
    expect(screen.getByText('₹30,000')).toBeInTheDocument();
    expect(screen.getByText(/When you finalise your courses/i)).toBeInTheDocument();
    expect(screen.getByText(/After you receive your offer letter/i)).toBeInTheDocument();
  });

  it('displays the official fees distinction disclaimer', () => {
    renderPricing();
    expect(
      screen.getByText(/Official Fees Distinction:/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/APS certificate verification fees \(₹18,000\), university semester contributions/i)
    ).toBeInTheDocument();
  });

  it('renders CTAs for booking consultation and exploring full pricing', () => {
    renderPricing();
    const bookCta = screen.getByRole('link', { name: /Book Free Consultation/i });
    expect(bookCta).toHaveAttribute('href', '/bookings');
    const pricingCta = screen.getByRole('link', { name: /View Full Pricing & Inclusions/i });
    expect(pricingCta).toHaveAttribute('href', '/pricing');
  });
});

describe('Profile Evaluation Form Refinement', () => {
  const renderForm = () =>
    render(
      <BrowserRouter>
        <ProfileEvaluationForm sourcePage="/" />
      </BrowserRouter>
    );

  it('renders accessible input labels and placeholders', () => {
    renderForm();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Rahul Sharma/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name@example\.com/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/WhatsApp Number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. \+91 98765 43210/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Program/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Education/i)).toBeInTheDocument();
  });

  it('renders the primary CTA button with exact label', () => {
    renderForm();
    const submitBtn = screen.getByRole('button', { name: /Get Free Profile Evaluation/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it('renders privacy and confidentiality reassurance microcopy', () => {
    renderForm();
    expect(
      screen.getByText(/Your profile details remain strictly private\. No spam, no sales pressure\./i)
    ).toBeInTheDocument();
  });
});

describe('Footer Refinement', () => {
  it('renders the FAQs link in the navigation menu', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    const faqLink = screen.getByRole('link', { name: /^FAQs$/i });
    expect(faqLink).toBeInTheDocument();
    expect(faqLink).toHaveAttribute('href', '/faqs');
  });
});
