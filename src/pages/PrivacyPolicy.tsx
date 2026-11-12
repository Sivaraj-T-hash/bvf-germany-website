import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSeo } from '@/lib/useSeo';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { emailLink } from '@/lib/contact';
import { businessInfo } from '@/config/business';

// Describes the data flows that exist in this codebase. Have it reviewed before launch and keep it in
// step with the site: update it whenever a new form, tool or service provider is added.
const LAST_UPDATED = '11 November 2026';

export default function PrivacyPolicyPage() {
  useSeo({
    title: 'Privacy Policy | BVF Germany',
    description: 'How BVF Germany collects, uses and protects your personal information.',
  });
  const settings = useSiteSettings();
  const operator = businessInfo.legalName || 'BVF Germany';
  const mailHref = emailLink(settings.contactEmail);

  return (
    <div className="site-shell">
      <Navbar />
      <main className="px-4 pb-20 pt-28 md:px-8">
        <article className="container-narrow max-w-3xl space-y-8 text-sm leading-7 text-muted-foreground md:text-base">
          <header>
            <p className="section-kicker">Legal</p>
            <h1 className="mt-3 text-4xl font-extrabold text-foreground">Privacy Policy</h1>
            <p className="mt-3">Last updated: {LAST_UPDATED}</p>
          </header>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Who we are</h2>
            <p className="mt-2">
              This website is operated by {operator}. We help Indian students plan their studies in Germany.
              {settings.address ? ` Our address is ${settings.address}.` : ''}
            </p>
            {mailHref ? (
              <p className="mt-2">
                For any privacy question or request, email us at <a href={mailHref} className="font-semibold text-foreground underline">{settings.contactEmail}</a>.
              </p>
            ) : (
              <p className="mt-2">
                For any privacy question or request, <Link to="/contact" className="font-semibold text-foreground underline">contact us</Link>.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">What we collect</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li><span className="font-semibold text-foreground">Enquiries and bookings:</span> your name, email address, phone number and message, and for consultations your preferred date and time. Webinar registrations also include your qualification, target intake and planning year.</li>
              <li><span className="font-semibold text-foreground">Student accounts:</span> your name, email, phone, university preference, an optional profile photo link, links to documents you submit, your service progress, notes from our team, bookings, webinar registrations and orders. Passwords are handled by Google Firebase Authentication; we never see them.</li>
              <li><span className="font-semibold text-foreground">Orders:</span> the item you order, its price, and the details needed to confirm your payment.</li>
              <li><span className="font-semibold text-foreground">Free tools:</span> the CGPA and IELTS calculators run in your browser and their inputs are not stored. If you request a free profile evaluation, we store the email address you enter.</li>
              <li><span className="font-semibold text-foreground">Browser storage:</span> we keep your sign-in session and a few settings (such as “remember me” and form timing used for spam protection) in your browser.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Why we use it</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>To answer your enquiries and arrange consultations and webinars.</li>
              <li>To provide the services you sign up for, and to manage your student account and dashboard.</li>
              <li>To send service emails, such as confirmations, password reset codes, order updates and, for registered students, notices about new guides and webinars.</li>
              <li>To protect the website against spam and misuse.</li>
            </ul>
            <p className="mt-2">We do not sell your personal information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Service providers</h2>
            <p className="mt-2">We use these providers to run the website. They process data on our behalf:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Google Firebase: sign-in, database and website hosting.</li>
              <li>Render: the server that sends our emails and handles password resets.</li>
              <li>Our email delivery provider: sending confirmation and service emails.</li>
              <li>Calendly: only if you book a consultation through the embedded calendar.</li>
              <li>YouTube: only if you play an embedded video.</li>
              <li>WhatsApp (Meta): only if you choose to contact us on WhatsApp.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">How long we keep it</h2>
            <p className="mt-2">
              We keep your information for as long as we need it to answer your enquiry, provide our services and meet our legal
              obligations. You can ask us to delete it at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Your choices</h2>
            <p className="mt-2">
              You can ask us for a copy of your information, ask us to correct it, or ask us to delete it. Students can also update
              their profile details in the dashboard. You can unsubscribe from announcement emails by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Changes</h2>
            <p className="mt-2">We will update this page if the way we handle personal information changes, and show the date of the latest update above.</p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
