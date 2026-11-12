import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
const Index = lazy(() => import("./pages/Index.tsx"));
const Services = lazy(() => import("./pages/Services.tsx"));
const ServicePage = lazy(() => import("./pages/ServicePage.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions.tsx"));
const FAQs = lazy(() => import("./pages/FAQs.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const Pricing = lazy(() => import("./pages/Pricing.tsx"));
const Resources = lazy(() => import("./pages/Resources.tsx"));
const Universities = lazy(() => import("./pages/Universities.tsx"));
const AboutGermany = lazy(() => import("./pages/AboutGermany.tsx"));
const BachelorGermany = lazy(() => import("./pages/about-germany/BachelorGermany.tsx"));
const EngineeringGermany = lazy(() => import("./pages/about-germany/EngineeringGermany.tsx"));
const MsGermany = lazy(() => import("./pages/about-germany/MsGermany.tsx"));
const MbaGermany = lazy(() => import("./pages/about-germany/MbaGermany.tsx"));
const AusbildungGermany = lazy(() => import("./pages/about-germany/AusbildungGermany.tsx"));
const FftFlyForexTravel = lazy(() => import("./pages/services/FftFlyForexTravel.tsx"));
const ServiceIndia = lazy(() => import("./pages/services/ServiceIndia.tsx"));
const ServiceGermany = lazy(() => import("./pages/services/ServiceGermany.tsx"));
const StudyLoanGermany = lazy(() => import("./pages/services/StudyLoanGermany.tsx"));
const GermanBlockedAccount = lazy(() => import("./pages/services/GermanBlockedAccount.tsx"));
const StudentAccommodation = lazy(() => import("./pages/services/StudentAccommodation.tsx"));
const StudentHealthInsurance = lazy(() => import("./pages/services/StudentHealthInsurance.tsx"));
const StudentFlightTickets = lazy(() => import("./pages/services/StudentFlightTickets.tsx"));
const BvfGermany = lazy(() => import("./pages/about/BvfGermany.tsx"));
const ExpertTeam = lazy(() => import("./pages/about/ExpertTeam.tsx"));
const Achievements = lazy(() => import("./pages/about/Achievements.tsx"));
const GermanUniversityVisit = lazy(() => import("./pages/about/GermanUniversityVisit.tsx"));
const GermanProfessorVisits = lazy(() => import("./pages/about/GermanProfessorVisits.tsx"));
const SocialContribution = lazy(() => import("./pages/about/SocialContribution.tsx"));
const Bookings = lazy(() => import("./pages/Bookings.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ChangePassword = lazy(() => import("./pages/ChangePassword.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard.tsx"));
const FreeTools = lazy(() => import("./pages/FreeTools.tsx"));
const Webinars = lazy(() => import("./pages/Webinars.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();
const GA_MEASUREMENT_ID = String(import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      return;
    }

    const trackerWindow = window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };

    if (!document.querySelector('script[data-bvf-ga="loader"]')) {
      trackerWindow.dataLayer = trackerWindow.dataLayer || [];
      trackerWindow.gtag =
        trackerWindow.gtag ||
        ((...args: unknown[]) => {
          trackerWindow.dataLayer?.push(args);
        });

      trackerWindow.gtag("js", new Date());
      trackerWindow.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.dataset.bvfGa = "loader";
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      return;
    }

    const trackerWindow = window as Window & {
      gtag?: (...args: unknown[]) => void;
    };

    if (!trackerWindow.gtag) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      trackerWindow.gtag?.("config", GA_MEASUREMENT_ID, {
        page_path: `${location.pathname}${location.search}`,
        page_location: window.location.href,
        page_title: document.title,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.search]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/terms-and-conditions" element={<PageTransition><TermsAndConditions /></PageTransition>} />
          <Route path="/faqs" element={<PageTransition><FAQs /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
          <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
          <Route path="/universities" element={<PageTransition><Universities /></PageTransition>} />
          <Route path="/tools" element={<PageTransition><FreeTools /></PageTransition>} />
          <Route path="/tools/cgpa-to-german-grade-converter" element={<PageTransition><FreeTools /></PageTransition>} />
          <Route path="/tools/ielts-bank-requirements-checker" element={<PageTransition><FreeTools /></PageTransition>} />
          <Route path="/webinars" element={<PageTransition><Webinars /></PageTransition>} />
          <Route path="/about-germany" element={<PageTransition><AboutGermany /></PageTransition>} />
          <Route path="/about-germany/bachelor" element={<PageTransition><BachelorGermany /></PageTransition>} />
          <Route path="/about-germany/engineering" element={<PageTransition><EngineeringGermany /></PageTransition>} />
          <Route path="/about-germany/ms" element={<PageTransition><MsGermany /></PageTransition>} />
          <Route path="/about-germany/mba" element={<PageTransition><MbaGermany /></PageTransition>} />
          <Route path="/about-germany/ausbildung" element={<PageTransition><AusbildungGermany /></PageTransition>} />
          <Route path="/study-in-germany" element={<PageTransition><AboutGermany /></PageTransition>} />
          <Route path="/study-in-germany/bachelor" element={<PageTransition><BachelorGermany /></PageTransition>} />
          <Route path="/study-in-germany/engineering" element={<PageTransition><EngineeringGermany /></PageTransition>} />
          <Route path="/study-in-germany/ms" element={<PageTransition><MsGermany /></PageTransition>} />
          <Route path="/study-in-germany/mba" element={<PageTransition><MbaGermany /></PageTransition>} />
          <Route path="/study-in-germany/ausbildung" element={<PageTransition><AusbildungGermany /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
          <Route path="/services/fft" element={<PageTransition><FftFlyForexTravel /></PageTransition>} />
          <Route path="/services/india" element={<PageTransition><ServiceIndia /></PageTransition>} />
          <Route path="/services/germany" element={<PageTransition><ServiceGermany /></PageTransition>} />
          <Route path="/services/study-loan" element={<PageTransition><StudyLoanGermany /></PageTransition>} />
          <Route path="/services/blocked-account" element={<PageTransition><GermanBlockedAccount /></PageTransition>} />
          <Route path="/services/accommodation" element={<PageTransition><StudentAccommodation /></PageTransition>} />
          <Route path="/services/health-insurance" element={<PageTransition><StudentHealthInsurance /></PageTransition>} />
          <Route path="/services/flight-tickets" element={<PageTransition><StudentFlightTickets /></PageTransition>} />
          <Route path="/services/:slug" element={<PageTransition><ServicePage /></PageTransition>} />
          <Route path="/about/bvf-germany" element={<PageTransition><BvfGermany /></PageTransition>} />
          <Route path="/about/expert-team" element={<PageTransition><ExpertTeam /></PageTransition>} />
          <Route path="/about/achievements" element={<PageTransition><Achievements /></PageTransition>} />
          <Route path="/about/german-university-visit" element={<PageTransition><GermanUniversityVisit /></PageTransition>} />
          <Route path="/about/german-professors" element={<PageTransition><GermanProfessorVisits /></PageTransition>} />
          <Route path="/about/social-contribution" element={<PageTransition><SocialContribution /></PageTransition>} />
          <Route path="/bookings" element={<PageTransition><Bookings /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          <Route path="/change-password" element={<PageTransition><ChangePassword /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><ProtectedRoute><StudentDashboard /></ProtectedRoute></PageTransition>} />
          <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route path="/admin/dashboard" element={<PageTransition><AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route path="/admin/dashboard" element={<PageTransition><AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AnalyticsTracker />
          <ScrollToTop />
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
