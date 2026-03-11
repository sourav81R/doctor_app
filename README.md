# Doctor Appointment App

Full-stack clinic appointment project with:

- a React 19 + Vite frontend for the public site, appointment form, and admin UI
- a PHP 8 + MySQL backend for appointment storage and admin authentication
- client-side PDF generation for printable appointment slips

The codebase combines a marketing-style clinic website with a working booking flow and a protected admin dashboard.

## What The App Does

### Public experience

- Landing page with marketing sections and doctor/department content
- Contact page with an embedded appointment booking form
- Standalone appointment form route at `/abc`
- Appointment submissions support both clinic visits and teleconsultations
- Teleconsultation bookings capture platform preference and pre-consultation concerns
- Appointment submissions are sent to the PHP API and stored in MySQL
- After a successful save, the browser generates and downloads a PDF appointment sheet

### Admin experience

- Admin login with JWT-based authentication
- Protected dashboard route
- Protected prescription generator route
- Appointment listing with:
  - patient name search
  - doctor filter
  - appointment date filter
  - consultation type filter
  - pagination
- Dashboard summary stats:
  - total appointments
  - today appointments
  - distinct doctor count
- View appointment details
- Download a PDF again from saved appointment data
- Delete appointments
- Generate and save a prescription without creating an appointment first

## Tech Stack

### Frontend

- React 19
- Vite 7
- React Router DOM 7
- Tailwind CSS 4 via `@tailwindcss/vite`
- `jspdf`
- `lucide-react`
- `react-icons`

### Backend

- PHP 8.1+ (`composer.json` requires `^8.1`)
- MySQL
- PDO / `pdo_mysql`
- JSON REST endpoints
- Custom JWT utilities
- No required third-party PHP packages beyond Composer metadata

## Repository Layout

```text
.
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- database/
|   |-- middleware/
|   |-- models/
|   |-- public/
|   |-- routes/
|   |-- utils/
|   |-- composer.json
|   `-- router.php
|-- public/
|-- src/
|   |-- Components/
|   |-- Pages/
|   |-- assets/
|   |-- data/
|   |-- services/
|   `-- utils/
|-- package.json
|-- vite.config.js
`-- README.md
```

## Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Home / landing page |
| `/about` | About page |
| `/services` | Services page |
| `/contact` | Contact page with booking form |
| `/abc` | Standalone appointment form page |
| `/admin` | Redirects to login or dashboard based on stored token |
| `/admin/login` | Admin login page |
| `/prescription` | Redirects to `/admin/prescription` |
| `/admin/dashboard` | Protected admin dashboard |
| `/admin/prescription` | Protected prescription generator |
| `/myadmin` | Redirects to `/admin/dashboard` |
| `*` | Error page |

## API Endpoints

Base URL in the frontend defaults to `http://localhost:8000/api`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/appointments/create` | Public | Create appointment |
| `GET` | `/appointments` | Admin | List appointments with search, filters, stats, pagination |
| `GET` | `/appointments/{id}` | Admin | Fetch one appointment |
| `DELETE` | `/appointments/{id}` | Admin | Delete one appointment |
| `POST` | `/admin/login` | Public | Admin login |
| `POST` | `/admin/create` | Public for the first admin, protected afterwards | Create admin |
| `POST` | `/prescriptions/save` | Admin | Save a direct prescription |

## Data Model

### `admins`

- `id`
- `name`
- `email`
- `password`
- `created_at`

### `appointments`

- `id`
- `patient_name`
- `age`
- `gender`
- `phone`
- `email`
- `doctor`
- `appointment_date`
- `appointment_time`
- `consultation_type`
- `consultation_platform`
- `consultation_message`
- `blood_pressure`
- `temperature`
- `pulse`
- `past_history` JSON
- `maternal_history` JSON
- `form_snapshot` JSON
- `notes`
- `address`
- `created_at`

### `prescriptions`

- `id`
- `doctor_name`
- `patient_name`
- `age`
- `gender`
- `diagnosis`
- `medicines` JSON
- `notes`
- `created_at`

## Codebase Notes

- The backend auto-creates the configured MySQL database if the MySQL user has permission.
- The backend also auto-creates the `admins` and `appointments` tables on first use.
- `form_snapshot` stores a richer copy of the submitted form so the admin dashboard can rebuild the PDF later.
- The booking API normalizes multiple field name styles. For example, the frontend sends fields like `doctorName`, `appointmentDate`, and `contactNumber`, while the backend stores normalized names such as `doctor`, `appointment_date`, and `phone`.
- Teleconsultations are stored with `consultation_type`, `consultation_platform`, and `consultation_message`.
- Admin session data is stored in `localStorage` under `clinic_admin_session`.
- The frontend lazy-loads route pages and splits vendor/framework/pdf chunks in Vite.
- Prescriptions can be generated directly from the admin area and saved in MySQL without creating an appointment record first.
- Some marketing content is still placeholder/demo content, including sample addresses, phone numbers, and emails on public pages.
- Some links rendered inside marketing pages currently point to routes that are not registered in `src/App.jsx`, so those links fall through to the error page.

## Local Setup

### Prerequisites

- Node.js 20+ recommended
- npm
- PHP 8.1+
- MySQL 8+ or compatible

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Configure frontend environment

Copy the frontend env file:

```powershell
Copy-Item .env.example .env
```

Default value:

```env
VITE_API_BASE_URL="http://localhost:8000/api"
```

### 3. Configure backend environment

Copy the backend env file:

```powershell
Copy-Item backend\.env.example backend\.env
```

Default backend values:

```env
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_NAME="clinic_app"
DB_USER="root"
DB_PASS=""
DB_CHARSET="utf8mb4"
JWT_SECRET="change-this-secret-before-production"
APP_ALLOWED_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
```

### 4. Start MySQL

Start MySQL through XAMPP, Laragon, WAMP, Docker, or a local server install.

### 5. Start the PHP backend

Run this from the `backend` directory:

```powershell
php -S localhost:8000 router.php
```

The API will be available at `http://localhost:8000/api`.

### 6. Start the frontend

Run this from the project root:

```bash
npm run dev
```

The frontend will typically run at `http://localhost:5173`.

## Optional Manual Schema Import

If you do not want the backend to bootstrap the schema automatically, import:

```text
backend/database/schema.sql
```

## First Admin Setup

If the `admins` table is empty, you can create the first admin without authentication:

```powershell
curl.exe -X POST http://localhost:8000/api/admin/create `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Super Admin\",\"email\":\"admin@clinic.com\",\"password\":\"Admin@12345\"}"
```

Once at least one admin exists, the same endpoint requires a valid admin JWT.

## Typical Flow

### Booking flow

1. A patient fills the appointment form on `/contact` or `/abc`.
2. The frontend posts the form to `POST /appointments/create`.
3. The backend validates and normalizes the payload.
4. MySQL stores the appointment plus JSON snapshots of history and form data.
5. The browser generates a PDF download after the save succeeds.

### Admin flow

1. Admin logs in at `/admin/login`.
2. The API returns a JWT token and admin profile.
3. The frontend stores the session in `localStorage`.
4. Protected dashboard requests send `Authorization: Bearer <token>`.
5. The dashboard loads stats, appointment rows, filters, detail views, and delete actions from the backend.

### Prescription flow

1. Admin opens `/admin/prescription`.
2. Doctor and patient details are entered along with one or more medicines.
3. The frontend saves the prescription through `POST /prescriptions/save`.
4. The browser generates a printable prescription PDF immediately after save.

## Important Files

### Frontend

- `src/App.jsx` - route registration and admin redirect logic
- `src/Components/AppointmentBookingForm.jsx` - booking UI, validation, API submit flow
- `src/Pages/AdminLogin.jsx` - admin login page
- `src/Pages/AdminDashboard.jsx` - dashboard, filters, detail modal, delete flow, PDF re-download
- `src/Pages/PrescriptionGenerator.jsx` - direct prescription form and save/download flow
- `src/services/api.js` - frontend API client and admin session helpers
- `src/utils/generateAppointmentPDF.js` - client-side PDF rendering
- `src/utils/appointmentFormConfig.js` - initial form state and history options
- `src/data/doctors.js` - doctor metadata used by the form and PDF header

### Backend

- `backend/public/index.php` - backend entry point
- `backend/router.php` - PHP built-in server router
- `backend/routes/api.php` - API dispatch logic
- `backend/controllers/AppointmentController.php` - appointment create/list/show/delete
- `backend/controllers/AuthController.php` - admin create/login
- `backend/controllers/PrescriptionController.php` - prescription save endpoint
- `backend/models/Appointment.php` - persistence, filtering, stats, serialization
- `backend/models/Admin.php` - admin persistence and lookup
- `backend/models/Prescription.php` - prescription persistence and serialization
- `backend/middleware/auth.php` - JWT auth guard
- `backend/config/database.php` - PDO connection and schema bootstrap
- `backend/config/app.php` - JWT secret, CORS, allowed origins
- `backend/database/schema.sql` - manual schema creation

## Verification

Verified locally on March 11, 2026:

- `npm run lint`
- `npm run build`
- `php -v`

Current note:

- the production build succeeds, but Vite still reports a large `pdf` chunk warning because `jspdf` is heavy
