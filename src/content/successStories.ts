/**
 * Genuine BVF student success stories.
 *
 * Rules (from the BVF website audit brief):
 * - Only real students, with permission to publish their name, photo and story (`consentConfirmed`).
 * - Use the student's genuine photograph (save it in src/assets/students/ and import it here). No AI or stock photos.
 * - `servicesReceived` must list only services the student actually received from BVF. Leave it empty if unknown.
 * - Never invent quotes. Add `quote` only with the student's own words.
 *
 * A story is shown on the website only when `consentConfirmed` is true and the required fields are filled in.
 *
 * The four stories below come from BVF's own success-story posters, supplied by BVF on 12 Nov 2026 for publication.
 */
import ramanaPhoto from '@/assets/students/ramana.jpg';
import ramanaPoster from '@/assets/students/ramana-poster.jpg';
import janaPhoto from '@/assets/students/jana-pannerselvam.jpg';
import janaPoster from '@/assets/students/jana-pannerselvam-poster.jpg';
import shahidhPhoto from '@/assets/students/shahidh-akil.jpg';
import shahidhPoster from '@/assets/students/shahidh-akil-poster.jpg';
import srinidhiPhoto from '@/assets/students/srinidhi-shakthi.jpg';
import srinidhiPoster from '@/assets/students/srinidhi-shakthi-poster.jpg';

export type StoryType = 'admission' | 'application' | 'arrived' | 'studying' | 'german-language';

export const storyTypeLabels: Record<StoryType, string> = {
  admission: 'Received university admission',
  application: 'Completed applications with BVF',
  arrived: 'Arrived in Germany',
  studying: 'Studying at a German public university',
  'german-language': 'Completed German language training',
};

export interface SuccessStory {
  id: string;
  consentConfirmed: boolean;
  storyType: StoryType;
  fullName: string;
  /** Genuine photo of the student. */
  photo: string;
  /** Optional BVF poster for this story, shown on the story page. */
  poster?: string;
  /** One-line summary shown on cards when there is no quote. */
  highlight?: string;
  videoUrl?: string;
  indianInstitution?: string;
  degree?: string;
  branch?: string;
  cgpa?: string;
  ieltsScore?: string;
  graduationYear?: string;
  hometown?: string;
  germanUniversity: string;
  admittedCourse?: string;
  intake?: string;
  servicesReceived?: string[];
  /** The student's own words only. */
  quote?: string;
  /** Longer story. Separate paragraphs with a blank line. */
  story?: string;
}

export const successStories: SuccessStory[] = [
  {
    id: 'ramana-btu-cottbus',
    consentConfirmed: true,
    storyType: 'arrived',
    fullName: 'Ramana',
    photo: ramanaPhoto,
    poster: ramanaPoster,
    highlight: 'Our first student. Admission confirmed at BTU Cottbus-Senftenberg. From India to Germany, the first BVF journey begins.',
    indianInstitution: 'Panimalar Engineering College',
    cgpa: '7.8 / 10',
    ieltsScore: '6.0',
    graduationYear: '2025',
    germanUniversity: 'Brandenburg University of Technology Cottbus-Senftenberg (BTU Cottbus)',
    story:
      'Ramana was the first student BVF Germany guided. He graduated from Panimalar Engineering College in 2025 with a CGPA of 7.8 out of 10 and an IELTS score of 6.0, and received his admission to the Brandenburg University of Technology Cottbus-Senftenberg (BTU Cottbus).\n\nThe BVF team welcomed him when he arrived in Germany. In our founder’s words, “When we get to welcome our students in Germany, it feels different. It is no longer just an application or an admission letter. It is a real person taking a major step towards a new chapter in life.”',
  },
  {
    id: 'jana-pannerselvam-tu-chemnitz',
    consentConfirmed: true,
    storyType: 'admission',
    fullName: 'Jana Pannerselvam',
    photo: janaPhoto,
    poster: janaPoster,
    highlight: 'Master’s in Embedded Systems at TU Chemnitz.',
    indianInstitution: 'Mahendra Engineering College',
    degree: 'Bachelor’s',
    branch: 'EEE',
    cgpa: '7.98 / 10',
    ieltsScore: '6.0',
    graduationYear: '2026',
    hometown: 'Salem, India',
    germanUniversity: 'TU Chemnitz',
    admittedCourse: 'Master’s in Embedded Systems',
  },
  {
    id: 'shahidh-akil-tu-chemnitz',
    consentConfirmed: true,
    storyType: 'admission',
    fullName: 'Shahidh Akil',
    photo: shahidhPhoto,
    poster: shahidhPoster,
    highlight: 'MSc Embedded Systems at Technical University Chemnitz.',
    indianInstitution: 'Kongu Engineering College, Coimbatore',
    degree: 'Bachelor’s',
    branch: 'Mechatronics Engineering',
    cgpa: '7.3 / 10',
    ieltsScore: '6.0',
    graduationYear: '2025',
    hometown: 'Madurai, Tamil Nadu',
    germanUniversity: 'Technical University Chemnitz',
    admittedCourse: 'MSc Embedded Systems',
  },
  {
    id: 'srinidhi-shakthi-fh-suedwestfalen',
    consentConfirmed: true,
    storyType: 'admission',
    fullName: 'Srinidhi Shakthi',
    photo: srinidhiPhoto,
    poster: srinidhiPoster,
    highlight: 'Master’s in Informatics and Business at FH Südwestfalen.',
    indianInstitution: 'Periyar University',
    degree: 'BCA',
    cgpa: '8.3 / 10',
    ieltsScore: '7.0',
    germanUniversity: 'FH Südwestfalen',
    admittedCourse: 'Master’s in Informatics and Business',
  },
];

const REQUIRED_FIELDS: Array<keyof SuccessStory> = ['id', 'fullName', 'photo', 'germanUniversity'];

const isPublishable = (story: SuccessStory) =>
  story.consentConfirmed && REQUIRED_FIELDS.every((field) => String(story[field] ?? '').trim().length > 0);

/** Stories that may be shown publicly. */
export const publishedStories: SuccessStory[] = successStories.filter(isPublishable);

export const getPublishedStory = (id: string) => publishedStories.find((story) => story.id === id) || null;

/** "Bachelor’s EEE, Mahendra Engineering College (2026)" — only the parts that are known. */
export const storyBackground = (story: SuccessStory) => {
  const degree = [story.degree, story.branch].filter(Boolean).join(' ');
  const base = [degree, story.indianInstitution].filter(Boolean).join(', ');
  return story.graduationYear ? `${base} (${story.graduationYear})` : base;
};

/** "Master’s in Embedded Systems, TU Chemnitz" */
export const storyDestination = (story: SuccessStory) =>
  [story.admittedCourse, story.germanUniversity].filter(Boolean).join(', ') + (story.intake ? ` · ${story.intake}` : '');
