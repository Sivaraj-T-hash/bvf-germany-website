import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StudentJourneySection, { journeyStages } from '@/components/StudentJourneySection';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof IntersectionObserver;

describe('Student Guidance Journey Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSection = () => {
    return render(
      <BrowserRouter>
        <StudentJourneySection />
      </BrowserRouter>
    );
  };

  it('renders section eyebrow, heading, and official supporting copy', () => {
    renderSection();
    expect(screen.getByText(/HOW WE GUIDE YOU/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Your Journey to Germany, Step by Step\./i,
        level: 2,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /From your first profile evaluation to preparing for your new life in Germany, understand the key stages of your journey with BVF Germany\./i
      )
    ).toBeInTheDocument();
  });

  it('renders exactly six journey stages', () => {
    renderSection();
    expect(journeyStages).toHaveLength(6);
    expect(screen.getByText(/Stage 01/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage 02/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage 03/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage 04/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage 05/i)).toBeInTheDocument();
    expect(screen.getByText(/Stage 06/i)).toBeInTheDocument();
  });

  it('renders Stage 01 – Profile Evaluation with verified copy', () => {
    renderSection();
    expect(screen.getByRole('heading', { name: /^Profile Evaluation$/i, level: 3 })).toBeInTheDocument();
    expect(
      screen.getByText(/Understand the student's academic background, interests and future goals\./i)
    ).toBeInTheDocument();
  });

  it('renders Stage 02 – University & Programme Shortlisting with verified copy and route', () => {
    renderSection();
    expect(screen.getByRole('heading', { name: /^University & Programme Shortlisting$/i, level: 3 })).toBeInTheDocument();
    expect(
      screen.getByText(/Explore suitable universities and programmes based on the student's profile and preferences\./i)
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Explore Shortlisting/i });
    expect(link).toHaveAttribute('href', '/services/university-shortlist');
  });

  it('renders Stage 03 – Application Preparation with verified copy and route', () => {
    renderSection();
    expect(screen.getByRole('heading', { name: /^Application Preparation$/i, level: 3 })).toBeInTheDocument();
    expect(
      screen.getByText(/Guide students through application requirements, documentation and submission procedures\./i)
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Application Support/i });
    expect(link).toHaveAttribute('href', '/services/university-application');
  });

  it('renders Stage 04 – Admission & APS Guidance with verified copy and route', () => {
    renderSection();
    expect(screen.getByRole('heading', { name: /^Admission & APS Guidance$/i, level: 3 })).toBeInTheDocument();
    expect(
      screen.getByText(/Provide relevant support with admission-related steps and APS procedures where applicable\./i)
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /APS Procedures/i });
    expect(link).toHaveAttribute('href', '/services/aps-application');
  });

  it('renders Stage 05 – Visa & Pre-Departure Preparation with verified copy and route', () => {
    renderSection();
    expect(screen.getByRole('heading', { name: /^Visa & Pre-Departure Preparation$/i, level: 3 })).toBeInTheDocument();
    expect(
      screen.getByText(/Guide students through visa documentation, preparation and important arrangements before departure\./i)
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Visa Guidance/i });
    expect(link).toHaveAttribute('href', '/services/visa-guidance');
  });

  it('renders Stage 06 – Preparing for Life in Germany with verified copy and route', () => {
    renderSection();
    expect(screen.getByRole('heading', { name: /^Preparing for Life in Germany$/i, level: 3 })).toBeInTheDocument();
    expect(
      screen.getByText(/Help students understand the next steps involved in preparing for their studies and settling into life in Germany, within BVF's actual service scope\./i)
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /On-Arrival Support/i });
    expect(link).toHaveAttribute('href', '/services/on-arrival-support');
  });

  it('renders the bottom CTA with correct title and Free Profile Evaluation destination', () => {
    renderSection();
    expect(screen.getByText(/Every journey starts with the right direction\./i)).toBeInTheDocument();
    const ctaButton = screen.getByRole('link', { name: /Get Your Free Profile Evaluation/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '#profile-evaluation');
  });

  it('renders the legal disclaimer disclaiming guaranteed outcomes', () => {
    renderSection();
    expect(
      screen.getByText(/\*BVF Germany provides structured guidance through verified university entry requirements/i)
    ).toBeInTheDocument();
  });
});
