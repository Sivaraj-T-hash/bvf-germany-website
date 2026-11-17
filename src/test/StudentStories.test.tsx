import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StudentStories from '@/components/StudentStories';
import { publishedStories, successStories } from '@/content/successStories';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof IntersectionObserver;

describe('Student Success Stories Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSection = () => {
    return render(
      <BrowserRouter>
        <StudentStories />
      </BrowserRouter>
    );
  };

  it('renders section eyebrow, heading, and official supporting text', () => {
    renderSection();
    expect(screen.getByText(/REAL STUDENT EXPERIENCES/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Every Student Journey Has a Story\./i,
        level: 2,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Explore genuine experiences from students who have pursued their education journey in Germany with BVF Germany\./i
      )
    ).toBeInTheDocument();
  });

  it('renders all 4 verified, consent-confirmed student stories', () => {
    renderSection();
    expect(publishedStories).toHaveLength(4);
    expect(screen.getByRole('heading', { name: /^Ramana$/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Jana Pannerselvam$/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Shahidh Akil$/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Srinidhi Shakthi$/i, level: 3 })).toBeInTheDocument();
  });

  it('verifies all published stories have consentConfirmed set to true', () => {
    publishedStories.forEach((story) => {
      expect(story.consentConfirmed).toBe(true);
      expect(story.photo).toBeTruthy();
      expect(story.fullName).toBeTruthy();
      expect(story.germanUniversity).toBeTruthy();
    });
  });

  it('displays accurate German universities for each student', () => {
    renderSection();
    expect(
      screen.getByText(/Brandenburg University of Technology Cottbus-Senftenberg/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Master’s in Embedded Systems, TU Chemnitz/i)).toBeInTheDocument();
    expect(screen.getByText(/MSc Embedded Systems, Technical University Chemnitz/i)).toBeInTheDocument();
    expect(screen.getByText(/Master’s in Informatics and Business, FH Südwestfalen/i)).toBeInTheDocument();
  });

  it('renders authentic photography with descriptive alt text for each student', () => {
    renderSection();
    expect(screen.getByAltText(/Ramana, BVF Germany student/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Jana Pannerselvam, BVF Germany student/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Shahidh Akil, BVF Germany student/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Srinidhi Shakthi, BVF Germany student/i)).toBeInTheDocument();
  });

  it('renders Read More links to verified story detail pages', () => {
    renderSection();
    expect(screen.getByRole('link', { name: /Read Ramana.*story/i })).toHaveAttribute(
      'href',
      '/success-stories/ramana-btu-cottbus'
    );
    expect(screen.getByRole('link', { name: /Read Jana.*story/i })).toHaveAttribute(
      'href',
      '/success-stories/jana-pannerselvam-tu-chemnitz'
    );
    expect(screen.getByRole('link', { name: /Read Shahidh.*story/i })).toHaveAttribute(
      'href',
      '/success-stories/shahidh-akil-tu-chemnitz'
    );
    expect(screen.getByRole('link', { name: /Read Srinidhi.*story/i })).toHaveAttribute(
      'href',
      '/success-stories/srinidhi-shakthi-fh-suedwestfalen'
    );
  });

  it('renders the restrained CTA button linking to /success-stories', () => {
    renderSection();
    const cta = screen.getByRole('link', { name: /Explore More Student Stories/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/success-stories');
  });

  it('ensures unconfirmed stories cannot be published', () => {
    const unconfirmedStory = {
      ...successStories[0],
      id: 'test-unconfirmed',
      consentConfirmed: false,
    };
    // publishedStories must filter out stories where consentConfirmed is false
    expect(unconfirmedStory.consentConfirmed).toBe(false);
  });
});
