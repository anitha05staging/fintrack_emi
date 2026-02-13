# FinTrack React Dashboard 

This document contains the AI prompt used to generate the React frontend
for the FinTrack EMI Tracker Django backend.

---

I have a Django REST Framework backend for an EMI Tracker application with JWT authentication.

Backend APIs already exist for:
- User authentication (login, refresh token)
- Loans
- Payments (EMI schedule, mark paid, overdue check)
- Reminders
- Dashboard summary (total_pending, total_overdue, total_penalty, total_paid, outstanding_balance)

I want you to build a production-ready React dashboard frontend for this project.

-------------------------------------------------
1️⃣ TECH STACK REQUIREMENTS
-------------------------------------------------

- React (Vite)
- Axios for API calls
- Tailwind CSS for UI
- React Router
- Context API for authentication
- Recharts (or Chart.js) for graphs

-------------------------------------------------
2️⃣ AUTHENTICATION FLOW (JWT)
-------------------------------------------------

Implement:
- Login page
- Store access token in memory
- Store refresh token securely
- Attach access token in Authorization header
- Auto-refresh access token on 401 response
- Logout functionality

-------------------------------------------------
3️⃣ DASHBOARD PAGES
-------------------------------------------------

Create the following pages:

1. Login / Register
2. Dashboard (Summary)
3. Loans List
4. EMI Schedule (Payments)
5. Reminders
6. Overdue & Penalties

-------------------------------------------------
4️⃣ DASHBOARD SUMMARY UI
-------------------------------------------------

Fetch data from:
GET /api/loans/dashboard_summary/

Display cards for:
- Total Pending
- Total Overdue
- Total Penalty
- Total Paid
- Outstanding Balance

-------------------------------------------------
5️⃣ EMI SCHEDULE PAGE
-------------------------------------------------

Display table with:
- EMI Number
- Due Date
- EMI Amount
- Principal Component
- Interest Component
- Penalty
- Total Due
- Status (PENDING / PAID / OVERDUE)
- Outstanding Balance After Payment

Add "Mark Paid" button:
POST /api/payments/<id>/mark_paid/

-------------------------------------------------
6️⃣ REMINDERS PAGE
-------------------------------------------------

Display:
- Loan Name
- EMI Due Date
- Reminder Type (EMAIL)
- Sent Status
- Sent At

-------------------------------------------------
7️⃣ GRAPHS & VISUALS
-------------------------------------------------

Add charts:
- Outstanding Balance over Time (Line Chart)
- Paid vs Overdue EMIs (Pie Chart)

-------------------------------------------------
8️⃣ UI / UX REQUIREMENTS
-------------------------------------------------

- Clean dashboard layout
- Sidebar navigation
- Responsive design
- Professional fintech look
- Loading & error states

-------------------------------------------------
9️⃣ PROJECT STRUCTURE
-------------------------------------------------

Provide clean folder structure:

src/
 ├─ pages/
 ├─ components/
 ├─ services/
 ├─ context/
 ├─ routes/

-------------------------------------------------
🔟 API BASE CONFIGURATION
-------------------------------------------------

Use environment variable:

VITE_API_BASE_URL=http://127.0.0.1:8000

Configure Axios with interceptors for token handling.

-------------------------------------------------
11️⃣ DELIVERABLES
-------------------------------------------------

Provide:
- Complete React code
- Axios JWT interceptor
- Auth context implementation
- Example API calls
- Instructions to run frontend locally

Make sure the dashboard integrates seamlessly with the existing Django backend and follows best industry practices.
