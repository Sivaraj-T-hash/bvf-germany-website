# BVF Germany Website

BVF Germany is a study-in-Germany consultancy website for Indian students. It combines:

- a public marketing site
- free planning tools
- enquiry, booking and webinar forms
- a resource store with manual payment confirmation
- a student dashboard that tracks each student's journey
- an admin dashboard where the BVF team runs operations

- **Frontend:** React 18 + TypeScript + Vite, served from Firebase Hosting.
- **Data and sign-in:** Firebase Authentication and Firebase Realtime Database, used directly from the browser.
- **Backend API:** a small Express server (`server/`) for password reset, form and order emails, and admin email broadcasts, deployed on Render.

> **Before going live:**
> 1. Deploy the database rules (`npx firebase-tools deploy --only database`). Until then, signed-out visitors cannot submit forms on the live site.
> 2. Redeploy the API on Render.
> 3. Build and deploy hosting.
>
> Several parts of the site stay hidden until BVF supplies real information (WhatsApp number, success stories, German course details and more). See **[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)** for what is needed and where it goes.

## Contents

1. [Feature status at a glance](#1-feature-status-at-a-glance)
2. [What the website does](#2-what-the-website-does)
3. [Architecture](#3-architecture)
4. [Project structure](#4-project-structure)
5. [Getting started](#5-getting-started)
6. [Environment variables](#6-environment-variables)
7. [Firebase setup](#7-firebase-setup)
8. [Deployment](#8-deployment)
9. [Backend API](#9-backend-api)
10. [Data model and access rules](#10-data-model-and-access-rules)
11. [Adding BVF's content](#11-adding-bvfs-content)
12. [Known issues](#12-known-issues)
13. [How this was tested](#13-how-this-was-tested)

---

## 1. Feature status at a glance

Results of the retest on 11 Nov 2026, described in [section 13](#13-how-this-was-tested).

| Area | Status | Notes |
|---|---|---|
| Public pages | Works | Every route renders, with no console errors and no dead internal links. Each key page has one `<h1>`. No horizontal scrolling at 390, 768, 1024, 1280 or 1366 px. |
| Public forms, **signed out** (7 forms) | Works | Saved with a consent timestamp, and BVF is emailed. **Needs the rules deployed** to work on the live site. |
| The same forms, signed in | Works | Pre-filled from the student profile. |
| CGPA to German grade converter | Works | e.g. 8.2/10 → 1.90. Rejects scales of 4 or below. |
| IELTS & bank requirements checker | Partly | Steps 1–4 work. The final result is shown only to a newly registered student in their first session. |
| Student registration (email and password) | Works | A consent checkbox is required, including for Google sign-up. A welcome email is sent. |
| Google sign-up and sign-in | Not tested | Needs a real browser popup. |
| Login, suspended and pending accounts | Works | Pending, rejected and suspended students see a message explaining why. |
| Refreshing `/dashboard` or `/admin/dashboard` | Works | The user stayed signed in (3 of 3 tries each). |
| Forgot password (6-digit email code) | Works | There is still no limit on wrong guesses. |
| Student dashboard, including the deadline calendar | Works | |
| Resource store and paid webinars | Works (manual payment) | The order is saved as **payment pending**. An admin marks it paid. There is no online payment gateway. |
| Admin dashboard | Works | New "Payments to confirm" list and a full contact Settings form. There is still no screen to view leads or bookings. |
| WhatsApp buttons and contact details | Works | Hidden until a real number or detail is saved in Admin → Settings. Tested with a sample number. |
| Production build and per-route SEO pages | Works | 46 pre-rendered HTML pages, a sitemap and robots.txt. |
| Lint (`npm run lint`) | Passes | |
| Type check (`npx tsc -p tsconfig.app.json --noEmit`) | Passes | 0 errors (13 before). |
| Unit tests (`npm test`) | Placeholder only | One `expect(true)` test. |

---

## 2. What the website does

### 2.1 Who uses it

| User | What they do |
|---|---|
| Visitor | Reads guides, uses the free tools, contacts BVF (form or WhatsApp), books a consultation, registers for webinars. |
| Student (signed in) | Tracks their services and documents, sees deadlines and messages from BVF, orders resources, joins webinars. |
| Admin (BVF team) | Reviews students and documents, assigns deadlines, publishes blogs and webinars, confirms payments, delivers resources, edits contact settings. |

### 2.2 Content rules

The site follows the BVF audit brief:

- **No stock or AI-generated photos.** All Unsplash and Pexels images and the stock hero video were removed. Where a photo is missing, the site shows a branded graphic (`BrandVisual`). People without a photo are shown with their initials.
- **No invented content.** Fabricated statistics, testimonials, ratings, student names, "was" prices and partnership claims were removed.
- **No placeholder contact details.** Every contact detail comes from Admin → Settings, with defaults in `src/config/business.ts`. Each one is hidden while it is empty. Values that look like placeholders, such as `99999 99999` or a bare `instagram.com`, are also hidden (`src/lib/contact.ts`).
- **Hidden until provided.** Success stories, German course details, webinar replays, Terms and the Refund policy live in `src/content/`. Each section appears automatically once data is added. See [section 11](#11-adding-bvfs-content).

### 2.3 Public pages

| Route | Page | What it does |
|---|---|---|
| `/` | Home | A branded hero with an eligibility button, links to the free tools and a WhatsApp button. A welcome popup appears once per browser session. Below that: services, a "leading public universities" strip (reference only, not partners), student stories, pricing, the next scheduled webinar, blog previews, and booking calls to action. "Watch Our Story" and the Instagram card appear only when those URLs are set. |
| `/about` | About | Founder profile with photo (Adharsh Bratlin, MSc in Space Engineering, Universität Bremen), mission, differentiators, student stories and social links. |
| `/about/bvf-germany`, `/about/expert-team`, `/about/achievements`, `/about/german-university-visit`, `/about/german-professors`, `/about/social-contribution` | About detail pages | Team, mentors, visiting professors, visits and community work. They contain no statistics. |
| `/about-germany` | Study in Germany | Zero-tuition explainer, costs, myths and pathway. |
| `/about-germany/bachelor`, `/engineering`, `/ms`, `/mba`, `/ausbildung` | Study guides | Long-form guides built on `StudyProgramPage`. |
| `/dmat` | dMAT exam guide | Introduction, eligibility, test structure, scoring, registration, preparation and FAQs. It explains how the dMAT differs from TestAS and links to the official sources. It ends with a "Get dMAT Guidance from BVF" enquiry form. The facts were checked against d-mat.de and APS India on 11 Nov 2026 (`CHECKED_ON` in `src/pages/Dmat.tsx`). |
| `/german-language` | German classes | CEFR levels A1–B2 and an enquiry form. Trainers, timings, fees, batch size, materials, photos and feedback appear once they are added to `src/content/germanCourse.ts`. |
| `/services` | Services hub | The core services in the order students usually need them. |
| `/services/:slug` | Service detail | Driven by `src/lib/serviceCatalog.ts`. Each page has a WhatsApp button with a service-specific message, and shows a related success story once one exists. `germany-language` redirects to `/german-language`. An unknown slug redirects to `/services`. |
| `/services/india`, `/germany`, `/study-loan`, `/blocked-account`, `/accommodation`, `/health-insurance`, `/flight-tickets`, `/fft` | Extra service pages | Static landing pages built on `ServiceDetailPage`. `/services/blocked-account` is kept but no longer linked from the home page or menus, pending BVF's decision. |
| `/success-stories`, `/success-stories/:id` | Student stories | Shows only stories with recorded consent. Until the first one is added, it says "Student stories are on their way". |
| `/universities` | Universities | Published university cards from the database, or three built-in examples with university logos. |
| `/blog`, `/blog/:slug` | Blog | Published posts with a category filter. The renderer handles headings, `-` lists, `**bold**`, links and images. It does not inject raw HTML. |
| `/faqs` | FAQs | APS, visa, blocked account, dMAT and general questions. |
| `/pricing` | Pricing | Profile Verification (free), Self-Preparation Toolkit (INR 999) and Full Consultation (custom), with a comparison table, FAQ and an inquiry form. |
| `/resources` | Resource store | Digital products. "Buy Now" opens checkout. |
| `/checkout` | Checkout | Places an order with payment pending (see [2.6](#26-resource-store-and-checkout)). |
| `/tools`, `/tools/cgpa-to-german-grade-converter`, `/tools/ielts-bank-requirements-checker` | Free tools | One page with three URLs. Each URL changes the SEO text and the order of the tools. |
| `/webinars` | Webinars | The next scheduled webinar, or "Date to be announced", plus a registration form. Replays appear once they are added to `src/content/webinarReplays.ts`. |
| `/bookings` | Free consultation | An inline Calendly widget if `VITE_CALENDLY_URL` is set, and a request form either way. |
| `/contact` | Contact | Contact details from Settings, each shown only when set, plus a contact form. |
| `/privacy-policy` | Privacy Policy | Drafted from the data the site actually collects. BVF must review it. |
| `/terms`, `/refund-policy` | Legal pages | Show "not found" until their text is added to `src/content/legal.ts`. The footer links appear at the same time. |
| `*` | 404 | A "page not found" page with a link home. |

Site-wide features:

- **Navbar:** dropdowns for About Germany (including Master's and dMAT) and Services (including dMAT guidance), a "German Classes" link and an account menu. The full menu shows at 1280 px and wider; below that, a menu button opens it.
- **Floating WhatsApp button:** appears only when a WhatsApp number is set.
- **Footer:** contact details and social links from Settings, the service links and the legal links.
- **Error boundary:** if a page crashes, visitors see a "Reload / Go home" message instead of a blank screen.

### 2.4 Free tools

**CGPA to German Grade Converter** uses the modified Bavarian formula with a passing grade of 4:

```
German grade = 1 + 3 × (max CGPA − your CGPA) / (max CGPA − 4)     (clamped to 1.0–4.0)
```

The result is labelled Excellent (≤ 1.5), Good (≤ 2.5), Average (≤ 3.5) or "Needs stronger support". The maximum must be greater than 4, and the CGPA cannot exceed it.

**IELTS Bank Requirements Checker** is a 5-step wizard:

1. Destination (Germany, UK or Canada), visa type, course level and intake. Intake years are computed from today's date.
2. The four IELTS band scores, compared with the course's overall and per-section minimums.
3. City cost level, funding source, tuition and amount already paid.
4. Bank balance, how long the funds have been held, the account owner and the document type.
5. The result (Eligible, Conditionally Eligible, Needs More Funds, Missing Documents or Not Eligible), with next actions. **This step is shown only to a newly registered student during their first session.**

Below the tools, a "Get FREE Profile Evaluation" form saves a lead.

### 2.5 Forms and what they create

Every public form has:

- a **required consent checkbox** linking to the Privacy Policy, stored as `consentAt`
- a hidden honeypot field
- a minimum fill time of 2.5 seconds
- a 30-second limit between submissions of the same form in one browser (`src/lib/formGuard.ts`)

The email API also limits each IP address to 20 requests per 10 minutes.

| Form | Saves to | Emails sent |
|---|---|---|
| Contact (`/contact`) | `leads` (source `contact`) | Admin and visitor |
| Pricing inquiry (`/pricing`) | `leads` (source `pricing`, with the chosen package) | Admin and visitor |
| Free profile evaluation (`/tools`) | `leads` (source `tool`) | Admin and visitor |
| Consultation request (`/bookings`) | `bookings` | Admin and visitor |
| Webinar registration (`/webinars`) | `webinarRegistrations` | Admin and visitor |
| German course enquiry (`/german-language`) | `leads` (`metadata.enquiryType: german-course`) | Admin and visitor |
| dMAT guidance enquiry (`/dmat`) | `leads` (`metadata.enquiryType: dmat`) | Admin and visitor |
| Student sign-up (`/register`) | Auth user, `students/{uid}`, a `leads` record | Welcome email (once) |
| Order (`/checkout`) | `orders` (status `pending`) | Admin and student |

If a student is signed in, the forms are pre-filled from their profile. Bookings, webinars and orders also appear on their dashboard timeline. Email sending is best-effort: if the API is down, the record is still saved and the form still shows success.

### 2.6 Resource store and checkout

There is no online payment gateway. Payment is confirmed by hand:

1. `/resources` lists published packages from `resourcePackages`. If none exist in the database, it shows four built-in ones: Bachelor's in Germany bundle (INR 2,499), BVF Selfhelp Tool (INR 1,450), University Excel Sheet (INR 499) and Personal Appointment (INR 999).
2. "Buy Now" opens `/checkout`. Signed-out users are asked to log in first.
3. The price always comes from the catalog. A `price` in the URL is ignored.
4. The student ticks the consent box and clicks **Place order**. An `orders` record is created with status `pending`. BVF and the student are emailed, and the student sees "Order placed. Payment pending."
5. BVF sends the payment details. Once payment arrives, an admin opens **Resources → Payments to confirm** and clicks **Mark as paid** or **Cancel**. The student is notified.
6. The admin attaches a Google Drive link to the paid order. The student then sees an "Open resource" button under Resources.

Paid webinars use the same flow. The webinar registration is created with the order and linked to it. The meeting link is shared only with paid registrations.

The database rules let a student create only their own `pending` order. Only an admin can change an order's status or attach a resource link.

### 2.7 Student accounts

- **Register** with email and password (6 or more characters) or with Google, after agreeing to the privacy policy. The profile is created as `approved`, so the student lands on `/dashboard` straight away.
- **Login** supports "Remember me". Pending, rejected and suspended students are signed out with an explanation. A Google login without a student profile is deleted, and the user is asked to register first.
- **Forgot password:** the API emails a 6-digit code that is valid for 15 minutes and can be used once.
- **Inactivity:** students are signed out after 30 minutes without activity.
- **Account status** is one of `pending_approval`, `approved`, `rejected` or `suspended`. Only an admin can change it.

### 2.8 Student dashboard (`/dashboard`)

| Section | What it shows or does |
|---|---|
| Overview | Welcome banner, current stage, journey completion %, deadlines, pending documents and webinars, a 7-stage journey tracker, today's focus, an applications snapshot, a deadline calendar, the latest mentor message, and recommended blogs and webinars. |
| My Journey | Seven stages (Profile Setup → Pre-departure). Each maps to a service and offers to enroll it. |
| Universities | Published universities with text filters and a compare toggle. |
| Applications | All services. The student can start one and change its stage. |
| Documents | Submit a document **link** (name and URL, not a file upload) for a service, and see its review status. |
| Blogs | Published posts. |
| Webinars | The student's registrations, a "Join webinar" link once the admin shares it, and upcoming sessions. |
| Mentor Chat | Read-only list of the admin's notes. |
| Resources | Ordered resources with their payment and delivery status, and a Drive link once delivered. |
| Profile | Edit name, phone, target course and intake, and profile photo URL. |

The header has a search box (press `/`), a notifications panel, the deadline calendar and a "Book session" link.

### 2.9 Admin dashboard (`/admin/dashboard`)

| Tab | What it does |
|---|---|
| Overview | KPIs, pipeline summary, urgent actions, pending approvals and a per-student activity feed. |
| Students | Filter, export CSV, approve, keep pending, reject or suspend (with audit log and student notification), internal notes, deadlines. |
| Pipeline | Students grouped into Onboarding, Preparation, Applications, Visa and Departure. |
| Documents Review | Approve, reject or request changes. Documents waiting over 2 days count as escalations. |
| Applications | Set the stage of each service a student is enrolled in. |
| Blogs | List published posts and drafts, and delete them. |
| Webinars | Share a meeting link, delete a webinar with its registrations, and mark attendance. |
| Resources | **Payments to confirm** (mark pending orders paid or cancelled), package management, order filters, Drive delivery and delivery history. |
| Reports | Leads vs approved students, service progress, students near the final stages, orders vs paid orders. |
| Settings | WhatsApp number, phone, email, Instagram URL, YouTube URL, working hours, address and the default WhatsApp message. Saved values appear across the site immediately. |

Header quick actions: **Add Student**, **Create Blog**, **Create Webinar** and **Create Package**. Blogs and webinars can send a test email to the admin before notifying all students.

### 2.10 Emails (sent by the backend)

| Trigger | Recipient | Subject |
|---|---|---|
| Student signs up | Student | Welcome to BVF Germany (once per student) |
| Contact, German course or dMAT enquiry | Admin + visitor | New contact inquiry received / We received your contact inquiry |
| Pricing inquiry | Admin + visitor | New pricing inquiry received / We received your pricing inquiry |
| Free profile evaluation | Admin + visitor | New free profile evaluation request / Your free profile evaluation request |
| Consultation request | Admin + visitor | New consultation booking request / Your consultation request is received |
| Webinar registration | Admin + visitor | New webinar registration received / Your webinar registration is confirmed |
| Order placed | Admin + student | New order to confirm: *title* / Your BVF Germany order is placed – payment pending |
| Forgot password | Student | Your BVF Germany password reset code |
| Admin publishes a blog or creates a webinar | Every student with an email | New blog / New webinar from BVF Germany: *title* |

All user-supplied text in emails is HTML-escaped.

### 2.11 SEO

- `scripts/seo-routes.mjs` lists the public routes with titles, descriptions, keywords and structured data. It includes `/dmat`, `/german-language` and `/privacy-policy`.
- `npm run build` regenerates `public/sitemap.xml` and `public/robots.txt`, builds, then writes `dist/<route>/index.html` for each route with its own meta tags, canonical URL and JSON-LD.
- At runtime, `useSeo` updates the same tags. Account, checkout and dashboard pages are `noindex`.
- **When you add a page**, add it to `src/App.tsx` and to `scripts/seo-routes.mjs`.

---

## 3. Architecture

```
Browser (React SPA, Firebase Hosting)
  |-- Firebase Auth ............ email/password + Google sign-in
  |-- Realtime Database ........ all app data, read/written directly, guarded by database.rules.json
  '-- /api/* ------------------> Express API (Render)
                                   |-- Firebase Admin SDK: Auth, Realtime Database, Firestore (reset flags)
                                   '-- Email: Resend HTTP API or SMTP (nodemailer)
```

| Layer | Technology |
|---|---|
| UI | React 18.3, TypeScript 5.8, Vite 5.4 (SWC), React Router 6, Tailwind CSS 3.4, shadcn/ui on Radix, Framer Motion, GSAP, lucide-react |
| Forms | React Hook Form + Zod |
| Data | Firebase JS SDK 12 (Auth, Realtime Database) |
| API | Express 4, firebase-admin 13, nodemailer 7, Resend HTTP API |
| Tooling | ESLint 9, Vitest 3 + Testing Library |

Most pages are lazy-loaded in `src/App.tsx`. Data is read with Firebase listeners. `AuthProvider` tracks which user each profile was loaded for, so the route guards wait for the right profile before deciding.

---

## 4. Project structure

```
├── index.html                 App shell
├── firebase.json              Hosting (dist, SPA rewrite) + database/firestore rule files
├── .firebaserc                Firebase project: bvf-student-support
├── database.rules.json        Realtime Database security rules (source of truth; deploy after changes)
├── firestore.rules            Denies all client access (server uses the Admin SDK)
├── LAUNCH_CHECKLIST.md        What BVF must supply, deployment steps, final QC
├── .env.example               Local frontend + backend variables
├── render.env.example         Backend variables for Render
├── public/                    Static files; sitemap.xml and robots.txt are generated
├── scripts/
│   ├── dev-all.js             `npm start`: runs API + Vite together
│   ├── seo-routes.mjs         SEO metadata for every public route
│   ├── prepare-seo.mjs        Writes sitemap.xml and robots.txt (prebuild)
│   └── postbuild-seo.mjs      Writes per-route index.html files into dist/
├── server/
│   ├── server.js              Express app, CORS, routes, 20 KB body limit
│   ├── firebaseAdmin.js       Admin SDK initialisation
│   ├── controllers/           authController.js, notificationController.js
│   ├── routes/                authRoutes.js, notificationRoutes.js
│   └── services/              mailService.js, rateLimit.js, tempPasswordService.js, studentAccessService.js
└── src/
    ├── App.tsx                Routes, wrapped in an error boundary
    ├── config/business.ts     Default contact details and the founder profile
    ├── content/               Success stories, German course, legal texts, webinar replays (hidden while empty)
    ├── components/            Layout, guards, AuthProvider, BrandVisual, WhatsAppCta, EnquiryForm, ConsentCheckbox, ui/
    ├── hooks/                 use-site-settings and others
    ├── lib/                   Firebase client, one "store" module per data path, contact and form-guard helpers, SEO, catalogs
    ├── pages/                 One file per route; about/, about-germany/, services/ sub-pages
    ├── assets/                Images, including the founder photo (adharsh-bratlin.jpg)
    └── test/                  Vitest setup + placeholder test
```

---

## 5. Getting started

**Requirements:** Node.js 18 or newer (tested with Node 22.15 and npm 11) and access to the Firebase project.

```bash
npm install
cp .env.example .env          # then fill in the values (see section 6)
```

| Command | What it runs |
|---|---|
| `npm run dev` | Frontend only, at http://localhost:8080. `/api` is proxied to `VITE_DEV_API_PROXY_TARGET` (default http://localhost:5000). |
| `npm run server` | Backend API only (default port 5000). |
| `npm start` | Both together. If either one exits, the other is stopped too. |
| `npm run build` | Generate the sitemap, build to `dist/`, then write per-route SEO pages. |
| `npm run preview` | Serve the built `dist/` locally. |
| `npm run lint` | ESLint. |
| `npm test` | Vitest. |
| `npx tsc -p tsconfig.app.json --noEmit` | Type check. It passes, but it is not part of any script, and `vite build` does not type-check. Run it before deploying. |

> The API exits at startup if `MAIL_FROM`, the mail transport credentials or the Firebase service account are missing. To work on the frontend without backend secrets, use `npm run dev`. Pages and forms still work; only emails and password reset need the API.

The frontend always talks to the **real** Firebase project configured in `src/lib/firebase.ts`. Data you create while developing is live data.

---

## 6. Environment variables

**Frontend** (Vite; values are baked into the build):

| Variable | Purpose |
|---|---|
| `VITE_AUTH_API_BASE_URL` | Base URL of the API, e.g. `https://<service>.onrender.com`. Leave it empty to call `/api` on the same origin (the dev proxy). Put the production value in `.env.production`. |
| `VITE_DEV_API_PROXY_TARGET` | Dev server only: where `/api` is proxied. Default `http://localhost:5000`. |
| `VITE_CALENDLY_URL` | Optional. Shows the inline Calendly widget on `/bookings`. |
| `VITE_FIREBASE_DATABASE_TRANSPORT` | Optional: `auto` (default), `websocket` or `long-polling`, for restrictive networks. |

The Firebase web config is hard-coded in `src/lib/firebase.ts`. These values are public by design.

**Backend** (`server/`):

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | No | Default 5000 (Render uses 10000). |
| `CORS_ORIGIN` | Yes in production | Comma-separated allowed origins. **If empty, every origin is allowed.** |
| `PUBLIC_SITE_URL` | No | Where `GET /` redirects. Defaults to the first `CORS_ORIGIN`. |
| `FIREBASE_DATABASE_URL` | Yes | Realtime Database URL. |
| `FIREBASE_SERVICE_ACCOUNT_JSON` or `FIREBASE_SERVICE_ACCOUNT_KEY_PATH` | Yes | The service account, as inline JSON (preferred on Render) or a file path. Never commit the key. |
| `MAIL_FROM` | Yes | Sender, e.g. `BVF Support <admin@bvfgermany.com>`. |
| `MAIL_TRANSPORT` | No | `smtp` (default) or `resend`. Use `resend` on Render's free plan, which blocks SMTP ports. |
| `ADMIN_NOTIFICATION_EMAIL` | No | Receives form and order notifications. Falls back to `SMTP_USER`, then the `MAIL_FROM` address. |
| `RESEND_API_KEY`, `RESEND_API_BASE` | With `resend` | API key; base defaults to `https://api.resend.com`. The sender domain must be verified in Resend. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | With `smtp` | SMTP account, plus optional TLS and timeout settings. |

`PASSWORD_RESET_CONTINUE_URL` appears in the example files but is not read by any code.

---

## 7. Firebase setup

Project ID: `bvf-student-support` (see `.firebaserc`). In the Firebase console, enable:

1. **Authentication:** the Email/Password and Google providers. Under Settings → Authorized domains, add your Hosting domains and `www.bvfgermany.com`.
2. **Realtime Database:** holds all app data.
3. **Firestore:** used only by the API, for password-reset codes and welcome-email flags. **The forgot-password flow fails if Firestore is not enabled.**
4. **Hosting:** serves `dist/`.

**Deploy the rules.** This release changed `database.rules.json`, and the public forms and the manual payment flow depend on the new rules:

```bash
npx firebase-tools deploy --only database
```

Compare the file with what the console shows before you deploy, in case someone edited the live rules by hand.

**Create the first admin:**

1. Authentication → Users → add a user (email and password).
2. Realtime Database → add `admins/<that user's UID>`:
   ```json
   { "uid": "<UID>", "email": "admin@example.com", "name": "BVF Admin", "isAdmin": true }
   ```
3. Sign in at `/admin`. Accounts without `isAdmin: true` are refused.

---

## 8. Deployment

Deploy in this order: database rules (section 7), then the API, then the website.

**Backend on Render (Web Service):**

1. Root directory: the folder that contains `package.json`.
2. Build command: `npm install`. Start command: `node server/server.js`.
3. Add the variables from `render.env.example` (`FIREBASE_SERVICE_ACCOUNT_JSON` as one line, `MAIL_TRANSPORT=resend`). Set `CORS_ORIGIN` to the site's domains.
4. Check `https://<service>.onrender.com/api/health`, which should return `{"ok":true}`.

Do not put `VITE_*` variables on Render; they are used only by the frontend build.

**Frontend on Firebase Hosting:**

```bash
echo "VITE_AUTH_API_BASE_URL=https://<service>.onrender.com" > .env.production
npx tsc -p tsconfig.app.json --noEmit
npm run build
npx firebase-tools deploy --only hosting
```

**After deploying:**

1. On the live site, while signed out, submit the contact form. Check that the lead appears in the database and that BVF receives the email.
2. Sign in as a student and as an admin. Refresh each dashboard and check that you stay signed in.

---

## 9. Backend API

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | – | Redirects to `PUBLIC_SITE_URL`. |
| GET | `/api/health` | – | `{"ok":true}` |
| POST | `/api/auth/forgot-password` | – | `{email}`. Emails a 6-digit code if the email belongs to a student. Gives the same reply either way. |
| POST | `/api/auth/reset-password-with-otp` | – | `{email, otp, newPassword, confirmPassword}` |
| POST | `/api/auth/password-status` | Firebase ID token | `{mustChangePassword, isExpired, expiresAt}` |
| POST | `/api/auth/change-password` | Firebase ID token | Temporary-password flow (nothing in the app starts it). |
| POST | `/api/auth/send-welcome-email` | Firebase ID token | Sends the welcome email once per student. |
| POST | `/api/notifications/submission-emails` | none, **rate-limited** | `{formType: contact\|booking\|webinar\|pricing\|tool\|order, name, email, ...}`. Emails the admin and the submitter. The email address is validated, field lengths are capped, and `order` requires `orderTitle` and `orderId`. Each IP can make 20 requests per 10 minutes. |
| POST | `/api/notifications/admin-broadcast` | Admin ID token | `{eventType: blog\|webinar, title, ctaUrl, testOnly}`. Emails all students, or only the admin when `testOnly` is set. |

The ID token can be sent as `Authorization: Bearer <token>` or as `idToken` in the JSON body. The server trusts one proxy hop (Render), so rate limits apply to the real client IP. Request bodies are limited to 20 KB.

---

## 10. Data model and access rules

All app data is in the Realtime Database. Each path has a store module in `src/lib/`.

| Path | Contents | Who can read | Who can write |
|---|---|---|---|
| `admins/{uid}` | `isAdmin`, email, name, `lastLoginAt` | The admin themselves, other admins | Admins |
| `students/{uid}` | Profile, `status`, `services`, `adminNotes`, `timeline` | The student, admins | The student (except status and approval fields), admins |
| `leads/{id}` | Enquiry and sign-up leads | Admins | Admins. **Anyone** can create a new lead with status `new` and valid fields; nobody else can change one. |
| `bookings/{id}` | Consultation requests | Admins; the student whose email matches | Admins. Anyone can create a new booking with status `pending`. |
| `webinars/{id}` | Webinar catalog, including `meetingLink` | **Everyone** | Admins |
| `webinarRegistrations/{id}` | Registrations, attendance, linked `orderId` | Admins; the student whose email matches | Admins. Anyone can create a new registration with status `new`. A paid one must link to the signed-in user's own order. |
| `orders/{id}` | Resource and webinar orders, Drive link | Admins; the owner | Admins. A signed-in user can create their own order with status `pending` and no resource link. Only admins can change it afterwards. |
| `notifications/{id}` | In-app notifications | Admins; the recipient | Admins; the recipient can only mark their own as read |
| `studentDeadlines/{id}` | Deadlines assigned by admins | Admins; the student | Admins |
| `auditLogs/{id}` | Student status changes | Admins | Admins |
| `blogPosts`, `pricingPlans`, `resourcePackages`, `siteContent/{universities,testimonials,settings}` | Content | Everyone | Admins |

A public record that includes a `userId` must use the signer's own uid. Every public create checks the required fields, the length limits and the email format.

**Built-in fallback content:** `blogPosts`, `resourcePackages`, `pricingPlans` and universities come from code until the database path exists. **The first item saved to one of these paths replaces all of its built-in items.** To keep the built-in items, save them to the database first. Site settings work differently: saved values are merged over the defaults, and empty values are ignored.

---

## 11. Adding BVF's content

[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) lists everything BVF needs to send. This is where each piece goes:

| Content | Where | Shown when |
|---|---|---|
| WhatsApp number, phone, email, Instagram, YouTube, address, working hours, default WhatsApp message | Admin → Settings (no deploy needed), or the defaults in `src/config/business.ts` | The value is set and does not look like a placeholder |
| Registered company / operator name | `legalName` in `src/config/business.ts` | Footer copyright and privacy policy |
| Founder profile | `founderProfile` in `src/config/business.ts`; photo in `src/assets/adharsh-bratlin.jpg` | Always |
| Success stories | `src/content/successStories.ts` | `consentConfirmed: true` and the required fields are filled |
| German course details | `src/content/germanCourse.ts` | Each field separately, once it is non-empty |
| Terms of Service, Refund policy | `src/content/legal.ts` | The text is non-empty (the route returns "not found" until then) |
| Webinar replays | `src/content/webinarReplays.ts` | At least one entry |
| Upcoming webinars | Admin → Create Webinar | Scheduled in the database |
| Photos | `src/assets/`, then pass them as `image` / `heroImage` props | Replaces the branded graphic |

The original founder image `src/assets/Adharsh Bratlin.PNG` (2.7 MB) is kept. The site uses an optimised 72 KB copy.

---

## 12. Known issues

### Fixed in this release (11 Nov 2026)

- **Signed-out visitors could not submit any form.** The rules now allow public create-only writes with validation.
- **Refreshing a dashboard sent the user back to login.** The route guards now wait until the profile for the current user has loaded.
- **The deadline calendar crashed the student dashboard.** Fixed, and an error boundary now contains any future crash.
- **Payments were simulated, and the price could be set from the URL.** Replaced with manual payment confirmation by an admin. The price comes from the catalog only, and students can no longer mark orders paid.
- **The email API had no limits.** It is now rate-limited, validated and length-capped, and all user text is escaped.
- **Students' own "new registration" and "purchase" alerts to admins failed silently.** Those calls were removed. Admins are now emailed instead.
- **The Instagram URL, YouTube URL and WhatsApp message were not editable.** They are now in Admin → Settings. The unused "hero title" field was removed.
- **Broken media and stock images.** The hero video that returned 404 and all stock photos were removed.
- **Blog images and links appeared as raw Markdown.** Both now render.
- **The home page and `/resources` had no `<h1>`.** Both now have one.
- **Garbled WhatsApp text** on `/pricing`, expired webinar dates, hard-coded 2026 intake years, placeholder contact numbers, placeholder YouTube replays, and fake testimonials and ratings were all fixed.
- **The navbar overlapped the logo** at 768 and 1024 px. The full menu now appears from 1280 px.
- **13 TypeScript errors.** There are now 0.

### Still open

Security:

1. **The password-reset code can be guessed.** There is no attempt limit on the 6-digit code ([authController.js:107](server/controllers/authController.js#L107)). Add a per-account attempt counter.
2. **The submission-email endpoint is still public.** It is rate-limited, but a determined sender with many IPs could still trigger emails ([notificationRoutes.js:10](server/routes/notificationRoutes.js#L10)). Consider adding a captcha such as Cloudflare Turnstile or reCAPTCHA.
3. **Paid webinar meeting links are public.** `webinars` is readable by anyone ([database.rules.json:163](database.rules.json#L163)). Move `meetingLink` to a path readable only by admins and paid registrants.
4. **Students can edit their own progress and mentor notes.** The rules protect only the status and approval fields ([database.rules.json:21](database.rules.json#L21)). The dashboard lets students set any service to "Completed" ([StudentDashboard.tsx:1166](src/pages/StudentDashboard.tsx#L1166)), and that feeds the admin's reports.
5. **Approval does not gate access.** New accounts are created as `approved` ([studentStore.ts:136](src/lib/studentStore.ts#L136)).
6. **An empty `CORS_ORIGIN` allows every origin** ([server.js:26](server/server.js#L26)). Set it on Render.

Missing or incomplete features:

7. **No leads or bookings screen in the admin.** BVF is emailed for each one, but they cannot be viewed or managed in the dashboard. `filteredLeads` is computed and never shown ([AdminDashboard.tsx:287](src/pages/AdminDashboard.tsx#L287)).
8. **No online payment gateway.** Payments are confirmed by hand (see [2.6](#26-resource-store-and-checkout)). A gateway such as Razorpay needs server-side payment verification.
9. **Admins cannot** edit a blog post, change a webinar's status, or manage universities or pricing plans. The store functions exist but have no UI.
10. **Some controls only look functional.** Mentor Chat cannot send messages. "Set reminder" only shows a banner. The university "% match" is based on list position ([StudentDashboard.tsx:1131](src/pages/StudentDashboard.tsx#L1131)). Documents are links, not uploads.
11. **The IELTS checker result is locked** for everyone except a newly registered student in their first session ([FreeTools.tsx:513](src/pages/FreeTools.tsx#L513)).
12. **The CGPA converter rejects 4-point scales** ([FreeTools.tsx:530](src/pages/FreeTools.tsx#L530)).
13. **Broadcast emails go to suspended and rejected students too** ([notificationController.js:118](server/controllers/notificationController.js#L118)).
14. **An empty API response shows a raw browser error** on the forgot-password page ([passwordResetApi.ts:24](src/lib/passwordResetApi.ts#L24)).
15. **The `/change-password` temporary-password flow is unreachable.** Nothing sets `mustChangePassword: true`.

Content and SEO:

16. **Canonical URLs and the sitemap use `https://bvf-student-support.web.app`**, not `www.bvfgermany.com` ([seo.ts:2](src/lib/seo.ts#L2), [seo-routes.mjs:2](scripts/seo-routes.mjs#L2)). Pick one primary domain.
17. **Blog post URLs are not in the sitemap.**
18. **Facts for BVF to verify:**
    - the blocked account amount, which differs between [GermanBlockedAccount.tsx:19](src/pages/services/GermanBlockedAccount.tsx#L19) (EUR 11,208) and [FAQs.tsx:14](src/pages/FAQs.tsx#L14) (EUR 11,904)
    - "visits twice a year" ([BvfGermany.tsx:139](src/pages/about/BvfGermany.tsx#L139))
    - the prices ([Pricing.tsx:45](src/pages/Pricing.tsx#L45) and [resourceCatalog.ts](src/lib/resourceCatalog.ts))

Code health:

19. **Tests:** only a placeholder test exists. Add `tsc --noEmit` to the build or CI.
20. **Unused dependencies:** `@anthropic-ai/sdk`, `@playwright/test`, and the React Query provider.
21. **Bundle size:** the main JavaScript chunk triggered Vite's size warning when it was measured on 10 Nov.

---

## 13. How this was tested

Two rounds, on Windows with Node 22.15:

- **10 Nov 2026:** a full audit of the original code
- **11 Nov 2026:** a retest after the changes

Every end-to-end test ran on a separate copy of the project:

- wired to the Firebase emulators (Auth, Realtime Database, Firestore) under a throwaway `demo-` project, using this repository's `database.rules.json`
- with emails going to a fake Resend server

No real Firebase data was read or written, and no real email was sent. Headless Chromium drove the real UI.

**Retest on 11 Nov 2026:**

- **Static checks:** lint passes, the type check has 0 errors, `npm test` passes, and `npm run build` writes 46 route pages. The sitemap includes `/dmat`, `/german-language` and `/privacy-policy`.
- **Public audit of 17 key pages** checked that each has:
  - one `<h1>`
  - no stock images
  - no placeholder contacts
  - no WhatsApp links before a number is set
  - none of the removed claims

  The founder profile shows. `/dmat` has all 7 sections and 8 official source links. `/terms` and `/refund-policy` return "not found".
- **All 7 public forms, signed out:** consent is required, the record is saved with `consentAt`, and the admin email is sent.
- **Contact settings:** after an admin saves Settings, the floating WhatsApp button, footer links and working hours appear, with service-specific WhatsApp messages.
- **Accounts:** student and admin refresh (3 of 3 each), the deadline calendar, and a pending-account message.
- **Orders:** an order stays pending until an admin marks it paid, students cannot mark their own order paid, and `?price=1` is ignored.
- **Rules and API probes:** 24 of 24 checks passed, including the rate limit on the 21st request.
- **Route sweep:** 0 console errors and no dead internal links.
- **Phone-width layout:** no horizontal overflow on 10 pages. The navbar was checked at 768, 1024, 1280 and 1366 px.

**Not tested:**

- the live Firebase project and its deployed rules
- Google sign-in
- real email delivery through Resend or SMTP
- the Calendly widget
- the Render deployment
- the 30-minute inactivity sign-out
- browsers other than Chromium
- accessibility with a screen reader
