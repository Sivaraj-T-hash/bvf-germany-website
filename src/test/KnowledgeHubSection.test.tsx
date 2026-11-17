import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import KnowledgeHubSection, { knowledgeCategories } from '@/components/KnowledgeHubSection';
import type { BlogPost } from '@/lib/blogStore';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof IntersectionObserver;

const mockPosts: BlogPost[] = [
  {
    id: 'study-in-germany-free-2026',
    title: 'How to Study in Germany for Free in 2026',
    slug: 'how-to-study-in-germany-for-free-2026',
    excerpt: 'A practical step-by-step guide for Indian students targeting tuition-free public universities in Germany.',
    category: 'Admissions',
    tags: ['Germany admissions', 'Public universities'],
    keywords: ['study in germany'],
    featuredImage: '',
    authorName: 'Bratlin',
    authorRole: 'Founder, BVF Germany',
    authorImage: '',
    authorBio: 'Founder bio',
    readTime: '8 min read',
    popularity: 95,
    featured: true,
    published: true,
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z',
    content: '## Guide Content',
  },
  {
    id: 'aps-certificate-germany-full-guide',
    title: 'APS Certificate Germany: Full Guide for Indian Students',
    slug: 'aps-certificate-germany-full-guide',
    excerpt: 'Understand what APS is, why it matters, and how Indian students should prepare without avoidable delays.',
    category: 'Visa',
    tags: ['APS', 'Visa'],
    keywords: ['aps certificate germany'],
    featuredImage: '',
    authorName: 'Bratlin',
    authorRole: 'Founder, BVF Germany',
    authorImage: '',
    authorBio: 'Founder bio',
    readTime: '7 min read',
    popularity: 90,
    featured: false,
    published: true,
    createdAt: '2026-03-16T10:00:00Z',
    updatedAt: '2026-03-16T10:00:00Z',
    content: '## APS Content',
  },
  {
    id: 'ielts-requirement-for-germany',
    title: 'IELTS Requirement for Germany Universities',
    slug: 'ielts-requirement-for-germany',
    excerpt: 'What score is usually safe, when IELTS matters most, and how it affects your shortlist quality.',
    category: 'SOP & IELTS',
    tags: ['IELTS'],
    keywords: ['ielts requirement'],
    featuredImage: '',
    authorName: 'Bratlin',
    authorRole: 'Founder, BVF Germany',
    authorImage: '',
    authorBio: 'Founder bio',
    readTime: '6 min read',
    popularity: 76,
    featured: false,
    published: true,
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-03-12T10:00:00Z',
    content: '## IELTS Content',
  },
];

describe('BVF Knowledge Hub Section', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSection = (posts = mockPosts) => {
    return render(
      <BrowserRouter>
        <KnowledgeHubSection posts={posts} />
      </BrowserRouter>
    );
  };

  it('renders section eyebrow, main heading, and official supporting text', () => {
    renderSection();
    expect(screen.getByText('THE BVF KNOWLEDGE HUB')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Make Informed Decisions About Your Future in Germany\./i,
        level: 2,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Explore practical guides, useful insights and important information to help you navigate your education journey in Germany\./i
      )
    ).toBeInTheDocument();
  });

  it('renders all curated knowledge topic tags linking to /blog', () => {
    renderSection();
    expect(knowledgeCategories).toHaveLength(6);
    knowledgeCategories.forEach((cat) => {
      const tag = screen.getByRole('link', { name: cat });
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveAttribute('href', '/blog');
    });
  });

  it('renders up to three published guide articles with verified categories and excerpts', () => {
    renderSection();
    expect(
      screen.getByRole('heading', { name: /How to Study in Germany for Free in 2026/i, level: 3 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /APS Certificate Germany: Full Guide for Indian Students/i, level: 3 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /IELTS Requirement for Germany Universities/i, level: 3 })
    ).toBeInTheDocument();

    expect(screen.getByText('Admissions')).toBeInTheDocument();
    expect(screen.getByText('Visa')).toBeInTheDocument();
    expect(screen.getByText('SOP & IELTS')).toBeInTheDocument();

    expect(
      screen.getByText(/A practical step-by-step guide for Indian students targeting tuition-free public universities in Germany\./i)
    ).toBeInTheDocument();
  });

  it('renders correct navigation links for each article card pointing to /blog/:slug', () => {
    renderSection();
    const readGuideLinks = screen.getAllByRole('link', { name: /Read Guide/i });
    expect(readGuideLinks).toHaveLength(3);
    expect(readGuideLinks[0]).toHaveAttribute('href', '/blog/how-to-study-in-germany-for-free-2026');
    expect(readGuideLinks[1]).toHaveAttribute('href', '/blog/aps-certificate-germany-full-guide');
    expect(readGuideLinks[2]).toHaveAttribute('href', '/blog/ielts-requirement-for-germany');
  });

  it('renders the restrained CTA button linking to /blog', () => {
    renderSection();
    const cta = screen.getByRole('link', { name: /Explore All Resources/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute('href', '/blog');
  });
});
