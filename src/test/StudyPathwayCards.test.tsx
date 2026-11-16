import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StudyPathwayCards, { pathwayCards } from '@/components/StudyPathwayCards';
import HomePage from '@/pages/Index';

// Mock AuthProvider
vi.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    studentProfileLoading: false,
    adminProfileLoading: false,
    studentApproved: false,
    studentStatus: null,
    isAdmin: false,
    mustChangePassword: false,
    passwordStatusLoading: false,
  }),
}));

// Mock studentStore
vi.mock('@/lib/studentStore', () => ({
  getStudentProfile: vi.fn().mockResolvedValue(null),
}));

// Mock firebase
vi.mock('@/lib/firebase', () => ({
  auth: {},
  db: {},
}));

// Mock use-site-settings
vi.mock('@/hooks/use-site-settings', () => ({
  useSiteSettings: () => ({}),
}));

// Mock siteContentStore
vi.mock('@/lib/siteContentStore', () => ({
  subscribeToSiteSettings: vi.fn((cb) => {
    cb({});
    return vi.fn();
  }),
  getSiteSettings: vi.fn().mockResolvedValue({}),
  getTestimonials: vi.fn().mockResolvedValue([]),
}));

// Mock blogStore
vi.mock('@/lib/blogStore', () => ({
  getBlogPosts: vi.fn().mockResolvedValue([]),
}));

// Mock webinarCatalogStore
vi.mock('@/lib/webinarCatalogStore', () => ({
  getWebinarCatalog: vi.fn().mockResolvedValue([]),
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof IntersectionObserver;

describe('Study Pathway Cards Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPathwaySection = () => {
    return render(
      <BrowserRouter>
        <StudyPathwayCards />
      </BrowserRouter>
    );
  };

  it('renders section eyebrow, heading, and supporting text', () => {
    renderPathwaySection();
    expect(screen.getByText(/EXPLORE YOUR OPTIONS/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Find the Right Pathway to Your Future in Germany\./i,
        level: 2,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Every student's journey is different\. Explore the available education pathways/i
      )
    ).toBeInTheDocument();
  });

  it('renders exactly four pathway cards', () => {
    renderPathwaySection();
    expect(pathwayCards).toHaveLength(4);
    expect(screen.getByRole('heading', { name: /Master's in Germany/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Bachelor's in Germany/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Ausbildung in Germany/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /PhD in Germany/i, level: 3 })).toBeInTheDocument();
  });

  it('verifies Master\'s in Germany card has correct description, CTA, and destination', () => {
    renderPathwaySection();
    expect(
      screen.getByText(
        /Explore postgraduate opportunities at German universities and find programmes aligned with your academic background and career goals\./i
      )
    ).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: /Explore Master's Programmes/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/study-in-germany/ms');
  });

  it('verifies Bachelor\'s in Germany card has correct description, CTA, and destination', () => {
    renderPathwaySection();
    expect(
      screen.getByText(
        /Discover undergraduate study opportunities in Germany and understand the academic requirements and application process\./i
      )
    ).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: /Explore Bachelor's Programmes/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/study-in-germany/bachelor');
  });

  it('verifies Ausbildung in Germany card has correct description, CTA, and destination', () => {
    renderPathwaySection();
    expect(
      screen.getByText(
        /Learn about Germany's vocational training pathway, combining practical workplace experience with structured professional education\./i
      )
    ).toBeInTheDocument();
    const cta = screen.getByRole('link', { name: /Explore Ausbildung/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/study-in-germany/ausbildung');
  });

  it('verifies PhD in Germany card is clearly marked Coming Soon and is NOT a clickable link', () => {
    renderPathwaySection();
    expect(
      screen.getByText(
        /Explore doctoral research opportunities, academic pathways and the steps involved in pursuing a PhD in Germany\./i
      )
    ).toBeInTheDocument();

    // Check for Coming Soon badge and button
    const comingSoonElements = screen.getAllByText(/Coming Soon/i);
    expect(comingSoonElements.length).toBeGreaterThanOrEqual(1);

    // Verify PhD card has NO link
    const links = screen.getAllByRole('link');
    const phdLink = links.find(
      (link) => link.getAttribute('href')?.includes('/phd') || link.textContent?.includes('PhD')
    );
    expect(phdLink).toBeUndefined();
  });
});

describe('Founder Section Heading Contrast', () => {
  beforeEach(() => {
    window.sessionStorage.setItem('bvf_welcome_popup_seen', 'true');
  });

  it('renders the founder vision heading with text-white high contrast class', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    const founderHeading = screen.getByRole('heading', {
      name: /The Vision Behind BVF Germany/i,
      level: 2,
    });
    expect(founderHeading).toBeInTheDocument();
    expect(founderHeading).toHaveClass('text-white');
  });
});
