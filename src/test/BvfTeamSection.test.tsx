import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BvfTeamSection, { verifiedLeaders } from '@/components/BvfTeamSection';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof IntersectionObserver;

describe('BVF Germany Team Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSection = () => {
    return render(
      <BrowserRouter>
        <BvfTeamSection />
      </BrowserRouter>
    );
  };

  it('renders section eyebrow, main heading, and official supporting text', () => {
    renderSection();
    expect(screen.getByText('THE PEOPLE BEHIND BVF')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Guidance Built on People, Experience and Purpose\./i,
        level: 2,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Behind every student journey is a team committed to helping students make informed decisions about their future in Germany\./i
      )
    ).toBeInTheDocument();
  });

  it('renders the featured Founder vision spotlight with high-contrast heading', () => {
    renderSection();
    expect(screen.getByText(/FOUNDED BY SOMEONE WHO HAS DONE IT/i)).toBeInTheDocument();
    const founderHeading = screen.getByRole('heading', {
      name: /The Vision Behind BVF Germany/i,
      level: 2,
    });
    expect(founderHeading).toBeInTheDocument();
    expect(founderHeading).toHaveClass('text-white');
    expect(
      screen.getByText(/Space Engineering, Univ\. of Bremen/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Meet the people behind BVF/i })
    ).toHaveAttribute('href', '/about');
  });

  it('renders exactly two verified leadership profiles', () => {
    renderSection();
    expect(verifiedLeaders).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'Bratlin', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Srinivasan Sivakumar', level: 3 })).toBeInTheDocument();
  });

  it('displays accurate German universities for both mentors', () => {
    renderSection();
    expect(screen.getAllByText(/University of Bremen/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Technical University of Berlin \(TU Berlin\)/i).length).toBeGreaterThan(0);
  });

  it('renders authentic portraits with descriptive alt text for each leader', () => {
    renderSection();
    expect(
      screen.getByAltText(/Bratlin, founder of BVF Germany/i)
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/Bratlin, Founder & Lead Mentor at BVF Germany/i)
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/Srinivasan Sivakumar, Operational Head at BVF Germany/i)
    ).toBeInTheDocument();
  });

  it('verifies documented expertise points for each mentor', () => {
    renderSection();
    expect(screen.getByText(/German Public University Admissions/i)).toBeInTheDocument();
    expect(screen.getByText(/APS Verification & Visa Navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/TU Berlin Academic Network & Mentorship/i)).toBeInTheDocument();
    expect(screen.getByText(/On-Ground Student Support & Guidance Systems/i)).toBeInTheDocument();
  });

  it('renders valid profile links pointing to the About page', () => {
    renderSection();
    const bratlinLink = screen.getByRole('link', { name: /Read Bratlin's Journey at BVF Germany/i });
    expect(bratlinLink).toHaveAttribute('href', '/about');

    const srinivasanLink = screen.getByRole('link', { name: /Read Srinivasan's Profile at BVF Germany/i });
    expect(srinivasanLink).toHaveAttribute('href', '/about');
  });

  it('renders the bottom commitment trust note and values link', () => {
    renderSection();
    expect(
      screen.getByText(/We don't make unrealistic guarantees or sell admission promises\./i)
    ).toBeInTheDocument();
    const valuesLink = screen.getByRole('link', { name: /Explore our complete story and values/i });
    expect(valuesLink).toHaveAttribute('href', '/about');
  });
});
