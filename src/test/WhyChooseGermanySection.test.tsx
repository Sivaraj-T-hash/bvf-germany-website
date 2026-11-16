import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WhyChooseGermanySection, { germanyBenefits } from '@/components/WhyChooseGermanySection';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof IntersectionObserver;

describe('Why Choose Germany Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSection = () => {
    return render(
      <BrowserRouter>
        <WhyChooseGermanySection />
      </BrowserRouter>
    );
  };

  it('renders section eyebrow, heading, and official supporting paragraph', () => {
    renderSection();
    expect(screen.getByText(/WHY CHOOSE GERMANY/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /A World of Opportunities, Built Around Your Future\./i,
        level: 2,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Germany combines internationally recognised education, research opportunities and practical career pathways\. Discover what makes it an attractive destination for students from around the world\./i
      )
    ).toBeInTheDocument();
  });

  it('renders all four benefit blocks with exact titles', () => {
    renderSection();
    expect(germanyBenefits).toHaveLength(4);
    expect(screen.getByRole('heading', { name: /^Recognised Education$/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Public University Opportunities$/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Practical Learning and Research$/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Career Opportunities$/i, level: 3 })).toBeInTheDocument();
  });

  it('renders Benefit 1 – Recognised Education with official text', () => {
    renderSection();
    expect(
      screen.getByText(
        /Explore a wide range of academic programmes and internationally recognised qualifications at German higher education institutions\./i
      )
    ).toBeInTheDocument();
  });

  it('renders Benefit 2 – Public University Opportunities with official text', () => {
    renderSection();
    expect(
      screen.getByText(
        /Understand the opportunities available at public universities and the tuition and semester contribution differences between institutions and federal states\./i
      )
    ).toBeInTheDocument();
  });

  it('renders Benefit 3 – Practical Learning and Research with official text', () => {
    renderSection();
    expect(
      screen.getByText(
        /Discover research-focused education, industry connections and opportunities to gain practical experience\./i
      )
    ).toBeInTheDocument();
  });

  it('renders Benefit 4 – Career Opportunities with official text', () => {
    renderSection();
    expect(
      screen.getByText(
        /Learn about the employment and post-study pathways available to eligible international graduates\./i
      )
    ).toBeInTheDocument();
  });

  it('renders authentic campus image with descriptive alt text', () => {
    renderSection();
    const campusImg = screen.getByAltText(
      /Historic and modern university campus architecture in Germany/i
    );
    expect(campusImg).toBeInTheDocument();
  });

  it('renders CTA button linking to tools page', () => {
    renderSection();
    const cta = screen.getByRole('link', { name: /Is a German Public University Right for Me\?/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/tools');
  });

  it('renders the factual disclaimer explaining variation by federal state and institution', () => {
    renderSection();
    expect(
      screen.getByText(
        /\*Tuition and semester contribution policies vary by federal state.*and individual higher education institution\./i
      )
    ).toBeInTheDocument();
  });
});
