import { db } from '@/lib/firebase';
import { get, onValue, ref, remove, set } from 'firebase/database';
import { DB_PATHS } from '@/lib/dbPaths';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  keywords: string[];
  featuredImage: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
  authorBio: string;
  readTime: string;
  popularity: number;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const defaultPosts: BlogPost[] = [
  {
    id: 'study-in-germany-free-2026',
    title: 'How to Study in Germany for Free in 2026',
    slug: 'how-to-study-in-germany-for-free-2026',
    excerpt: 'A practical step-by-step guide for Indian students targeting tuition-free public universities in Germany.',
    category: 'Admissions',
    tags: ['Germany admissions', 'Public universities', 'Indian students'],
    keywords: ['study in germany for indian students', 'free education in germany', 'public universities germany'],
    featuredImage: '',
    authorName: 'Bratlin',
    authorRole: 'Founder, BVF Germany',
    authorImage: '',
    authorBio: 'Bratlin helps Indian students navigate the public-university path to Germany with practical, profile-based guidance.',
    readTime: '8 min read',
    popularity: 95,
    featured: true,
    published: true,
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-03-20T10:00:00Z',
    content: `## Introduction

Planning to study in Germany but do not know where to start? This guide walks you through the exact logic Indian students should follow if they want a strong public-university route in 2026.

TIP: Start with profile clarity before you start spending money on random applications.

## Why Germany Stands Out

Germany attracts students because the combination is unusually strong: respected public universities, globally accepted degrees, and very low tuition.

### What makes it different

- Most public universities do not charge traditional tuition fees
- Many master programs are taught in English
- Students can work part-time while studying
- Graduates can stay back to search for jobs

## Eligibility Criteria

Your route depends on academics, backlogs, university recognition, language readiness, and how realistic your shortlist is.

### Check these first

- CGPA or percentage strength
- Number of backlogs
- IELTS or English readiness
- Whether your current university is properly recognized

IMPORTANT: APS is mandatory for most Indian students and should never be treated like a last-minute task.

## Documents Required

Typical documents include transcripts, degree certificates, a resume, passport copy, SOP, LORs, and IELTS scores where required.

### What students often miss

- Document formatting issues
- Weak SOP positioning
- Applying before APS or recognition checks are clear

## Application Process

The smartest order is simple: verify profile, shortlist universities, prepare documents, then submit stronger applications.

### Stronger application flow

1. Review profile and budget
2. Build a realistic shortlist
3. Prepare SOP and supporting documents
4. Apply before deadlines close

👉 Check our [Profile Verification service](/services/profile-verification)

## Cost Breakdown

Public universities are usually tuition-free, but students still need to plan for living costs, semester fees, APS, and the blocked account.

### Typical numbers

- Tuition: EUR0 at most public universities
- Semester fee: EUR150-EUR350
- Living costs: EUR850-EUR1,200 per month
- Blocked account: roughly EUR11,208 per year

## Final Advice

Germany is one of the best options for students who want affordability and quality, but only if the process is handled with discipline.

👉 Read next: [APS Certificate Germany Full Guide](/blog/aps-certificate-germany-full-guide)`,
  },
  {
    id: 'aps-certificate-germany-full-guide',
    title: 'APS Certificate Germany: Full Guide for Indian Students',
    slug: 'aps-certificate-germany-full-guide',
    excerpt: 'Understand what APS is, why it matters, and how Indian students should prepare without avoidable delays.',
    category: 'Visa',
    tags: ['APS', 'Germany visa', 'Documents'],
    keywords: ['aps certificate germany', 'germany student visa process', 'aps for indian students'],
    featuredImage: '',
    authorName: 'Bratlin',
    authorRole: 'Founder, BVF Germany',
    authorImage: '',
    authorBio: 'Bratlin works closely with students on APS, applications, and visa planning for Germany.',
    readTime: '7 min read',
    popularity: 90,
    featured: false,
    published: true,
    createdAt: '2026-03-16T10:00:00Z',
    updatedAt: '2026-03-16T10:00:00Z',
    content: `## Introduction

If you are applying to Germany from India, APS is one of the first major checkpoints. Many students know it is important but do not understand how it affects the rest of the timeline.

## What Is APS?

APS verifies academic documents and evaluates whether your educational background aligns with the German system.

### Why students take it seriously

- It is required in most Germany study cases for Indian students
- It affects application readiness
- It is also relevant for the visa stage

IMPORTANT: Delaying APS can delay your intake, even when everything else is ready.

## Documents Required for APS

- Academic transcripts
- Degree certificates
- Passport copy
- CV or resume
- Payment proof

## Common APS Mistakes

Students often face trouble because documents are inconsistent, the timeline is underestimated, or the rest of the application plan is built without APS reality in mind.

TIP: Build your university shortlist alongside APS planning instead of waiting passively.

## How BVF Germany Helps

We help students align APS with shortlist, documents, and next deadlines so the process stays connected instead of fragmented.

👉 Explore [Visa Guidance](/services/visa-guidance)

## Final Takeaway

APS is not just another formality. It is a timing-sensitive step that should be built into the full Germany plan from day one.`,
  },
  {
    id: 'ielts-requirement-for-germany',
    title: 'IELTS Requirement for Germany Universities',
    slug: 'ielts-requirement-for-germany',
    excerpt: 'What score is usually safe, when IELTS matters most, and how it affects your shortlist quality.',
    category: 'SOP & IELTS',
    tags: ['IELTS', 'English requirements', 'Germany applications'],
    keywords: ['ielts requirement for germany', 'germany english programs', 'ielts score germany universities'],
    featuredImage: '',
    authorName: 'Bratlin',
    authorRole: 'Founder, BVF Germany',
    authorImage: '',
    authorBio: 'Bratlin guides students on IELTS planning and how language scores shape admissions strategy.',
    readTime: '6 min read',
    popularity: 76,
    featured: false,
    published: true,
    createdAt: '2026-03-12T10:00:00Z',
    updatedAt: '2026-03-12T10:00:00Z',
    content: `## Introduction

One of the most common questions students ask is simple: how much IELTS score is enough for Germany?

## Does Every University Need IELTS?

No. Some universities accept alternatives, but many strong options still expect English proof for international students.

## What Score Is Usually Safe?

The answer depends on the course and university, but stronger scores usually create more flexibility.

### A safer mindset

- 6.5 can work for many programs
- 7.0 often gives better confidence
- Lower scores may narrow your shortlist sharply

TIP: Treat IELTS as a shortlist tool, not just an exam requirement.

## When Should You Take IELTS?

Early enough that a retake is still possible without hurting deadlines.

## Why Score Planning Matters

Better language scores often improve the quality of the universities you can target, especially for English-taught master programs.

👉 Explore [IELTS Preparation](/services/ielts-preparation)

## Final Advice

Do not guess. Match your target universities against your current score and decide whether improvement changes your opportunities meaningfully.`,
  },
  {
    id: 'top-public-universities-in-germany',
    title: 'Top Public Universities in Germany for Indian Students',
    slug: 'top-public-universities-in-germany',
    excerpt: 'A practical look at why students target TU Munich, RWTH Aachen, Heidelberg, and other strong public universities.',
    category: 'Universities',
    tags: ['Public universities', 'Rankings', 'Germany colleges'],
    keywords: ['top public universities in germany', 'best german universities for indian students'],
    featuredImage: '',
    authorName: 'Bratlin',
    authorRole: 'Founder, BVF Germany',
    authorImage: '',
    authorBio: 'Bratlin helps students shortlist universities based on profile fit, not just rankings.',
    readTime: '7 min read',
    popularity: 82,
    featured: false,
    published: true,
    createdAt: '2026-03-08T10:00:00Z',
    updatedAt: '2026-03-08T10:00:00Z',
    content: `## Introduction

Students often chase rankings first, but the better question is this: which public universities fit your profile, field, and long-term goals?

## Strong Names Students Commonly Target

### TU Munich

A strong brand in engineering, technology, and research.

### RWTH Aachen

Popular for technical depth and strong industry connection.

### Heidelberg University

Highly respected for research and broad academic strength.

## How To Choose Properly

- Look beyond the overall ranking
- Check language of instruction
- Compare city cost and student life
- Match program structure to your academic background

TIP: A slightly lower-ranked public university with stronger fit often beats a famous name you are unlikely to get into.

## Shortlist Strategy

The best shortlists usually include safe, target, and ambitious options.

👉 Explore [University Verification](/services/university-verification)

## Final Advice

Public universities should be chosen with strategy, not just reputation.`,
  },
  {
    id: 'student-life-in-germany-guide',
    title: 'Student Life in Germany: What Indian Students Should Expect',
    slug: 'student-life-in-germany-guide',
    excerpt: 'From budgeting and housing to culture and routine, here is what daily life in Germany usually feels like.',
    category: 'Student Life',
    tags: ['Student life', 'Living in Germany', 'Budget'],
    keywords: ['student life in germany', 'living in germany for indian students'],
    featuredImage: '',
    authorName: 'Bratlin',
    authorRole: 'Founder, BVF Germany',
    authorImage: '',
    authorBio: 'Bratlin regularly mentors students on the shift from admissions into actual life in Germany.',
    readTime: '6 min read',
    popularity: 68,
    featured: false,
    published: true,
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-03-05T10:00:00Z',
    content: `## Introduction

Germany gives students more than a degree. It gives structure, independence, and a different way of living day to day.

## Cost of Living

Costs vary by city, but students should budget carefully and avoid assuming tuition-free means expense-free.

### Typical monthly range

- Rent: city dependent
- Food and groceries
- Health insurance
- Public transport

## Daily Life Adjustments

Punctuality matters, paperwork matters, and planning matters more than many students expect.

## Indian Student Community

Many cities have active Indian communities, student groups, and access to familiar groceries and social circles.

TIP: Learn basic German for daily life, even if your course is taught in English.

## Final Takeaway

Students who prepare for lifestyle changes early tend to settle faster and feel more confident after landing.`,
  },
  {
    id: 'accommodation-in-germany-student-guide',
    title: 'Accommodation in Germany: A Safer Guide for Students',
    slug: 'accommodation-in-germany-student-guide',
    excerpt: 'Understand student housing, WGs, private rentals, and the red flags that help you avoid scams.',
    category: 'Accommodation',
    tags: ['Accommodation', 'Housing', 'Scam awareness'],
    keywords: ['accommodation in germany for students', 'student housing germany', 'germany rental scams'],
    featuredImage: '',
    authorName: 'Bratlin',
    authorRole: 'Founder, BVF Germany',
    authorImage: '',
    authorBio: 'Bratlin helps students plan housing with less panic and better risk-awareness before arrival.',
    readTime: '5 min read',
    popularity: 71,
    featured: false,
    published: true,
    createdAt: '2026-03-02T10:00:00Z',
    updatedAt: '2026-03-02T10:00:00Z',
    content: `## Introduction

Housing is one of the most stressful parts of moving to Germany, especially when students feel pressured to book quickly.

## Common Accommodation Options

### Student dorms

Usually affordable but competitive.

### WG or shared flats

A common option for students who want lower monthly costs.

### Temporary stays

Useful when long-term housing is not locked in before departure.

IMPORTANT: Never rush into payments without verifying the listing and contract properly.

## How To Avoid Rental Scams

- Be cautious with urgent payment pressure
- Check whether the listing looks too good for the city and price
- Ask for proper documentation and verification

## Better Housing Strategy

Students make better decisions when housing is planned alongside visa timing, city budget, and arrival date.

👉 Explore [Accommodation Help](/services/accommodation-help)

## Final Advice

Housing should be treated like a strategy problem, not a panic problem.`,
  },
];

const BLOGS_PATH = DB_PATHS.blogs;

const normalizeBlogPost = (post: Partial<BlogPost> & Pick<BlogPost, 'id' | 'title' | 'slug' | 'content'>): BlogPost => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt || post.content.replace(/[[#*_!]()]/g, '').slice(0, 160),
  content: post.content,
  category: post.category || 'Admissions',
  tags: post.tags || [],
  keywords: post.keywords || [],
  featuredImage: post.featuredImage || '',
  authorName: post.authorName || 'Bratlin',
  authorRole: post.authorRole || 'Founder, BVF Germany',
  authorImage: post.authorImage || '',
  authorBio:
    post.authorBio ||
    'Bratlin shares practical guidance for Indian students planning public-university admissions in Germany.',
  readTime: post.readTime || estimateReadTime(post.content),
  popularity: typeof post.popularity === 'number' ? post.popularity : 50,
  featured: Boolean(post.featured),
  published: Boolean(post.published),
  createdAt: post.createdAt || new Date().toISOString(),
  updatedAt: post.updatedAt || new Date().toISOString(),
});

const toMap = (posts: BlogPost[]) =>
  posts.reduce<Record<string, BlogPost>>((acc, post) => {
    acc[post.id] = normalizeBlogPost(post);
    return acc;
  }, {});

export function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(3, Math.ceil(words / 180))} min read`;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const snapshot = await get(ref(db, BLOGS_PATH));
  if (!snapshot.exists()) {
    return [...defaultPosts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const data = snapshot.val() as Record<string, Partial<BlogPost>>;
  return Object.values(data)
    .map((post) => normalizeBlogPost(post as Partial<BlogPost> & Pick<BlogPost, 'id' | 'title' | 'slug' | 'content'>))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveBlogPost(post: BlogPost): Promise<void> {
  await set(ref(db, `${BLOGS_PATH}/${post.id}`), normalizeBlogPost(post));
}

export async function deleteBlogPost(id: string): Promise<void> {
  await remove(ref(db, `${BLOGS_PATH}/${id}`));
}

export function subscribeToBlogPosts(callback: (posts: BlogPost[]) => void): () => void {
  return onValue(ref(db, BLOGS_PATH), (snapshot) => {
    if (!snapshot.exists()) {
      callback([...defaultPosts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      return;
    }

    const data = snapshot.val() as Record<string, Partial<BlogPost>>;
    callback(
      Object.values(data)
        .map((post) =>
          normalizeBlogPost(post as Partial<BlogPost> & Pick<BlogPost, 'id' | 'title' | 'slug' | 'content'>),
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  });
}

export function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
