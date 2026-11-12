# BVF Germany – Launch Checklist

The website now follows the audit brief in the code: no stock or AI-generated people, no invented statistics or testimonials, no placeholder contact details, and every form works with consent and spam protection.

Some parts of the brief need **real information from the BVF team**. Until each item below is supplied, the website hides that part instead of showing a placeholder. Nothing breaks while you wait.

Last updated: 11 November 2026.

---

## 1. Information BVF needs to send

### Contact details (highest priority)

These can be entered without a developer: sign in at `/admin`, open **Settings**, fill in the fields and click **Save settings**. They appear across the whole site immediately.

| Item | Where it appears |
|---|---|
| WhatsApp Business number, with country code (e.g. 9198XXXXXXXX) | Floating WhatsApp button, WhatsApp buttons on the home page and every service page, Contact page, footer |
| Phone number as it should be displayed | Contact page, footer |
| Official business email | Contact page, footer, privacy policy |
| Instagram profile URL | About page, home page, Contact page, footer |
| YouTube channel URL | About page, home page ("Watch Our Story"), Contact page, footer |
| Business address | Contact page, footer, privacy policy |
| Working hours | Contact page, footer |
| Default WhatsApp message | Pre-filled text when someone taps a general WhatsApp button |

The **registered company / operator name** is shown in the footer and privacy policy. A developer adds it in `src/config/business.ts` (`legalName`).

### Photos (genuine only)

Send original photos with permission from everyone shown. A developer adds them to `src/assets/`.

- [ ] BVF team members, mentors and counselors
- [ ] Students (only with written permission): admissions, arrival in Germany, studying in Germany
- [ ] German language classes and trainers
- [ ] Germany visits, university visits, events
- [ ] Optional: a real BVF photo or short video for the home page hero

Until then, the site uses a clean branded graphic in those places. The founder photo (Adharsh Bratlin) is already in place.

### Team and people listed on the site

- [ ] Confirm that every person on **About → BVF Germany** (mentors, team members, visiting professors) agreed to be listed and that their titles are correct. They currently show initials instead of photos.
- [ ] Send any further team profiles: name, role, qualifications, experience and photo.

### Student success stories

For each story, send the following. A developer adds it to `src/content/successStories.ts`.

- [ ] Written permission to publish the name, photo and story
- [ ] Genuine photograph (and an optional YouTube video link)
- [ ] Full name
- [ ] Indian college/university, degree and branch, CGPA, graduation year
- [ ] IELTS score (if applicable)
- [ ] German university, admitted course, intake and year
- [ ] The BVF services the student **actually** received
- [ ] A short quote in the student's own words, plus the longer story
- [ ] Story type: admission received / applications completed / arrived in Germany / studying now / German language completed

Story sections on the home, About, Pricing, Bookings, Webinars and service pages appear automatically once the first story is added.

### German language classes

A developer adds these to `src/content/germanCourse.ts`. Anything left out stays hidden on `/german-language`.

- [ ] Levels offered (A1, A2, B1, B2) with duration and fee for each
- [ ] Batch timings, batch size, online/offline format, classes per week
- [ ] Course materials included
- [ ] How speaking practice works
- [ ] Learning outcomes (e.g. exam preparation)
- [ ] Trainers: name, photo, qualifications, experience
- [ ] Genuine class photos
- [ ] Student feedback (with permission)

### dMAT page

The `/dmat` page uses only information from the official sources (d-mat.de and APS India), checked on 11 November 2026.

- [ ] BVF to review the page and confirm it is correct
- [ ] Describe the dMAT support BVF offers, and its price if any. The page currently only invites students to request guidance.
- [ ] Before each test cycle, re-check fees, dates and eligibility on d-mat.de and aps-india.de, and update the "checked on" date in `src/pages/Dmat.tsx`

### Prices and payments

- [ ] Confirm the three packages on `/pricing`: Profile Verification (free), Self-Preparation Toolkit (INR 999), Full Consultation (custom).
- [ ] Confirm the four resource prices: Bachelor's bundle INR 2,499, Selfhelp Tool INR 1,450, University Excel Sheet INR 499, Personal Appointment INR 999. The struck-through "original" price on the Bachelor's bundle was removed, because a "was" price must be genuine.
- [ ] Decide how students pay. Today an order is placed as **payment pending**, BVF emails the payment details, and an admin clicks **Mark as paid** in the dashboard (Admin → Resources → Payments to confirm). To take card or UPI payments online, choose a gateway (for example Razorpay) and send the merchant account details so it can be integrated.

### Legal pages

- [ ] Review the **Privacy Policy** (`/privacy-policy`), which was drafted from what the website actually collects. In particular, confirm how long data is kept.
- [ ] Send the **Refund & Cancellation Policy** text
- [ ] Send the **Terms of Service** text

A developer adds both texts to `src/content/legal.ts`. Each page and its footer link appear once its text is added.

### Webinars

- [ ] Schedule upcoming webinars in **Admin → Create Webinar**. The home page and `/webinars` show the next one automatically, and until then visitors can register interest.
- [ ] Send genuine BVF webinar recordings (YouTube links). A developer adds them to `src/content/webinarReplays.ts`.

### Facts to verify

- [ ] **Blocked account amount:** `/services/blocked-account` says about EUR 11,208 a year (EUR 934 a month), and the FAQs say EUR 11,904 "as of 2024". Check the current official amount and correct both.
- [ ] **"Our visits to Germany are conducted twice a year"** (About → BVF Germany): confirm this is accurate.
- [ ] **Statistics:** any figures you want to show (students guided, visas, community size) need evidence. All invented figures were removed.
- [ ] **Blocked Account page:** the brief says to confirm before deleting it. It is no longer linked from the home page or menus. Decide whether to keep `/services/blocked-account`.

---

## 2. Publishing the changes (developer)

1. **Deploy the database rules**. Without this step, public forms stay blocked on the live site:
   ```bash
   npx firebase-tools deploy --only database
   ```
2. **Redeploy the API on Render.** It has new email types (pricing, tools, orders) and spam limits.
3. **Build and deploy the website:**
   ```bash
   npm run build
   npx firebase-tools deploy --only hosting
   ```
4. On the live site, signed out: submit the contact form and check that the record appears and that BVF receives the email.
5. Sign in as a student and as an admin, refresh the dashboard, and check that you stay signed in.

---

## 3. Final quality check before launch

| Check (from the audit brief) | Status |
|---|---|
| All content is accurate | **Needs BVF review**, especially the facts listed in section 1 |
| No placeholder contact information remains | Done. Placeholders are blocked in code; real details are still needed. |
| No unwanted AI-generated or stock images remain | Done. All stock photos and videos were removed. |
| Blocked Account section removed from the main page, no broken links | Done. No section or link remains on the home page; the separate page is kept pending BVF's decision. |
| Student photographs and testimonials are genuine and authorised | Done in code (only stories with consent are shown). **Needs BVF** to send real stories. |
| German language course information is correct | **Needs BVF** to send course details |
| dMAT information is officially verified | Checked against official sources on 11 Nov 2026. **Needs BVF review.** |
| Pricing is correct | **Needs BVF** confirmation |
| All WhatsApp and contact links work | Done in code and tested with a sample number. **Needs** the real number. |
| All forms work | Done. All 7 forms tested, with consent, spam protection and BVF email notification. **Needs** the rules deployed (section 2). |
| Legal pages are available | Privacy Policy drafted (**needs review**). **Needs BVF** to send Terms and Refund policy. |
| Desktop and mobile versions function properly | Done. Tested at 390, 768, 1024, 1280 and 1366 px wide with no sideways scrolling. |
