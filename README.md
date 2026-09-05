# Dr. Megha Bobde's Homoeo Clinic (डॉ. मेघा बोबडे 'स होम्यो क्लिनिक)

A full dynamic, multi-page web application and Content Management System (CMS) for **Dr. Megha Bobde's Homoeo Clinic**, located in Bavdhan, Pune, Maharashtra.

---

## Real Clinic Details (Verified)

- **Clinic Name:** Dr. Megha Bobde's Homoeo Clinic (डॉ. मेघा बोबडे 'स होम्यो क्लिनिक)
- **Doctor:** Dr. Megha Abhijit Bobde — MD (Mumbai), BHMS (Bachelor of Homeopathic Medicine and Surgery)
- **Clinical Experience:** Over 15 years of clinical practice, supported over 2,000 patients
- **Integrated Modalities:**
  1. Classical & Advanced Homoeopathy (constitutional prescribing, chronic & acute disease management)
  2. Yogananda Flower Essences (YFE) vibrational therapy (telepathic wrist-holding, affirmations, remote sessions)
  3. Mind Power Yoga (integrated holistic mind-body vitality)
- **Rating:** 5.0 Stars (62 Google Reviews)
- **Address:** Shop No. B1, ABC Convenience Centre, beside Marigold Banquets, Bavdhan, Pune, Maharashtra 411021
- **Google Plus Code:** `GQ46+FM Pune, Maharashtra`
- **Phone:** `+91 92701 13112` (click-to-call enabled: `tel:+919270113112`)
- **WhatsApp:** `https://api.whatsapp.com/send/?phone=919270113112`
- **Email:** `drmeghahomoeoclinic@gmail.com`
- **Instagram:** `https://www.instagram.com/dr.megha_bobde/`
- **YFE Official Page:** `https://www.yoganandafloweressences.com/products/dr-megha`
- **Clinic Hours:**
  - Monday – Saturday: Morning 10:30 AM – 1:30 PM & Evening 6:00 PM – 8:30 PM (IST)
  - Sunday: Morning 11:00 AM – 1:30 PM (Evening Closed)
  - Afternoon Break: 1:30 PM – 6:00 PM
- **Business Attribute:** Women-Owned & Operated Classical Homoeopathic Healthcare Practice

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend:** Next.js Route Handlers (`/api/*`), Node.js
- **Database & ORM:** SQLite (`dev.db`) managed via Prisma ORM (zero setup required locally; easily switches to PostgreSQL / Supabase for production)
- **Authentication:** JSON Web Tokens (JWT) and Bcrypt password hashing
- **SEO & Rich Snippets:** Schema.org `MedicalClinic` & `Physician` JSON-LD structured data

---

## Key Features

1. **Real-time Live Open/Closed Status:**
   - Accurate computation based on Indian Standard Time (IST) supporting **split morning & evening clinic sessions** (Mon–Sat: 10:30 AM–1:30 PM & 6:00 PM–8:30 PM; Sun: 11:00 AM–1:30 PM).
   - Accurately reports afternoon break status: `Closed · Opens 6:00 PM` and active session closing warnings.

2. **Photo Gallery & Lightbox Modal (`/gallery`):**
   - Clean category filtering (All, Clinic Exterior, Reception & Waiting Area, Consultation Room, Doctor at Work, Certificates & Natural Remedies).
   - Fullscreen Lightbox with keyboard navigation (ArrowLeft, ArrowRight, Escape) and thumbnail carousel.
   - Doctor Admin CMS Tab for adding, reordering, editing, and deleting photos.

3. **Dynamic Appointment Booking Engine (`/book`):**
   - Split session morning and evening slot selection with 20-minute consultation slots.
   - Comprehensive conflict detection preventing double-booking of identical slots on the same date.
   - Modality selection: Classical Homoeopathy, Yogananda Flower Essences (YFE), Mind Power Yoga, and Combined Holistic Care.
   - In-Clinic (Bavdhan, Pune) and Online Video Consultation options.
   - Automated WhatsApp dispatch to `+91 92701 13112` for instant mobile confirmation.

4. **Treatments & Clinical Care Catalog (`/services`):**
   - CMS-driven dynamic catalog covering 8 specialties: Chronic Illnesses, Skin & Allergy Management, Women's Health & PCOS, Pediatric Immunity & Adenoids, Lifestyle & Gastrointestinal, Hair & Scalp, Joint Mobility, and Stress Management.
   - Dedicated detail pages for each condition (`/services/[slug]`).

5. **Dynamic Google Reviews & Testimonials (`/testimonials`):**
   - Displays 5.0★ Google rating and breakdown based on 62 verified patient reviews.
   - Public review submission form (`ReviewSubmissionModal`) with doctor moderation approval workflow in Admin CMS.

6. **Educational Health Blog (`/blog`):**
   - CMS-driven blog authored by Dr. Megha Bobde (`/blog` and `/blog/[slug]`).
   - In-depth articles covering classical homoeopathy science, PCOS holistic care, pediatric immunity, and seasonal allergies in Pune.

7. **Contact & Directions (`/contact`):**
   - Embedded Google Map centered on Bavdhan (`GQ46+FM`).
   - Click-to-call (`+91 92701 13112`), WhatsApp button, Instagram link, and interactive inquiry form.

8. **Doctor Admin / CMS Portal (`/admin`):**
   - **Appointments Tab:** Filter, view, update status (Pending, Confirmed, Completed, Cancelled), and send one-click WhatsApp messages to patients.
   - **Hours & Live Status Tab:** Edit morning and evening open/close times, slot durations, or toggle day closures.
   - **Photo Gallery CMS Tab:** Upload new clinic photos with descriptive alt text, assign categories, reorder, and delete images.
   - **Clinic Details Tab:** Update clinic name, doctor credentials, address, phone, rating, reviews count, and emergency announcement banner.
   - **Treatments CMS:** View and manage clinical services.
   - **Reviews Moderation:** Approve or unapprove patient reviews.
   - **Blog CMS:** Manage health articles.
   - **Inquiries Tab:** Review contact form submissions.

---

## Admin Credentials

- **URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email:** `admin@drmeghahomoeoclinic.com`
- **Password:** `MeghaClinic@2026`

---

## Getting Started

### 1. Prerequisites
- Node.js (v18.x or later recommended, v24+ supported)
- npm or yarn

### 2. Setup & Database Seeding
```bash
npm install
npx prisma db push
npx prisma db seed
```

### 3. Running in Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Building for Production
```bash
npm run build
npm start
```

---

## Environment Variables (`.env`)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="megha-homoeo-clinic-secure-jwt-secret-key-2026"
NEXT_PUBLIC_CLINIC_PHONE="+91 92701 13112"
NEXT_PUBLIC_CLINIC_PHONE_RAW="+919270113112"
NEXT_PUBLIC_CLINIC_WHATSAPP="+919270113112"
NEXT_PUBLIC_CLINIC_EMAIL="drmeghahomoeoclinic@gmail.com"
NEXT_PUBLIC_SITE_URL="https://drmeghahomoeoclinic.com"
```