import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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

// Mock IntersectionObserver for Framer Motion viewport triggers in JSDOM
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof IntersectionObserver;

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe('Homepage Hero Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.setItem('bvf_welcome_popup_seen', 'true');
  });

  it('renders the uppercase journey eyebrow', () => {
    renderHomePage();
    expect(screen.getByText(/YOUR JOURNEY TO GERMANY STARTS HERE/i)).toBeInTheDocument();
  });

  it('renders the exact editorial main heading', () => {
    renderHomePage();
    const heading = screen.getByRole('heading', {
      name: /Your Future in Germany Starts With the Right Guidance\./i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders the official supporting paragraph', () => {
    renderHomePage();
    expect(
      screen.getByText(
        /From choosing the right university and navigating applications to preparing for life in Germany, BVF Germany supports you through every step of your study-abroad journey\./i
      )
    ).toBeInTheDocument();
  });

  it('renders the primary CTA with smooth evaluation scrolling', () => {
    renderHomePage();
    const ctas = screen.getAllByRole('link', { name: /^Free Profile Evaluation$/i });
    expect(ctas.length).toBeGreaterThanOrEqual(1);

    const heroCta = ctas.find((el) => el.getAttribute('href') === '/#profile-evaluation');
    expect(heroCta).toBeDefined();

    // Mock document.getElementById
    const mockScrollIntoView = vi.fn();
    const mockElement = document.createElement('div');
    mockElement.scrollIntoView = mockScrollIntoView;
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    if (heroCta) {
      fireEvent.click(heroCta);
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    }
  });

  it('renders the secondary CTA linking to Study in Germany overview', () => {
    renderHomePage();
    const pathwaysCta = screen.getByRole('link', { name: /^Explore Study Pathways$/i });
    expect(pathwaysCta).toBeInTheDocument();
    expect(pathwaysCta).toHaveAttribute('href', '/study-in-germany');
  });

  it('renders the subtle trust message', () => {
    renderHomePage();
    expect(
      screen.getByText(/Personal guidance\. Clear direction\. Support at every step\./i)
    ).toBeInTheDocument();
  });

  it('renders authentic university student photography with descriptive alt text and public universities badge', () => {
    renderHomePage();
    const studentImg = screen.getByAltText(
      /University students collaborating in an authentic academic environment/i
    );
    expect(studentImg).toBeInTheDocument();
    expect(screen.getAllByText(/German Public Universities/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Explore World-Class Degree Programs/i)).toBeInTheDocument();
  });
});
