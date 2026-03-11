# Doctor Appointment Full Stack App

Clinic appointment system built with a React + Vite frontend and a PHP + MySQL backend. Patients can submit appointments from the website, the backend stores them in MySQL, admins can log in with JWT auth, and the frontend still generates a downloadable appointment PDF after a successful booking.

## Stack

### Frontend

- `React 19`
- `Vite 7`
- `React Router DOM 7`
- `Tailwind CSS 4`
- `jsPDF`

### Backend

- `PHP 8+`
- `MySQL`
- `PDO`
- REST API with JSON responses
- JWT-based admin authentication

## What Changed

- the patient booking form submits to a real PHP API
- successful bookings are stored in MySQL
- the frontend still generates the appointment PDF after the API save succeeds
- new admin routes were added for login and dashboard access
- admins can search, filter, page through, view, and delete appointments
- dashboard stats show total appointments, today's appointments, and doctor count

## Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing/home page |
| `/about` | About page |
| `/services` | Services page |
| `/contact` | Contact page with live booking form |
| `/abc` | Standalone booking form |
| `/admin` | Smart redirect to login or dashboard |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Protected admin dashboard |
| `/myadmin` | Redirects to `/admin/dashboard` |
| `*` | Error page |

## API Endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/appointments/create` | Public | Create appointment |
| `GET` | `/api/appointments` | Admin | List appointments with filters + pagination |
| `GET` | `/api/appointments/{id}` | Admin | Get one appointment |
| `DELETE` | `/api/appointments/{id}` | Admin | Delete appointment |
| `POST` | `/api/admin/login` | Public | Admin login |
| `POST` | `/api/admin/create` | Public for first admin, protected afterwards | Create admin |

## Backend Structure

```text
backend/
├─ config/
│  ├─ app.php
│  ├─ database.php
│  └─ env.php
├─ controllers/
│  ├─ AppointmentController.php
│  └─ AuthController.php
├─ database/
│  └─ schema.sql
├─ middleware/
│  └─ auth.php
├─ models/
│  ├─ Admin.php
│  └─ Appointment.php
├─ public/
│  ├─ .htaccess
│  └─ index.php
├─ routes/
│  └─ api.php
├─ utils/
│  ├─ jwt.php
│  └─ response.php
├─ .env.example
├─ .gitignore
├─ composer.json
└─ router.php
```

## React Structure Added

```text
src/
├─ Components/
│  ├─ AppointmentTable.jsx
│  ├─ DashboardStats.jsx
│  └─ ProtectedRoute.jsx
├─ Pages/
│  ├─ AdminDashboard.jsx
│  └─ AdminLogin.jsx
└─ services/
   └─ api.js
```

## Database

Database name:

```text
clinic_app
```

Tables:

- `admins`
- `appointments`

The backend now uses MySQL connection settings from `backend/.env`.

## Installation

### 1. Frontend

```bash
npm install
```

Optional frontend env:

```bash
copy .env.example .env
```

Default frontend API target:

```text
VITE_API_BASE_URL=http://localhost:8000/api
```

### 2. MySQL

Start your MySQL server with XAMPP, Laragon, or a local MySQL installation.

Default local values used in the backend env:

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=clinic_app
DB_USER=root
DB_PASS=
```

### 3. Backend env

Copy the example file:

```bash
copy backend\.env.example backend\.env
```

Recommended keys:

```text
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_NAME="clinic_app"
DB_USER="root"
DB_PASS=""
DB_CHARSET="utf8mb4"
JWT_SECRET="change-this-secret-before-production"
APP_ALLOWED_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
```

### 4. Optional schema import

The backend auto-creates the database and tables if the configured MySQL user has permission.

If you prefer to create them manually, import:

```text
backend/database/schema.sql
```

### 5. Run the backend

From `backend/`:

```powershell
& "C:\Program Files\php-8.5.3\php.exe" -S localhost:8000 router.php
```

### 6. Run the frontend

From the project root:

```bash
npm run dev
```

## First Admin Setup

Create the first admin only once:

```powershell
curl.exe -X POST http://localhost:8000/api/admin/create -H "Content-Type: application/json" -d "{\"name\":\"Super Admin\",\"email\":\"admin@clinic.com\",\"password\":\"Admin@12345\"}"
```

After the first admin exists, `POST /api/admin/create` requires a valid admin JWT.

## Admin Login Flow

1. Open `/admin/login`
2. Sign in with admin email and password
3. JWT token is stored in `localStorage`
4. Protected API requests send `Authorization: Bearer <token>`
5. `/admin/dashboard` loads appointments and stats from the backend

## Booking Flow

1. User fills `src/Components/AppointmentBookingForm.jsx`
2. React sends the form data to the backend via `src/services/api.js`
3. PHP normalizes the payload and stores it in MySQL
4. On success, the frontend still calls `jsPDF` and downloads the appointment PDF
5. Admin dashboard can immediately see the new appointment

## Important Files

- `src/Components/AppointmentBookingForm.jsx` - patient booking UI and backend submit flow
- `src/services/api.js` - frontend API client and admin session helpers
- `src/Pages/AdminLogin.jsx` - admin authentication page
- `src/Pages/AdminDashboard.jsx` - admin dashboard, detail modal, delete modal
- `backend/public/index.php` - backend front controller
- `backend/routes/api.php` - route dispatcher
- `backend/controllers/AppointmentController.php` - appointment CRUD logic
- `backend/controllers/AuthController.php` - admin create/login logic
- `backend/middleware/auth.php` - JWT guard
- `backend/config/database.php` - PDO/MySQL connection and auto table bootstrap
- `backend/database/schema.sql` - manual schema import if needed

## Validation

Frontend checks completed:

- `npm run lint` ✅
- `npm run build` ✅

Backend note:

- backend runtime still depends on your local PHP and MySQL setup

## Current Notes

- the frontend and backend are decoupled through `VITE_API_BASE_URL`
- admin list filtering and pagination are backed by API query parameters
- the backend accepts the current React form shape and maps it into MySQL rows
- `past_history` and `maternal_history` are stored as JSON in MySQL
- the PDF bundle still triggers Vite's large chunk warning because of `jsPDF`
- sample marketing content and some website CTAs are still placeholder/demo content

## Security Notes

- passwords are hashed with `password_hash`
- admin routes are protected with JWT middleware
- login tokens expire automatically
- move your production DB credentials and JWT secret into secure environment management
