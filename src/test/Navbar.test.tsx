import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '@/components/Navbar';

// Mock the Auth provider to test unauthenticated state
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

// Mock the studentStore
vi.mock('@/lib/studentStore', () => ({
  getStudentProfile: vi.fn().mockResolvedValue(null),
}));

// Mock firebase auth
vi.mock('@/lib/firebase', () => ({
  auth: {},
}));

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the brand logo and title correctly', () => {
    renderNavbar();
    expect(screen.getByText('BVF Germany')).toBeInTheDocument();
    expect(screen.getByText('Public University Experts')).toBeInTheDocument();
  });

  it('renders all primary target navigation items', () => {
    renderNavbar();
    // Desktop navigation items
    expect(screen.getByRole('link', { name: /^Home$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Study Pathways menu/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Services menu/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Student Stories/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Resources menu/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^About$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Contact$/i })).toBeInTheDocument();
  });

  it('renders the prominent Free Profile Evaluation primary CTA', () => {
    renderNavbar();
    const evaluationCtas = screen.getAllByRole('link', { name: /Free Profile Evaluation/i });
    expect(evaluationCtas.length).toBeGreaterThanOrEqual(1);
    expect(evaluationCtas[0]).toHaveAttribute('href', '/#profile-evaluation');
  });

  it('renders the student login link for unauthenticated visitors', () => {
    renderNavbar();
    const loginLinks = screen.getAllByRole('link', { name: /Student.*Login/i });
    expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    expect(loginLinks[0]).toHaveAttribute('href', '/login');
  });

  it('toggles the Study Pathways dropdown on button click', () => {
    renderNavbar();
    const pathwaysBtn = screen.getByRole('button', { name: /Study Pathways menu/i });
    expect(pathwaysBtn).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(pathwaysBtn);
    expect(pathwaysBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: /Master's in Germany/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Bachelor's in Germany/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Ausbildung in Germany/i })).toBeInTheDocument();

    // Click to close
    fireEvent.click(pathwaysBtn);
    expect(pathwaysBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles the Services dropdown on button click', () => {
    renderNavbar();
    const servicesBtn = screen.getByRole('button', { name: /Services menu/i });
    expect(servicesBtn).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(servicesBtn);
    expect(servicesBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: /University Shortlisting/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /APS Application Support/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Visa Guidance/i })).toBeInTheDocument();
  });

  it('toggles the mobile drawer when clicking the mobile menu toggle button', () => {
    renderNavbar();
    const toggleBtn = screen.getByRole('button', { name: /Open navigation menu/i });
    expect(toggleBtn).toBeInTheDocument();

    // Click to open
    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /Close navigation menu/i })).toBeInTheDocument();

    // Verify mobile accordion buttons exist
    expect(screen.getByRole('button', { name: /Toggle Study Pathways section/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Toggle Services section/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Toggle Resources section/i })).toBeInTheDocument();

    // Click close
    const closeBtn = screen.getByRole('button', { name: /Close navigation menu/i });
    fireEvent.click(closeBtn);
    expect(screen.getByRole('button', { name: /Open navigation menu/i })).toBeInTheDocument();
  });

  it('closes open dropdowns and menus on Escape key press', () => {
    renderNavbar();
    const pathwaysBtn = screen.getByRole('button', { name: /Study Pathways menu/i });
    fireEvent.click(pathwaysBtn);
    expect(pathwaysBtn).toHaveAttribute('aria-expanded', 'true');

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(pathwaysBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders student avatar and account dropdown when user is authenticated', async () => {
    const authModule = await import('@/components/AuthProvider');
    vi.spyOn(authModule, 'useAuth').mockReturnValue({
      user: { uid: 'student-123', email: 'student@example.com' } as unknown as import('firebase/auth').User,
      loading: false,
      studentProfileLoading: false,
      adminProfileLoading: false,
      studentApproved: true,
      studentStatus: 'approved',
      isAdmin: false,
      mustChangePassword: false,
      passwordStatusLoading: false,
    });

    renderNavbar();
    const accountBtn = screen.getByRole('button', { name: /Open student account menu/i });
    expect(accountBtn).toBeInTheDocument();

    // Open account dropdown
    fireEvent.click(accountBtn);
    expect(screen.getByText('Student Portal')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /My Dashboard/i })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('menuitem', { name: /Log Out/i })).toBeInTheDocument();
  });
});
