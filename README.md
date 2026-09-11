# Health Deck

Health Deck is a post-operative recovery platform that closes the gap between hospital discharge and clinical follow-up. It gives patients a simple daily recovery checklist and gives doctors visibility into adherence, recovery reviews, medical reports, OCR results, and clinical alerts.

The project is a two-part application:

- `frontend/`: React 19 + TypeScript + Vite patient and doctor dashboards.
- `backend/`: Express REST API with PostgreSQL, JWT authentication, role-based access control, recovery tracking, report uploads, OCR, and AI-assisted report processing.

## Features

### Patient experience

- Patient registration and login.
- Assigned doctor and patient profile.
- Active recovery plan and daily progress.
- Calendar-based task schedule.
- Task completion history.
- Daily recovery reviews with a 1-10 score and notes.
- Patient alerts and alert dismissal/read state.
- Medical file and uploaded report history.
- OCR extraction results from medical reports.

### Doctor experience

- Doctor registration and login.
- Assigned patient directory.
- Patient medical files and recovery history.
- Adherence and task-completion review.
- Daily review feed.
- Recovery plan generation, approval, cancellation, and task management.
- Medical report upload and OCR processing.
- Editable extracted medical data.
- Doctor alerts and alert resolution.

## Requirements

Install the following before starting:

- Node.js 20 or newer.
- npm 10 or newer.
- PostgreSQL 14 or newer, or a hosted PostgreSQL database such as Neon.
- A Groq API key for AI-assisted report processing. OCR itself uses Tesseract.js.

## Project Setup

Clone the repository and enter the project directory:

```bash
git clone https://github.com/aniTech-addict/mini_hackathon_2026.git
cd mini_hackathon_2026
```

### 1. Configure PostgreSQL

Create a PostgreSQL database, then initialize the schema:

```bash
psql "$DATABASE_URL" -f backend/db/schemas/schema.sql
```

If you are using a local database, an example connection URL is:

```text
postgresql://postgres:postgres@localhost:5432/recover_plus
```

The schema creates the users, doctors, patients, recovery plans, tasks, completions, reviews, alerts, reports, OCR data, and patient file tables.

### 2. Configure the backend

Create `backend/.env` from the example file:

```bash
cp backend/.env.example backend/.env
```

Set the values in `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/recover_plus
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
PORT=5000
GROQ_API_KEY=your-groq-api-key
```

`DATABASE_URL` is required. The backend intentionally stops with a clear error if it is missing.

### 3. Install backend dependencies and seed demo data

```bash
cd backend
npm install
npm run seed
```

The seed is safe to run more than once. It creates:

- 2 doctors.
- 6 patients.
- 6 active recovery plans.
- Recovery tasks and task completion history.
- Daily reviews.
- Patient files.
- Example doctor and patient alerts.

All seeded accounts use this password:

```text
RecoverPlus123!
```

Seeded doctor accounts:

| Role   | User ID         | Username       |
| ------ | --------------- | -------------- |
| Doctor | `doctor.ananya` | `ananya_mehta` |
| Doctor | `doctor.arjun`  | `arjun_rao`    |

Seeded patient accounts:

| Role    | User ID          | Username       |
| ------- | ---------------- | -------------- |
| Patient | `patient.rahul`  | `rahul_sharma` |
| Patient | `patient.priya`  | `priya_nair`   |
| Patient | `patient.vikram` | `vikram_patel` |
| Patient | `patient.meera`  | `meera_iyer`   |
| Patient | `patient.omkar`  | `omkar_joshi`  |
| Patient | `patient.fatima` | `fatima_khan`  |

### 4. Start the backend

From `backend/`:

```bash
npm run dev
```

Or run the production-style Node process:

```bash
npm start
```

The API runs at:

```text
http://localhost:5000
```

A basic health check is available at `GET /`.

### 5. Configure and start the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

The frontend defaults to:

```text
http://localhost:5000/api/v1
```

To use a different backend URL, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the Vite development server:

```bash
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173
```

## Demo Flow

1. Start PostgreSQL and initialize `backend/db/schemas/schema.sql`.
2. Configure `backend/.env`.
3. Run `npm run seed` from `backend/`.
4. Start the backend with `npm run dev`.
5. Start the frontend with `npm run dev` from `frontend/`.
6. Log in as `patient.rahul` to explore the patient flow.
7. Log out and log in as `doctor.ananya` to explore the doctor flow.
8. Complete a task, submit a daily review, inspect the alert, and review the patient from the doctor dashboard.

When the backend is unavailable, the frontend uses its bundled static data as a demo fallback. For database-backed behavior, make sure the API is running and log in with one of the seeded accounts.

## Backend API

All API routes are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint         | Auth   |
| ------ | ---------------- | ------ |
| `POST` | `/auth/register` | Public |
| `POST` | `/auth/login`    | Public |
| `GET`  | `/auth/me`       | JWT    |
| `POST` | `/auth/refresh`  | JWT    |
| `POST` | `/auth/logout`   | JWT    |

Send the token returned by login on protected requests:

```http
Authorization: Bearer <jwt>
```

### Patient routes

Patient routes require a JWT with the `patient` role.

- `/patients/me`
- `/patients/me/doctor`
- `/patient/recovery-plan`
- `/patient/recovery-plan/progress`
- `/patient/calendar`
- `/patient/tasks`
- `/patient/task-completions`
- `/patient/daily-reviews`
- `/patient/alerts`
- `/patient/reports`
- `/patient/file`

### Doctor routes

Doctor routes require a JWT with the `doctor` role.

- `/doctor/patients`
- `/doctor/patients/:patientId/file`
- `/doctor/patients/:patientId/reports`
- `/doctor/reports/:reportId/process`
- `/doctor/reports/:reportId/extracted-data`
- `/doctor/patients/:patientId/recovery-plans`
- `/doctor/recovery-plans/:planId`
- `/doctor/recovery-plans/:planId/tasks`
- `/doctor/patients/:patientId/task-completions`
- `/doctor/patients/:patientId/adherence`
- `/doctor/patients/:patientId/daily-reviews`
- `/doctor/alerts`

Report uploads accept JPEG, PNG, WEBP, TIFF, and PDF files up to 20 MB.

## Useful Commands

### Backend

```bash
cd backend
npm install          # Install dependencies
npm run seed         # Insert or update demo data
npm run dev          # Start with nodemon
npm start            # Start with Node
npm test             # Run Jest API tests
```

### Frontend

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start Vite development server
npm run build        # Type-check and create a production build
npm run lint         # Run ESLint
npm run preview      # Preview the production build
```

## Testing

The backend tests use Jest and Supertest. Most API tests mock database calls, so they do not require a live database:

```bash
cd backend
npm test
```

Before running integration-style manual checks, confirm that:

- `backend/.env` contains a valid `DATABASE_URL`.
- The schema has been applied.
- The backend is running on the port configured in `PORT`.
- The frontend `VITE_API_URL` points to the backend `/api/v1` base URL.

## Architecture

```text
React + Vite frontend
        |
        | REST/JSON, JWT Bearer token, multipart report upload
        v
Express API (/api/v1)
        |
        +-- Authentication and role-based access control
        +-- Patient recovery and adherence services
        +-- Doctor clinical review services
        +-- Tesseract.js OCR and Groq/LangChain processing
        v
PostgreSQL
```

The database uses UUID primary keys and foreign keys to isolate patient data. Doctors and patients are linked through their profile tables, and every protected route checks the authenticated role before accessing data.

## Troubleshooting

### `npm error ENOENT ... package.json`

Run npm from the correct application directory:

```bash
cd backend
npm install
```

or:

```bash
cd frontend
npm install
```

There is no root-level npm application script.

### `DATABASE_URL is missing`

Create `backend/.env` and set a valid PostgreSQL connection string. Do not leave `DATABASE_URL=` empty.

### `SASL: ... client password must be a string`

The PostgreSQL URL is malformed or does not contain a valid password. Check the username, password, host, database name, and URL encoding for special characters.

### `relation does not exist`

Apply the schema before running the seed:

```bash
psql "$DATABASE_URL" -f backend/db/schemas/schema.sql
```

### Frontend shows fallback data

The frontend intentionally falls back to static data when the API cannot be reached or returns an error. Check that:

- The backend is running.
- `VITE_API_URL` ends with `/api/v1`.
- The browser is using the current frontend dev server after environment changes.
- The login token is not stale in local storage.

### OCR or AI processing fails

Confirm that:

- The uploaded file is one of the supported formats.
- The file is smaller than 20 MB.
- `GROQ_API_KEY` is configured for AI extraction.
- The backend process has network access to the configured AI provider.

## Security Notes

- Never commit `backend/.env` or API keys.
- Use a long, random `JWT_SECRET` outside local demos.
- Use a least-privilege PostgreSQL user in deployed environments.
- The seeded password is for development and demonstration only.
- This project is a hackathon MVP and is not a substitute for clinical judgment or a production healthcare compliance review.
