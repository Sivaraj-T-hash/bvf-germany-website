import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useSeo } from '@/lib/useSeo';

const sections = [
  {
    title: 'Use of Website',
    points: [
      'The BVF Germany website is intended to provide information and support related to studying in Germany.',
      'Users should provide accurate information when filling forms, requesting services, or communicating with the BVF Germany team.',
      'Website content may be updated, improved, or removed at any time without prior notice.',
    ],
  },
  {
    title: 'Service Scope',
    points: [
      'BVF Germany provides guidance, planning, and support services but does not guarantee university admission, APS approval, visa approval, scholarship awards, or job placement.',
      'Final decisions are always made by universities, official authorities, embassies, or employers.',
      'Students are responsible for reviewing official requirements and submitting complete and truthful documents.',
    ],
  },
  {
    title: 'Payments and Deliverables',
    points: [
      'Any service pricing, package structure, or timelines shared by BVF Germany apply only to the service described at the time of purchase or enrolment.',
      'Turnaround times may depend on student responsiveness, document quality, and third-party process timelines.',
      'Custom deliverables such as SOPs, CVs, and shortlists are created for the requesting student and should not be redistributed commercially.',
    ],
  },
  {
    title: 'Limitation of Liability',
    points: [
      'BVF Germany is not responsible for losses arising from incorrect information provided by users, late submissions, third-party platform issues, or changes in official rules.',
      'Users should verify all high-stakes details, including visa and university requirements, through the relevant official sources.',
      'Continued use of the website or services indicates acceptance of these terms.',
    ],
  },
];

export default function TermsAndConditionsPage() {
  useSeo({
    title: 'Terms and Conditions | BVF Germany',
    description: 'Read the BVF Germany terms and conditions for use of the site, services, payments, and general support scope.',
    url: '/terms-and-conditions',
  });

  return (
    <div className="site-shell home-showcase">
      <Navbar />

      <main>
        <section className="page-hero">
          <div className="page-hero-inner">
            <div className="poster-grid items-end">
              <div className="col-span-12 lg:col-span-7">
                <p className="eyebrow-chip">Legal</p>
                <h1 className="hero-display mt-7">Terms and Conditions</h1>
                <p className="hero-copy max-w-3xl">
                  These terms outline how the BVF Germany website and services should be used, including the limits of advisory support and the responsibilities of students using the platform.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-5">
                <div className="surface-panel p-6">
                  <p className="section-kicker">Quick Note</p>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    If you need clarity on service scope, delivery timelines, or any package you are considering, reach out before purchasing.
                  </p>
                  <Link to="/contact" className="button-primary mt-6">
                    Contact BVF Germany
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 md:px-8 md:pb-24">
          <div className="container-narrow space-y-6">
            {sections.map((section) => (
              <article key={section.title} className="surface-panel p-8">
                <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                <div className="mt-5 space-y-3">
                  {section.points.map((point) => (
                    <div key={point} className="flex items-start gap-3 rounded-[22px] border border-border/70 bg-background/70 px-4 py-4">
                      <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                      <p className="text-sm leading-7 text-foreground">{point}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
