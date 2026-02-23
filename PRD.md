PRD
Project: ISD Device Loaner System (2026)
Owner: Pape SY | Region: Dakar, Senegal
Platforms: iOS & Android (PWA), Desktop
Languages: English (EN) & French (FR)
Brand: ISD Navy (#002D56), ISD Gold (#FDB913), ISD Logo
1. Vision & Core Objectives
To provide a secure, automated, and branded hardware management ecosystem for the International School of Dakar. The system replaces manual logs with a real-time tracking tool focused on accountability and high-speed processing.
2. Functional Requirements
2.1 Authentication & Security (P0)
Domain Restriction: Signup restricted to @student.isd.sn and @faculty.isd.sn.
Password Rules: Minimum 6 characters, 1 uppercase letter, 1 special character.
Verification: Mandatory email verification and New Device OTP (One-Time Password) challenge.
2.2 Bilingual Support (P0)
Interface: Persistent EN/FR toggle in the navigation header.
Notifications: Emails and alerts must be sent in the user's preferred language.
2.3 Inventory & Barcode (P1)
Real-time Sync: Devices marked as "Loaned" are instantly hidden from borrowers.
Barcode Scanning: Admin can use the mobile camera to scan serial numbers for inventory entry or check-outs.
Admin Command Center: High-level dashboard to track all assets and overdue loans.
2.4 Automated Alerts (P1)
24h Warning: Email sent 24 hours before return deadline.
Overdue Alerts: Multi-channel notification (Email/SMS) once the deadline passes.
3. Technical Specifications
Stack: Next.js (App Router), Tailwind CSS, Supabase (Auth/DB).
Communication: Resend (Email), Twilio/Orange (SMS).
Testing: Vitest (Logic) and Playwright (User Flow).
4. Database Schema (Supabase)
profiles: id, email, role (admin/student), preferred_lang, phone.
devices: id, name, serial_number, status (available/loaned/repair), condition.
loans: id, user_id, device_id, checkout_at, due_at, returned_at, notified_24h.
5. Success Metrics (HEART)
Task Success: Loan submission completed in < 30 seconds.
Adoption: 90%+ of mobile users "Install" the PWA.
Retention: 0% missed returns for notified users.
