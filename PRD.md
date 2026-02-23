# PRD – ISD Device Loaner System (2026)

**Owner:** Pape SY | **Region:** Dakar, Senegal  
**Platforms:** iOS & Android (PWA), Desktop  
**Languages:** English (EN) & French (FR)  
**Brand:** ISD Navy (#002D56), ISD Gold (#FDB913), ISD Logo

---

## 1. Vision & Core Objectives

Secure, automated, branded hardware management for International School of Dakar: replace manual logs with real-time tracking, accountability, and fast check-out/return.

---

## 2. Functional Requirements

### 2.1 Authentication & Security (P0)
- **Signup:** Open or domain-restricted (@student.isd.sn / @faculty.isd.sn) per deployment.
- **Password:** Min 6 characters, 1 uppercase, 1 special character.
- **Verification:** Mandatory email verification (Supabase).
- **Roles:** Each user has a **profile** with `role`: `admin` | `student`. Admins manage inventory and loans; students (borrowers) borrow and return devices.

### 2.2 Bilingual Support (P0)
- **Interface:** EN/FR; persistent locale toggle in header (cookie `NEXT_LOCALE`).
- **Notifications (Phase 2):** Emails/alerts in user’s preferred language.

### 2.3 Admin (P1)
- **Dashboard:** List all devices and all loans; highlight overdue loans; link to Add Device.
- **Add Device:** Name, serial number, status (available | loaned | repair), condition (new | good | fair | poor); barcode scan for serial.
- **Loans:** See who borrowed what and due/return dates; optionally mark returned from admin (or borrower return updates device).

### 2.4 Borrower (P1)
- **Browse:** List only **available** devices (status = available).
- **Borrow:** From an available device, create a loan (checkout_at, due_at); device becomes loaned and hidden from other borrowers.
- **My loans:** List current (active) loans for the signed-in user; show device name, due date, overdue state.
- **Return:** Mark a loan as returned; device becomes available again.

### 2.5 Real-time & Alerts (P1 / P2)
- **Real-time:** Devices marked loaned are hidden from borrower browse; UI reflects current status.
- **Alerts (Phase 2):** 24h warning before due; overdue alerts (Email/SMS via Resend, Twilio/Orange).

---

## 3. Technical Specifications

- **Stack:** Next.js (App Router), Tailwind CSS, Supabase (Auth + Postgres).
- **Testing:** Vitest (unit), Playwright (e2e).

---

## 4. Database Schema (Supabase)

- **profiles:** `id` (uuid, = auth.uid()), `email`, `role` (admin | student), `preferred_lang`, `phone`, `created_at`, `updated_at`.
- **devices:** `id` (uuid), `name`, `serial_number`, `status` (available | loaned | repair), `condition` (new | good | fair | poor), `created_at`, `updated_at`.
- **loans:** `id` (uuid), `user_id` (→ profiles.id), `device_id` (→ devices.id), `checkout_at`, `due_at`, `returned_at`, `notified_24h` (Phase 2), `created_at`, `updated_at`.

RLS: admins can manage devices and all loans; borrowers can read available devices, create loans for themselves, and update their own loans (return).

---

## 5. Implementation Scope (Integrated App)

| Area        | Features                                                                 |
|------------|---------------------------------------------------------------------------|
| **Auth**   | Sign up, sign in, email confirm, callback; profile created on signup (default role: student). |
| **Admin** | Dashboard (devices + loans, overdue); Add Device (form + barcode → DB).   |
| **Borrower** | Home: Borrow (browse available, create loan), My loans (list + return). |
| **Home**   | Role-based: admin → Admin dashboard / Add Device; borrower → Borrow / My loans; Sign out. |
| **i18n**   | EN/FR toggle in header; all copy from messages.                          |

---

## 6. Success Metrics (HEART)

- **Task success:** Loan (check-out) in &lt; 30 seconds.
- **Adoption:** 90%+ mobile users install PWA.
- **Retention:** 0% missed returns for notified users (Phase 2).
