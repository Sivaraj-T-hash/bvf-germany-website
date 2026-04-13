# BVF Germany Website

This README is the full product and technical documentation for the BVF Germany website project. It explains:

- what the website is built for
- which pages exist and how each page works
- how Firebase is configured and used
- how data moves between visitors, students, and admins
- how the student dashboard and admin dashboard are connected
- what is dynamic, what is hardcoded, and what currently needs manual setup

## 1. Project Overview

BVF Germany is a React + Vite website for Indian students planning to study in Germany. The site combines:

- a public marketing website
- lead capture forms
- webinar registrations
- consultation booking
- student account registration and login
- a student dashboard
- an admin dashboard

The website is built around one core idea:

- the public pages generate leads, bookings, webinar registrations, and student accounts
- the admin dashboard manages those records
- the student dashboard shows the student-facing version of the same journey

## 2. Tech Stack

- Frontend: React 18 + TypeScript
- Bundler: Vite
- Routing: `react-router-dom`
- Styling: Tailwind CSS + custom design system classes
- UI primitives: Radix UI components
- Animation: Framer Motion
- Forms: React Hook Form + Zod
- Backend: Firebase Authentication + Firebase Realtime Database
- Hosting: Firebase Hosting
- Testing: Vitest + Testing Library setup

Important architectural note:

- React Query is initialized in `src/App.tsx`, but most data loading in this project is still done with direct `useEffect` calls and Firebase listeners instead of query hooks.

## 3. Scripts

From `package.json`:

```json
{
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

## 4. Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

Default Vite dev server details from `vite.config.ts`:

- host: `::`
- port: `8080`
- alias: `@ -> ./src`

### 4.1 Production Hosting (Render + Firebase)

This repo is set up for:

- Backend API (`server/server.js`) on Render Web Service
- Frontend (`dist`) on Firebase Hosting

Backend deploy (Render):

1. Push this repo to GitHub.
2. In Render create `New -> Web Service`.
3. Use:
   - Root Directory: `BVF-Website/BVF-Website`
   - Build Command: `npm install`
   - Start Command: `node server/server.js`
4. Add environment variables in Render:
   - `PORT=10000`
   - `CORS_ORIGIN=https://<your-firebase-site>.web.app`
   - `FIREBASE_DATABASE_URL=https://bvf-student-support-default-rtdb.firebaseio.com`
   - `FIREBASE_SERVICE_ACCOUNT_JSON={...}` (full JSON as one line)
   - `MAIL_TRANSPORT=resend`
   - `RESEND_API_KEY=<your-resend-api-key>`
   - `MAIL_FROM=BVF Support <your-verified-sender-domain-email>`
   - `ADMIN_NOTIFICATION_EMAIL=<your-email>`

   Optional SMTP mode (for local dev or environments where SMTP egress is allowed):
   - `MAIL_TRANSPORT=smtp`
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=<your-email>`
   - `SMTP_PASS=<your-app-password>`
   - `MAIL_FROM=BVF Support <your-email>`
   - `ADMIN_NOTIFICATION_EMAIL=<your-email>`
   - `SMTP_CONNECTION_TIMEOUT=10000`
   - `SMTP_GREETING_TIMEOUT=10000`
   - `SMTP_SOCKET_TIMEOUT=20000`
Note: Render free web services block outbound SMTP ports, so `MAIL_TRANSPORT=resend` is recommended there.

5. Verify backend health URL:
   - `https://<your-render-service>.onrender.com/api/health`

Frontend deploy (Firebase Hosting):

1. Set production API URL in `.env.production`:
   - `VITE_AUTH_API_BASE_URL=https://<your-render-service>.onrender.com`
2. Build and deploy:

```bash
npm run build
npx firebase-tools deploy --only hosting
```

Final Firebase auth setting:

- Firebase Console -> Authentication -> Settings -> Authorized domains
- Add `https://<your-firebase-site>.web.app` (and custom domain if used)

## 5. Environment Variables

Vite environment variables currently used:

- `VITE_CALENDLY_URL`
- `VITE_FIREBASE_DATABASE_TRANSPORT` (optional: `auto`, `websocket`, or `long-polling`; default `auto`)

- `VITE_CALENDLY_URL` is used on the `/bookings` page. If it is present, the page shows an inline Calendly widget. If it is missing, the page falls back to a manual booking request form.
- `VITE_FIREBASE_DATABASE_TRANSPORT` is read by `src/lib/firebase.ts` to force Realtime Database transport mode when troubleshooting network restrictions.

Important implementation detail:

- Firebase web app config is not loaded from environment variables in this project.
- The Firebase web app config is hardcoded in `src/lib/firebase.ts`.

## 6. Firebase Configuration

### 6.1 Current Web App Config

The checked-in Firebase config in `src/lib/firebase.ts` is:

```ts
const firebaseConfig = {
  apiKey: 'AIzaSyCGBKzLFsXam01kCw_QMjHJmeHfFYfelzE',
  authDomain: 'bvf-student-support.firebaseapp.com',
  projectId: 'bvf-student-support',
  storageBucket: 'bvf-student-support.firebasestorage.app',
  messagingSenderId: '783465744194',
  appId: '1:783465744194:web:dcc8a99142b29ddbebaadb',
  measurementId: 'G-VMYG2ZGJQ4',
  databaseURL: 'https://bvf-student-support-default-rtdb.firebaseio.com',
};
```

The app initializes:

- `initializeApp`
- `getAuth`
- `getDatabase`

It exports:

- `app`
- `auth`
- `db`

### 6.2 Firebase Services Actually Used

Used actively:

- Firebase Authentication
- Firebase Realtime Database
- Firebase Hosting

Configured but not actively used in the frontend:

- Firestore
- Analytics measurement ID
- Storage bucket

Important implementation detail:

- Firestore exists in project config, but access is fully blocked by rules and no Firestore SDK calls are used by the app.

### 6.3 Firebase Hosting

From `firebase.json`:

- hosting public directory: `dist`
- SPA rewrite: all routes rewrite to `/index.html`

That means all React routes are client-side routes and Firebase Hosting serves the same built entry file for every path.

### 6.4 Firebase Console Checklist

To run this project correctly, the Firebase project must have:

1. Email/Password sign-in enabled in Firebase Authentication
2. Realtime Database enabled
3. Hosting configured for the `bvf-student-support` project
4. At least one admin Firebase Auth user created manually
5. A matching admin profile inserted into Realtime Database under `admins/{uid}`

Example admin profile structure:

```json
{
  "uid": "firebase-auth-user-uid",
  "email": "admin@example.com",
  "name": "BVF Admin",
  "isAdmin": true,
  "createdAt": "2026-03-30T00:00:00.000Z",
  "updatedAt": "2026-03-30T00:00:00.000Z"
}
```

Without that `admins/{uid}` record:

- admin login will authenticate with Firebase Auth
- but access to `/admin/dashboard` will still be denied

### 6.5 Realtime Database Rules Summary

From `database.rules.json`:

- top-level default read/write is denied
- `admins/{uid}`:
  - admins can write
  - users can read only their own admin profile
- `students/{uid}`:
  - students can read/write their own profile
  - admins can read/write all student profiles
- `leads/{leadId}`:
  - public writes are allowed
  - only admins can read
- `bookings/{bookingId}`:
  - public creation is allowed
  - admins can manage all records
  - authenticated users can read only bookings matching their email
- `webinarRegistrations/{id}`:
  - public creation is allowed
  - admins can manage all records
  - authenticated users can read only webinar records matching their email
- `orders/{orderId}`:
  - admins can manage all records
  - authenticated users can read their own orders by email
  - creation is only allowed for authenticated users and matching email
- `blogPosts`, `pricingPlans`, `siteContent`:
  - public read
  - admin write only

### 6.6 Firestore Rules

Firestore is explicitly disabled:

```txt
allow read, write: if false;
```

### 6.7 Indexing Notes

Current RTDB rule indexes:

- `students`: `email`
- `bookings`: `email`
- `webinarRegistrations`: `email`

Implementation note:

- the student dashboard also queries `bookings` and `webinarRegistrations` by `studentEmail`
- `orders` are queried by `email`
- those query fields are not all indexed in the current rules file

## 7. Data Model

Main Realtime Database paths:

- `admins`
- `students`
- `leads`
- `bookings`
- `webinarRegistrations`
- `orders`
- `blogPosts`
- `pricingPlans`
- `siteContent/universities`
- `siteContent/testimonials`
- `siteContent/settings`

### 7.1 `admins`

Purpose:

- identifies which Firebase Auth users are allowed into the admin dashboard

Main fields:

- `uid`
- `email`
- `name`
- `isAdmin`
- `createdAt`
- `updatedAt`
- `lastLoginAt`

### 7.2 `students`

Purpose:

- primary student record used by auth checks and the student dashboard

Main fields:

- `uid`
- `name`
- `email`
- `phone`
- `isApproved`
- `approvedAt`
- `universityPreference`
- `profilePhoto`
- `services`
- `adminNotes`
- `timeline`
- `createdAt`
- `updatedAt`

Important behavior:

- every newly registered student gets a default student profile
- `isApproved` starts as `false`
- service progress is pre-created from `serviceCatalog`
- student timeline is used as an activity feed inside the dashboard

### 7.3 `leads`

Purpose:

- stores contact, pricing, and tools-page lead captures

Sources:

- `/contact`
- `/pricing`
- `/tools`

Main fields:

- `source`
- `sourcePage`
- `name`
- `email`
- `phone`
- `subject`
- `message`
- `ownerType`
- `userId`
- `studentEmail`
- `metadata`
- `status`
- `createdAt`

### 7.4 `bookings`

Purpose:

- stores free consultation requests

Sources:

- manual request form on `/bookings`
- future/manual `calendly_webhook` source is allowed by type, though not implemented in this repo

Main fields:

- `name`
- `email`
- `studentEmail`
- `phone`
- `preferredDate`
- `preferredTime`
- `notes`
- `ownerType`
- `userId`
- `source`
- `status`
- `meetingLink`
- `adminInstructions`
- `createdAt`

### 7.5 `webinarRegistrations`

Purpose:

- stores webinar registrations from the webinars page

Main fields:

- `webinarId`
- `webinarTitle`
- `webinarDate`
- `name`
- `email`
- `studentEmail`
- `phone`
- `qualification`
- `intake`
- `planningYear`
- `attendanceStatus`
- `status`
- `createdAt`

### 7.6 `orders`

Purpose:

- stores paid plan or webinar order records shown in admin and student dashboards

Main fields:

- `userId`
- `name`
- `email`
- `phone`
- `itemType`
- `itemId`
- `title`
- `amountLabel`
- `amountValue`
- `status`
- `paymentMode`
- `createdAt`
- `updatedAt`

Important implementation detail:

- `createOrder` exists in `src/lib/orderStore.ts`
- no public page currently calls `createOrder`
- there is no active checkout or payment gateway flow in the current UI

### 7.7 `blogPosts`

Purpose:

- powers `/blog`, `/blog/:slug`, and home page blog previews

Important behavior:

- if `blogPosts` does not exist in Realtime Database, the app uses built-in fallback blog posts from `src/lib/blogStore.ts`
- admin can later save edited or new posts into the DB

### 7.8 `pricingPlans`

Purpose:

- powers home page pricing/resource teaser content

Important behavior:

- if `pricingPlans` does not exist in Realtime Database, the app uses built-in fallback plans from `src/lib/pricingStore.ts`
- admin can CRUD plans in the dashboard
- the main `/pricing` page itself does not read these DB plans and instead uses its own hardcoded page-specific pricing cards

### 7.9 `siteContent`

Subpaths:

- `siteContent/universities`
- `siteContent/testimonials`
- `siteContent/settings`

Important behavior:

- if these paths do not exist yet, the app uses built-in fallback defaults
- fallback defaults are returned in memory and are not automatically seeded into the database until an admin saves changes

## 8. Authentication, Session, and Access Control

### 8.1 Student Access

Student registration flow:

1. User registers on `/register`
2. Firebase Auth account is created
3. Display name is updated in Firebase Auth
4. A default student profile is written to `students/{uid}`
5. Student is immediately signed out
6. Student is redirected to `/login`
7. Student sees a notice to wait for admin verification

Student login flow:

1. User logs in on `/login`
2. `rememberMe` decides Firebase local or session persistence
3. Student profile is loaded from `students/{uid}`
4. If `isApproved` is false, the user is signed out and sent back to `/login`
5. If approved, the user is redirected to `/dashboard`

### 8.2 Admin Access

Admin login flow:

1. User signs in with Firebase Auth on `/admin`
2. App loads `admins/{uid}`
3. If `isAdmin` is not true, the user is signed out
4. If `isAdmin` is true, the user is redirected to `/admin/dashboard`

### 8.3 Route Guards

- `ProtectedRoute` protects `/dashboard`
- `AdminProtectedRoute` protects `/admin/dashboard`

### 8.4 Session Behavior

From `AuthProvider` and `authSession.ts`:

- inactivity timeout: 30 minutes
- when inactive too long, user is automatically signed out
- auth notices are stored in session storage
- remember-me preference is stored in local storage

## 9. Shared Layout and UI Behavior

Global behavior:

- routes are lazy loaded in `src/App.tsx`
- page transitions use `AnimatePresence`
- `ScrollToTop` resets scroll position between routes
- `useSeo` updates `document.title`, meta description, and basic Open Graph tags

Navigation:

- `Navbar` shows dropdowns for About Germany and Services
- when a student is logged in, navbar loads the student profile and shows dashboard/logout actions
- mobile navigation mirrors the same route groups

Global CTA:

- `WhatsAppFloat` appears across most pages
- it reads `siteContent/settings` for WhatsApp number and prefilled message

## 10. Route-by-Route Documentation

### 10.1 Core Public Pages

- `/`
  - File: `src/pages/Index.tsx`
  - Purpose: main landing page.
  - Reads: blog posts, site settings, testimonials, universities, pricing plans.
  - Writes: none.
  - Main sections: hero video, benefits of German public universities, service overview, 6-step process, testimonials, universities preview, pricing teaser, webinar teaser, blog preview, Instagram teaser, final CTA.
  - Working detail: uses DB-backed/fallback content for blog, pricing, universities, testimonials, and settings.

- `/services`
  - File: `src/pages/Services.tsx`
  - Purpose: service hub page for the main BVF offer ladder.
  - Reads: `serviceCatalog`, site settings.
  - Writes: none.
  - Working detail: home-like service cards link to dynamic `/services/:slug` pages from `serviceCatalog`.

- `/services/:slug`
  - File: `src/pages/ServicePage.tsx`
  - Purpose: generic service detail route for catalog-driven services.
  - Reads: `serviceCatalog`, site settings.
  - Writes: none.
  - Working detail: powers routes like `/services/profile-verification`, `/services/university-verification`, `/services/application-support`, `/services/sop-lor-writing`, `/services/ielts-preparation`, `/services/visa-guidance`, `/services/pre-departure-support`, and `/services/accommodation-help`.
  - Student dashboard alignment: the same `serviceCatalog` IDs are used to build student service progress records.

- `/about`
  - File: `src/pages/About.tsx`
  - Purpose: primary brand story page.
  - Reads: site settings and testimonials.
  - Writes: none.
  - Working detail: explains BVF mission, vision, founder story, differentiators, stats, testimonial proof, and community channels.

- `/about-germany`
  - File: `src/pages/AboutGermany.tsx`
  - Purpose: Germany destination explainer page.
  - Reads: site settings.
  - Writes: none.
  - Working detail: explains zero tuition, public-university benefits, cost breakdown, student fit, common myths, study pathway, and CTA into tools/bookings.

- `/contact`
  - File: `src/pages/Contact.tsx`
  - Purpose: direct inquiry and contact page.
  - Reads: site settings, current logged-in student profile.
  - Writes: creates `leads` records with `source: "contact"`.
  - Working detail: prefills form for logged-in students, includes honeypot field, has a 30-second local anti-spam timer, and exposes WhatsApp/email/phone/social contact blocks.

- `/faqs`
  - File: `src/pages/FAQs.tsx`
  - Purpose: static FAQ page for APS, visa, blocked account, and general Germany questions.
  - Reads: none.
  - Writes: none.
  - Working detail: accordion-only informational page.

- `/blog`
  - File: `src/pages/Blog.tsx`
  - Purpose: blog listing page.
  - Reads: `blogPosts`.
  - Writes: none.
  - Working detail: filters to published posts only and allows category filtering.

- `/blog/:slug`
  - File: `src/pages/BlogPost.tsx`
  - Purpose: single blog post page.
  - Reads: `blogPosts`.
  - Writes: none.
  - Working detail: loads the published post by slug and renders content with a simple custom markdown renderer.

- `/pricing`
  - File: `src/pages/Pricing.tsx`
  - Purpose: pricing comparison and pricing inquiry page.
  - Reads: site settings, testimonials, current logged-in student profile.
  - Writes: creates `leads` records with `source: "pricing"`.
  - Working detail: page cards are hardcoded inside the page, not pulled from `pricingPlans` DB records; inquiry form captures selected package into metadata.

- `/universities`
  - File: `src/pages/Universities.tsx`
  - Purpose: public university showcase page.
  - Reads: `siteContent/universities`.
  - Writes: none.
  - Working detail: displays published universities only.

- `/tools`
  - File: `src/pages/FreeTools.tsx`
  - Purpose: SEO lead-magnet page with self-serve utilities.
  - Reads: site settings.
  - Writes: creates `leads` records with `source: "tool"`.
  - Working detail: includes a CGPA-to-German-grade converter and an IELTS target-band estimator, then captures email for a free profile evaluation report.

- `/webinars`
  - File: `src/pages/Webinars.tsx`
  - Purpose: webinar registration and webinar replay page.
  - Reads: site settings, testimonials, current logged-in student profile.
  - Writes: creates `webinarRegistrations`.
  - Working detail: registration is free, replay player is YouTube-based, and the form is linked to the student account if logged in.

- `/bookings`
  - File: `src/pages/Bookings.tsx`
  - Purpose: consultation booking page.
  - Reads: site settings, testimonials, current logged-in student profile, optional `VITE_CALENDLY_URL`.
  - Writes: creates `bookings`.
  - Working detail: shows inline Calendly if configured, otherwise manual form; manual form has a 30-second local anti-spam timer.

### 10.2 Study in Germany Guide Pages

All pages below are powered by `StudyProgramPage` and are content-first informational pages with CTA buttons but no Firebase writes:

- `/about-germany/bachelor`
  - File: `src/pages/about-germany/BachelorGermany.tsx`
  - Focus: bachelors route, Studienkolleg, TestAS, language prep, popular universities, FAQ.

- `/about-germany/engineering`
  - File: `src/pages/about-germany/EngineeringGermany.tsx`
  - Focus: engineering tracks such as mechanical, automotive, electrical, AI and robotics, embedded systems, and energy systems.

- `/about-germany/ms`
  - File: `src/pages/about-germany/MsGermany.tsx`
  - Focus: MS programs, research-driven universities, common STEM specializations, and English-taught pathways.

- `/about-germany/mba`
  - File: `src/pages/about-germany/MbaGermany.tsx`
  - Focus: German MBA landscape, business schools, work-experience expectations, and management career paths.

### 10.3 Static Service Marketing Pages

All pages below are powered by `ServiceDetailPage` and are informational service landing pages with CTA buttons but no Firebase writes:

- `/services/india`
  - File: `src/pages/services/ServiceIndia.tsx`
  - Focus: counseling in India, admission support, SOP/LOR assistance, APS interview preparation.

- `/services/germany`
  - File: `src/pages/services/ServiceGermany.tsx`
  - Focus: on-ground Germany help, accommodation, insurance, visa extension, local registration, and after-arrival support.

- `/services/study-loan`
  - File: `src/pages/services/StudyLoanGermany.tsx`
  - Focus: education loan planning, lender comparisons, sanction guidance, and visa alignment.

- `/services/blocked-account`
  - File: `src/pages/services/GermanBlockedAccount.tsx`
  - Focus: blocked account explanation, amount requirement, providers, documents, and common mistakes.

- `/services/accommodation`
  - File: `src/pages/services/StudentAccommodation.tsx`
  - Focus: student housing search, contracts, deposits, and move-in support.

- `/services/health-insurance`
  - File: `src/pages/services/StudentHealthInsurance.tsx`
  - Focus: public vs private student insurance and enrollment proof.

- `/services/flight-tickets`
  - File: `src/pages/services/StudentFlightTickets.tsx`
  - Focus: student fares, baggage, and arrival coordination.

- `/services/fft`
  - File: `src/pages/services/FftFlyForexTravel.tsx`
  - Focus: flights, forex, and travel-readiness support.

### 10.4 About Detail Pages

These pages are mostly informational and help deepen trust in the BVF brand:

- `/about/bvf-germany`
  - File: `src/pages/about/BvfGermany.tsx`
  - Purpose: long-form company profile page with mission, support model, mentors, team members, Germany visits, and professor/partner highlights.
  - Working detail: custom page, not based on `AboutStoryPage`.

- `/about/expert-team`
  - File: `src/pages/about/ExpertTeam.tsx`
  - Purpose: counselors, mentors, visa specialists, language coaches, and support team overview.
  - Working detail: static showcase page.

- `/about/achievements`
  - File: `src/pages/about/Achievements.tsx`
  - Purpose: milestone and proof page covering student success, community growth, and trusted partnerships.

- `/about/german-university-visit`
  - File: `src/pages/about/GermanUniversityVisit.tsx`
  - Purpose: explains campus visits, faculty interactions, and how on-ground visits inform student guidance.

- `/about/german-professors`
  - File: `src/pages/about/GermanProfessorVisits.tsx`
  - Purpose: visiting professor sessions, guest lectures, Q and A, and collaboration opportunities.

- `/about/social-contribution`
  - File: `src/pages/about/SocialContribution.tsx`
  - Purpose: mentorship, resource-sharing, and community-impact page.

### 10.5 Auth and Dashboard Pages

- `/register`
  - File: `src/pages/Register.tsx`
  - Purpose: student account creation.
  - Writes: Firebase Auth user + `students/{uid}` default profile.
  - Working detail: signs user out immediately after registration and requires admin approval before later login.

- `/login`
  - File: `src/pages/Login.tsx`
  - Purpose: student login.
  - Reads: Firebase Auth + `students/{uid}`.
  - Writes: none directly beyond auth persistence/session behavior.
  - Working detail: blocks unapproved students and displays route/session notices.

- `/dashboard`
  - File: `src/pages/StudentDashboard.tsx`
  - Purpose: student-facing workspace.
  - Reads: student profile, bookings, webinars, orders.
  - Writes: student profile patching and document-link submission.
  - Working detail: merges profile timeline with booking activity, shows active services, document checklist, bookings, webinars, purchases, admin notes, and profile management.

- `/admin`
  - File: `src/pages/AdminLogin.tsx`
  - Purpose: admin sign-in page.
  - Reads: Firebase Auth + `admins/{uid}`.
  - Writes: admin `lastLoginAt` update on successful login.

- `/admin/dashboard`
  - File: `src/pages/AdminDashboard.tsx`
  - Purpose: internal operations dashboard.
  - Reads: all major Realtime Database collections plus blog/pricing/site content.
  - Writes: approvals, student service state, leads, bookings, webinars, orders, blog posts, pricing plans, universities, testimonials, site settings.

- `*`
  - File: `src/pages/NotFound.tsx`
  - Purpose: fallback 404 page.
  - Working detail: logs attempted bad route in the console and offers a link back to home.

## 11. Student Dashboard Detailed Working

`/dashboard` is the student journey tracker. It does all of the following:

- ensures the student profile exists with `ensureStudentProfile`
- subscribes to the student profile in real time
- queries bookings by both `studentEmail` and `email`
- queries webinar registrations by both `studentEmail` and `email`
- queries orders by `email`
- calculates active services, next actions, booking summaries, and activity timeline

Main student dashboard sections:

- hero summary with verification state
- KPI cards for enrolled services, upcoming bookings, document links, and purchase history
- next actions panel
- active service progress board
- required document checklist
- document link submission form
- consultation tracking
- purchase history
- profile management form
- admin notes
- recent activity timeline
- webinars and resource links

Student actions available inside the dashboard:

- edit name
- edit phone
- edit university preference
- edit profile photo URL
- submit document links for active services
- log out

Student actions not available from the dashboard:

- approve their own account
- change service status
- change order status
- change booking status

## 12. Admin Dashboard Detailed Working

The admin dashboard is tab-driven and currently supports these operational areas:

- `verification`
  - approve pending students

- `students`
  - view all students
  - toggle approval
  - add global student notes
  - enroll or unenroll service access
  - update service status
  - write service-specific admin notes
  - review submitted document links

- `leads`
  - review contact/pricing/tool leads
  - change lead status
  - delete leads

- `bookings`
  - review consultation requests
  - update booking status
  - add meeting link
  - add admin instructions
  - delete booking

- `webinars`
  - review webinar signups
  - change registration status
  - change attendance status

- `orders`
  - review purchase records
  - change order status

- `blog`
  - create, edit, publish, unpublish, and delete blog posts

- `pricing`
  - create, edit, publish, unpublish, and delete pricing plan records

- `universities`
  - create, edit, and delete university cards

- `testimonials`
  - create, edit, and delete testimonials

- `settings`
  - update contact email, phone, WhatsApp number, address, hero badge, hero title, hero description, and prefilled WhatsApp message

## 13. End-to-End Product Flows

### 13.1 Visitor to Lead

1. Visitor opens `/contact`, `/pricing`, or `/tools`
2. Visitor submits a form
3. A `leads` record is created
4. Admin sees the new lead in the `leads` tab
5. Admin changes status to `contacted`, `qualified`, or `closed`

### 13.2 Visitor to Booking

1. Visitor opens `/bookings`
2. Visitor either schedules through Calendly or submits the manual request form
3. A `bookings` record is created for manual requests
4. Admin sees the record in the `bookings` tab
5. Admin adds meeting link, instructions, and final status
6. If the booking belongs to a logged-in student, it appears in the student dashboard

### 13.3 Visitor to Webinar Registration

1. Visitor opens `/webinars`
2. Visitor submits the registration form
3. A `webinarRegistrations` record is created
4. Admin updates status and attendance
5. Matching students later see that registration in their dashboard

### 13.4 Student Registration to Verified Dashboard Access

1. Student registers on `/register`
2. Student profile is created as unapproved
3. Student cannot enter `/dashboard`
4. Admin approves the student in the `verification` or `students` tab
5. Student logs in on `/login`
6. Student can now access `/dashboard`

### 13.5 Student Service Tracking

1. Admin enrolls one or more services for a student
2. Admin updates service status and admin notes
3. Student sees those updates in the dashboard in real time
4. Student submits document links back into the same service record
5. Timeline and document count update automatically

## 14. SEO, Routing, and Public Discovery

SEO-related pieces:

- `useSeo` updates title and basic meta tags on most major pages
- `public/robots.txt` allows all crawlers and points to the sitemap
- `public/sitemap.xml` contains major public routes

Current sitemap coverage note:

- sitemap includes many static public routes
- sitemap does not include dynamic service-catalog routes such as `/services/profile-verification`
- sitemap does not include blog post detail URLs
- sitemap does not include student/admin auth or dashboard routes

## 15. Current Implementation Notes and Caveats

These are important for future maintenance because they affect how the app behaves today:

- Firebase config is hardcoded in `src/lib/firebase.ts`; there is no `.env` based Firebase setup.
- Firestore is configured in Firebase files but not used by the app.
- Analytics measurement ID exists in config, but Analytics is not initialized in the frontend.
- `siteContent.settings.heroBadge`, `heroTitle`, and `heroDescription` can be edited in admin settings, but the current home page does not actually consume those fields.
- Admin settings UI does not currently expose `instagramUrl` or `youtubeUrl`, even though some public pages read them.
- Footer contact details and footer social links are hardcoded and do not read `siteContent/settings`.
- `/faqs` uses a hardcoded WhatsApp link instead of site settings.
- `/pricing` uses a hardcoded pricing page model, while admin pricing CRUD updates `pricingPlans` used elsewhere.
- `orders` are viewable in admin and student dashboards, but the current public UI has no checkout flow and does not create orders.
- Home page webinar teaser is hardcoded to `April 12, 2026, 7:30 PM IST`, while `/webinars` is hardcoded to `April 10, 2026, 7:00 PM IST`.
- `BlogPost.tsx` uses a very simple markdown renderer; headings, list lines, and bold text render, but richer markdown is not fully supported.
- If blog, pricing, universities, testimonials, or settings data is missing in Realtime Database, fallback content from local store files is used without auto-seeding the database.

## 16. Key Files

Core app:

- `src/App.tsx`
- `src/main.tsx`

Firebase and data:

- `src/lib/firebase.ts`
- `src/lib/dbPaths.ts`
- `src/lib/studentStore.ts`
- `src/lib/adminStore.ts`
- `src/lib/leadStore.ts`
- `src/lib/bookingStore.ts`
- `src/lib/webinarStore.ts`
- `src/lib/orderStore.ts`
- `src/lib/blogStore.ts`
- `src/lib/pricingStore.ts`
- `src/lib/siteContentStore.ts`
- `src/lib/serviceCatalog.ts`

Auth and route protection:

- `src/components/AuthProvider.tsx`
- `src/components/ProtectedRoute.tsx`
- `src/components/AdminProtectedRoute.tsx`
- `src/lib/authSession.ts`

Dashboards:

- `src/pages/StudentDashboard.tsx`
- `src/pages/AdminDashboard.tsx`

Key public forms:

- `src/pages/Contact.tsx`
- `src/pages/Pricing.tsx`
- `src/pages/FreeTools.tsx`
- `src/pages/Webinars.tsx`
- `src/pages/Bookings.tsx`
- `src/pages/Register.tsx`
- `src/pages/Login.tsx`
- `src/pages/AdminLogin.tsx`

Firebase deployment config:

- `firebase.json`
- `database.rules.json`
- `firestore.rules`
- `firestore.indexes.json`

## 17. Testing Status

Current test setup exists but coverage is minimal:

- `src/test/setup.ts` sets up JSDOM helpers
- `src/test/example.test.ts` is only a placeholder passing test

That means the application is primarily documented and validated through code structure and runtime behavior rather than a mature automated test suite.





































Firebase Rules :


{
  "rules": {
    ".read": false,
    ".write": false,

    "admins": {
      ".read": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true",
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('admins').child(auth.uid).child('isAdmin').val() === true)",
        ".write": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true"
      }
    },

    "students": {
      ".read": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true",
      ".indexOn": ["email", "status", "createdAt"],
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('admins').child(auth.uid).child('isAdmin').val() === true)",
        ".write": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || (auth.uid === $uid && ((!data.exists() && newData.child('uid').val() === auth.uid && newData.child('role').val() === 'student' && newData.child('status').val() === 'pending_approval' && newData.child('isApproved').val() === false) || (data.exists() && newData.child('status').val() === data.child('status').val() && newData.child('isApproved').val() === data.child('isApproved').val() && newData.child('approvedBy').val() === data.child('approvedBy').val() && newData.child('approvedAt').val() === data.child('approvedAt').val() && newData.child('rejectionReason').val() === data.child('rejectionReason').val() && newData.child('role').val() === data.child('role').val()))))",
        "uid": {
          ".validate": "newData.isString()"
        },
        "name": {
          ".validate": "newData.isString()"
        },
        "email": {
          ".validate": "newData.isString()"
        },
        "phone": {
          ".validate": "newData.isString() || !newData.exists()"
        },
        "role": {
          ".validate": "newData.val() === 'student'"
        },
        "status": {
          ".validate": "newData.val() === 'pending_approval' || newData.val() === 'approved' || newData.val() === 'rejected' || newData.val() === 'suspended'"
        },
        "isApproved": {
          ".validate": "newData.isBoolean()"
        },
        "approvedBy": {
          ".validate": "!newData.exists() || newData.isString() || newData.val() === null"
        },
        "approvedAt": {
          ".validate": "!newData.exists() || newData.isString() || newData.val() === null"
        },
        "rejectionReason": {
          ".validate": "!newData.exists() || newData.isString() || newData.val() === null"
        },
        "universityPreference": {
          ".validate": "newData.isString() || !newData.exists()"
        },
        "profilePhoto": {
          ".validate": "newData.isString() || !newData.exists()"
        },
        "services": {
          ".validate": "true"
        },
        "adminNotes": {
          ".validate": "true"
        },
        "timeline": {
          ".validate": "true"
        },
        "createdAt": {
          ".validate": "newData.isString()"
        },
        "updatedAt": {
          ".validate": "newData.isString()"
        }
      }
    },

    "notifications": {
      ".read": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || (query.orderByChild === 'userId' && query.equalTo === auth.uid))",
      ".indexOn": ["userId", "createdAt", "read"],
      "$notificationId": {
        ".read": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || data.child('userId').val() === auth.uid)",
        ".write": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || (data.exists() && data.child('userId').val() === auth.uid))"
      }
    },

    "auditLogs": {
      ".read": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true",
      "$logId": {
        ".read": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true",
        ".write": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true"
      }
    },

    "leads": {
      ".read": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true",
      ".indexOn": ["email", "studentEmail", "status", "createdAt"],
      "$leadId": {
        ".read": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true",
        ".write": "true"
      }
    },

    "bookings": {
      ".read": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || (query.orderByChild === 'email' && query.equalTo === auth.token.email) || (query.orderByChild === 'studentEmail' && query.equalTo === auth.token.email))",
      ".indexOn": ["email", "studentEmail", "createdAt"],
      "$bookingId": {
        ".read": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || data.child('email').val() === auth.token.email || data.child('studentEmail').val() === auth.token.email)",
        ".write": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || (!data.exists() && (newData.child('email').val() === auth.token.email || newData.child('studentEmail').val() === auth.token.email)))"
      }
    },

    "webinarRegistrations": {
      ".read": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || (query.orderByChild === 'email' && query.equalTo === auth.token.email) || (query.orderByChild === 'studentEmail' && query.equalTo === auth.token.email))",
      ".indexOn": ["email", "studentEmail", "createdAt"],
      "$registrationId": {
        ".read": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || data.child('email').val() === auth.token.email || data.child('studentEmail').val() === auth.token.email)",
        ".write": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || (!data.exists() && (newData.child('email').val() === auth.token.email || newData.child('studentEmail').val() === auth.token.email)))"
      }
    },

    "orders": {
      ".read": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || (query.orderByChild === 'email' && query.equalTo === auth.token.email))",
      ".indexOn": ["email", "createdAt", "status"],
      "$orderId": {
        ".read": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || data.child('email').val() === auth.token.email)",
        ".write": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || (!data.exists() && newData.child('email').val() === auth.token.email))"
      }
    },

    "webinars": {
      ".read": true,
      "$webinarId": {
        ".write": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true"
      }
    },

    "blogPosts": {
      ".read": true,
      "$postId": {
        ".write": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true"
      }
    },

    "pricingPlans": {
      ".read": true,
      "$planId": {
        ".write": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true"
      }
    },

    "siteContent": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true"
    },

    "studentDeadlines": {
      ".read": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || (query.orderByChild === 'userId' && query.equalTo === auth.uid) || (query.orderByChild === 'email' && query.equalTo === auth.token.email))",
      ".indexOn": ["userId", "email", "status", "dueDate"],
      "$deadlineId": {
        ".read": "auth != null && (root.child('admins').child(auth.uid).child('isAdmin').val() === true || data.child('userId').val() === auth.uid || data.child('email').val() === auth.token.email)",
        ".write": "auth != null && root.child('admins').child(auth.uid).child('isAdmin').val() === true"
      }
    }
  }
}
