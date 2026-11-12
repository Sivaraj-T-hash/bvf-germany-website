import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useSeo } from '@/lib/useSeo';

const sections = [
  {
    title: 'Information We Collect',
    points: [
      'Contact details such as name, email address, phone number, and WhatsApp number when you fill forms or request guidance.',
      'Academic and application details you choose to share for university shortlisting, APS, visa, SOP, CV, or related services.',
      'Basic usage information collected through analytics and site tools to improve the website experience.',
    ],
  },
  {
    title: 'How We Use Information',
    points: [
      'To respond to your enquiries and guide you on study options in Germany.',
      'To deliver services such as shortlisting, document support, language guidance, visa help, and on-arrival support.',
      'To improve our website, tools, and communication quality.',
    ],
  },
  {
    title: 'Data Sharing',
    points: [
      'We do not sell personal information.',
      'Information may be shared only with service providers, technology platforms, or official process partners where needed to deliver the requested service.',
      'We may disclose information where required by law or to protect our legal rights.',
    ],
  },
  {
    title: 'Your Choices',
    points: [
      'You may request updates or correction of the information you have shared with us.',
      'You may contact BVF Germany to ask about deletion of data that is no longer needed for service delivery or compliance.',
      'You may opt out of promotional communication at any time.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  useSeo({
    title: 'Privacy Policy | BVF Germany',
    description: 'Read the BVF Germany privacy policy for details on how student data, enquiries, and website information are handled.',
    url: '/privacy-policy',
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
                <h1 className="hero-display mt-7">Privacy Policy</h1>
                <p className="hero-copy max-w-3xl">
                  This page explains how BVF Germany collects, uses, and protects the information students share through the website and related guidance services.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-5">
                <div className="surface-panel p-6">
                  <p className="section-kicker">Quick Note</p>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    If you have questions about your data or want a record updated, contact us through the main contact page or WhatsApp support.
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
