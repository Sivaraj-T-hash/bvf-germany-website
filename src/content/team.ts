/**
 * The people behind BVF Germany. Text supplied by BVF on 12 Nov 2026.
 *
 * Only people who have agreed to appear on the website are listed here. Use genuine photos only.
 */
import founderPhoto from '@/assets/adharsh-bratlin.jpg';
import srinivasanPhoto from '@/assets/team/srinivasan-sivakumar.jpg';
import { founderProfile } from '@/config/business';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  /** Short line under the name, e.g. fields of expertise. */
  headline: string;
  photo: string;
  /** Short summary for cards. */
  summary: string;
};

export const founder: TeamMember = {
  id: 'bratlin',
  name: founderProfile.name,
  role: 'Founder',
  headline: founderProfile.background,
  photo: founderPhoto,
  summary:
    'From a Mechanical Engineering degree in India and about two years as an Aerospace Process Engineer, to advanced studies and research in Space Engineering at the University of Bremen. Bratlin built BVF Germany so students never have to figure out the journey alone.',
};

export const operationalHead: TeamMember = {
  id: 'srinivasan-sivakumar',
  name: 'Srinivasan Sivakumar',
  role: 'Operational Head',
  headline: 'Industrial Engineering | Research & Innovation | International Education Mentor',
  photo: srinivasanPhoto,
  summary:
    'Industrial Engineering at the Technical University of Berlin (TU Berlin), with exposure to research in the German academic environment. Srinivasan guides students to understand their options and make informed academic decisions.',
};

export const teamMembers: TeamMember[] = [founder, operationalHead];

/** "The People Behind BVF Germany" page copy, as written by BVF. */
export const peopleIntro = {
  title: 'The People Behind BVF Germany',
  subtitle: 'A journey built on experience. A mission driven by purpose.',
  paragraphs: [
    'Every year, thousands of Indian students dream of pursuing their Master’s degree in Germany. For many, it is not just about getting a foreign degree. It is about building a better future, making their families proud and creating opportunities they never thought were possible.',
    'But somewhere between that dream and reality, students often face confusion, misleading information, unnecessary expenses and a lack of proper guidance.',
    'We understand this because we have been through the journey ourselves.',
  ],
};

export const founderStory = {
  heading: 'Meet Our Founder – Bratlin',
  lead: 'From an engineering background in India to pursuing Space Engineering in Germany, and building a platform to help other students follow the same path.',
  paragraphs: [
    'Hello! I’m Bratlin, Founder of BVF Germany.',
    'My journey started in India with a Bachelor’s degree in Mechanical Engineering. After graduating, I spent around two years working in the aerospace industry as an Aerospace Process Engineer.',
    'Working in the aerospace sector gave me valuable industry experience and helped me understand engineering beyond textbooks. But I always wanted to explore further, challenge myself and grow academically.',
    'That ambition eventually brought me to Germany.',
    'Today, I am associated with the University of Bremen, pursuing advanced studies and research in Space Engineering, with a strong interest in research and development in the space sector.',
    'Moving from India to Germany was a life-changing experience. Like many international students, I had to understand a completely new education system, university requirements, application procedures and the practical challenges of settling in another country.',
    'I know how overwhelming the process can feel, especially when you are trying to make the right decisions from thousands of kilometres away.',
    'During my journey, I started noticing something that genuinely bothered me.',
    'Many students were spending their parents’ hard-earned money on overseas education services without receiving the clarity, transparency or support they actually deserved. Some were given unrealistic admission promises, while others were confused by complicated processes and misleading information.',
    'I kept thinking:',
  ],
  question:
    'Why should pursuing quality education in Germany be so confusing or expensive when so many opportunities are available at public universities?',
  closing: 'That thought became the starting point of BVF Germany.',
};

export const whyStarted = {
  heading: 'Why I Started BVF Germany',
  paragraphs: [
    'I didn’t want to build just another overseas education consultancy.',
    'I wanted to build a support system that I wish more students had access to when they first started planning their Germany journey.',
    'The idea behind BVF Germany is simple: help Indian students understand the German public university education system, make informed decisions and pursue their Master’s degree through the right process.',
    'We believe students should not have to depend on exaggerated promises, pressure tactics or expensive packages to access quality education.',
    'Instead, they deserve someone who can explain things honestly, guide them based on their individual profile and help them understand every step.',
    'What started as an idea has gradually grown into a team working towards one shared purpose.',
  ],
  helpIntro: 'Today, we help students navigate different stages of their journey, including:',
  helpItems: [
    'Understanding their academic profiles and eligibility.',
    'Identifying suitable German public universities and programmes.',
    'Preparing and navigating university applications.',
    'Understanding the documentation and admission process.',
    'Providing guidance as they move towards their Germany journey.',
  ],
  closing: 'For us, it is not about simply submitting applications. It is about helping students make decisions that can shape their future.',
};

export const everyStudent = {
  heading: 'Every Student Has a Story',
  paragraphs: [
    'One of the most fulfilling parts of building BVF Germany is seeing students turn their plans into reality.',
    'Every student comes with a different academic background, financial situation, expectations and challenges.',
    'We have been fortunate to become part of several such journeys.',
    'From helping our first student, Ramana, navigate his journey to Germany to celebrating the admissions of students like Jana and Shahidh at TU Chemnitz, every milestone reminds us why we started.',
    'And when we get to welcome our students in Germany, it feels different. It is no longer just an application or an admission letter. It is a real person taking a major step towards a new chapter in life.',
    'Their progress is what motivates us to keep improving.',
    'We don’t want to define BVF Germany only by the number of students we support. We want to build something that students can genuinely trust and confidently recommend to others.',
  ],
};

export const whatWeStandFor = {
  heading: 'What We Stand For',
  intro: 'Our vision goes beyond university applications. We want to contribute towards making quality German public university education more accessible to deserving Indian students.',
  belief: 'Education should be guided by honesty, not driven by profit alone.',
  values: [
    { title: 'Transparency', text: 'No unrealistic promises about admissions or visas.' },
    { title: 'Right guidance', text: 'Recommendations based on individual academic profiles.' },
    { title: 'Public university focus', text: 'Helping students explore quality education opportunities at German public universities.' },
    { title: 'Student-first approach', text: 'Understanding each student’s situation instead of treating every application the same way.' },
    { title: 'Genuine support', text: 'Making the process easier to understand, one step at a time.' },
  ],
  disclaimer:
    'We cannot guarantee an admission or a visa. Those decisions are made by universities and the relevant authorities. But we can commit to providing honest guidance, clear communication and dedicated support throughout the process.',
};

export const founderMessage = {
  heading: 'A Personal Message From Our Founder',
  paragraphs: [
    'If there is one thing I have learned from my journey, it is that moving to another country and building a future there is not always easy.',
    'Behind every student who wants to come to Germany, there is often a family making sacrifices, a parent placing their trust in their child’s dream and a young person trying to figure out where to begin.',
    'I don’t want students to lose their savings, confidence or opportunities because they received the wrong guidance.',
    'My vision for BVF Germany is to build a reliable bridge between Indian students and the opportunities available at German public universities.',
    'We are still growing, learning and improving. But the purpose with which we started will always remain the same.',
  ],
  highlight: 'We don’t just want to help students reach Germany. We want to help them make the right decisions for their future.',
  invitation: 'If you are dreaming of pursuing your Master’s in Germany, we would be happy to be a part of your journey.',
  signoff: 'Your future deserves the right guidance.',
  signature: '— Bratlin, Founder, BVF Germany',
};

export const operationalHeadProfile = {
  heading: 'Meet our Operational Head – Srinivasan Sivakumar',
  paragraphs: [
    'Srinivasan Sivakumar brings together a strong interest in engineering, research and student development. With an academic background in Industrial Engineering from the Technical University of Berlin (TU Berlin), Germany, and exposure to research activities within the German academic environment, he has developed a practical perspective on how engineering knowledge can be translated into real-world industrial solutions.',
    'His areas of interest include industrial process optimisation, intelligent production systems, digital transformation and data-driven decision-making. He is passionate about exploring how emerging technologies and innovative engineering approaches can improve productivity, operational efficiency and sustainable industrial development.',
    'Beyond engineering, Srinivasan is deeply passionate about international education and student mentorship. Having experienced the challenges and opportunities of pursuing higher education in Germany, he understands how difficult it can be for students to navigate unfamiliar university systems, admission requirements and academic pathways.',
    'This experience motivates him to guide aspiring students, helping them understand their options, make informed academic decisions and approach their international education journey with greater confidence.',
    'At BVF Germany, he plays an important role in our mission to make German public university education more accessible to Indian students through practical guidance, transparency and genuine mentorship.',
  ],
  visionHeading: 'His Vision',
  vision: [
    'Srinivasan believes that international education should be built on the right information, realistic expectations and equal access to opportunities.',
    'His vision is to help students look beyond university admissions and prepare themselves for the academic, professional and personal challenges of building a future abroad.',
  ],
  visionHighlight:
    'For him, success is not simply about helping a student secure admission. It is about helping them make the right decisions, recognise their potential and move towards a better future with confidence.',
  closing: 'At BVF Germany, he is committed to creating a student-first support system where genuine guidance matters more than unrealistic promises.',
};
