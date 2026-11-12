import AboutStoryPage from '@/components/AboutStoryPage';

// Only verified figures belong here. Add stats (with a source) once BVF has confirmed them.
export default function AchievementsPage() {
  return (
    <AboutStoryPage
      title="Achievements"
      subtitle="Milestones that reflect our student-first promise and community impact."
      ctaLabel="Read Student Stories"
      ctaTo="/success-stories"
      sections={[
        {
          title: 'Student Outcomes',
          text:
            'Admissions, APS certificates, visas and arrivals in Germany are the milestones that matter to our students. We share individual outcomes on our Success Stories page, only with each student’s permission and only for services they actually received from BVF.',
          bullets: ['APS certificates', 'University admissions', 'Student visas', 'Arrivals in Germany'],
        },
        {
          title: 'Community',
          text:
            'Students and applicants learn from each other through our webinars, sessions and online channels, where current students in Germany share practical experience with new applicants.',
          bullets: ['Webinars and sessions', 'Mentorship', 'Online resources'],
        },
        {
          title: 'How We Measure Success',
          text:
            'Success is a student who reaches the right German programme with fewer avoidable mistakes. We do not guarantee admissions or visas: those decisions belong to universities and embassies.',
          bullets: ['Realistic university choices', 'Complete, correct documents', 'Timely applications'],
        },
      ]}
    />
  );
}
