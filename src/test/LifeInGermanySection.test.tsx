import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LifeInGermanySection, { lifeInGermanyAspects } from '@/components/LifeInGermanySection';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof IntersectionObserver;

describe('Life in Germany Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSection = () => {
    return render(
      <BrowserRouter>
        <LifeInGermanySection />
      </BrowserRouter>
    );
  };

  it('renders section eyebrow, heading, and official supporting text', () => {
    renderSection();
    expect(screen.getByText('BEYOND THE CLASSROOM')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /More Than a Degree\. A New Life in Germany\./i,
        level: 2,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Studying in Germany is also about discovering a new culture, building independence and creating meaningful experiences beyond the classroom\./i
      )
    ).toBeInTheDocument();
  });

  it('renders exactly four editorial aspects', () => {
    renderSection();
    expect(lifeInGermanyAspects).toHaveLength(4);
    expect(screen.getByRole('heading', { name: /Student Life/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Everyday Living/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Culture & Exploration/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Career & Growth/i, level: 3 })).toBeInTheDocument();
  });

  it('verifies Student Life aspect details, highlights, and link', () => {
    renderSection();
    expect(
      screen.getByText(
        /Campus experiences, student communities and university activities\./i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Active Student Unions \(AStA\) & clubs/i)).toBeInTheDocument();
    expect(screen.getByText(/Multicultural, welcoming campus networks/i)).toBeInTheDocument();
    expect(screen.getByText(/Modern research libraries & study centres/i)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Explore Student Life in Germany/i });
    expect(link).toHaveAttribute('href', '/about-germany');
  });

  it('verifies Everyday Living aspect details, highlights, and link', () => {
    renderSection();
    expect(
      screen.getByText(
        /Public transportation, accommodation and daily essentials\./i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Subsidised Semesterticket for public transit/i)).toBeInTheDocument();
    expect(screen.getByText(/Affordable student dormitories & shared flats/i)).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive student health coverage/i)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Learn About On-Ground Essentials/i });
    expect(link).toHaveAttribute('href', '/services/germany');
  });

  it('verifies Culture & Exploration aspect details, highlights, and link', () => {
    renderSection();
    expect(
      screen.getByText(
        /German cities, historic places and cultural experiences\./i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Central Europe location with Schengen travel access/i)).toBeInTheDocument();
    expect(screen.getByText(/Historic landmarks, arts, museums & seasonal markets/i)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Discover German Culture/i });
    expect(link).toHaveAttribute('href', '/about-germany');
  });

  it('verifies Career & Growth aspect details, highlights, and link', () => {
    renderSection();
    expect(
      screen.getByText(
        /Opportunities to develop skills, gain practical experience and prepare for the future\./i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/140 full days \/ 280 half days part-time work allowance/i)).toBeInTheDocument();
    expect(screen.getByText(/Paid Werkstudent roles in leading industries/i)).toBeInTheDocument();
    expect(screen.getByText(/18-month post-study job seeker visa/i)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Explore Career Opportunities/i });
    expect(link).toHaveAttribute('href', '/services/germany');
  });

  it('renders descriptive alt text for all four aspect visuals', () => {
    renderSection();
    expect(
      screen.getByAltText(/Diverse international university students collaborating on campus in Germany/i)
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/Young people and students enjoying public urban spaces in Germany/i)
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/The historic Brandenburg Gate at sunset in Berlin, Germany/i)
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/Focused student developing technical and professional skills in a modern study environment/i)
    ).toBeInTheDocument();
  });

  it('renders the bottom life guide CTA linking to /about-germany', () => {
    renderSection();
    const guideCta = screen.getByRole('link', { name: /Read Life in Germany Guide/i });
    expect(guideCta).toBeInTheDocument();
    expect(guideCta).toHaveAttribute('href', '/about-germany');
  });
});
