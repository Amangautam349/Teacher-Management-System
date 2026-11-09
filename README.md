# Teacher Management System

A full-stack Teacher Management System — React (Vite + Tailwind) frontend,
Node.js/Express REST API, PostgreSQL database, JWT authentication with
role-based access (Super Admin / Teacher).

## Status: Week 1–2 slice complete

Built so far, fully working end-to-end:
- [x] Project structure (client / server / database)
- [x] PostgreSQL schema (users, departments, teachers, subjects, timetable,
      attendance, leave_requests — later features already have tables ready)
- [x] JWT auth (login, `/me`, role middleware)
- [x] Dashboard layout + live summary stats
- [x] Teacher CRUD (create also provisions their login account, transactionally)
- [x] Department CRUD
- [x] Responsive shell (sidebar/navbar), role-aware navigation

Not yet built (next in the roadmap — see original plan):
- [ ] Attendance marking
- [ ] Leave request/approval flow
- [ ] Timetable (8-period grid)
- [ ] Calendar + notices
- [ ] Chat (Socket.IO server is already wired up in `server.js`, ready to use)
- [ ] Reports
- [ ] Deployment (Vercel / Render / Neon)

## Getting started

### 1. Database
Create a free Postgres database (e.g. on [Neon](https://neon.tech)), then run:
```bash
psql "$DATABASE_URL" -f database/schema.sql
```

### 2. Backend
```bash
cd server
npm install
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET
npm run seed            # creates your first Super Admin login
npm run dev              # http://localhost:5000
```

### 3. Frontend
```bash
cd client
npm install
cp .env.example .env    # point VITE_API_URL at your backend
npm run dev               # http://localhost:5173
```

Log in with the email/password you set as `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` in `server/.env`.

## Why things are structured this way

- **Teacher = users row + teachers row.** `users` handles anyone who can log
  in (admin or teacher) and holds the role. `teachers` holds the profile
  fields that only apply to teachers. Creating a teacher writes both rows
  in a single DB transaction (see `teacherController.js`) so you can never
  end up with a login and no profile, or vice versa.
- **Role checks happen in middleware, not in the UI.** `requireRole()` on
  the backend is the actual security boundary; hiding buttons in the React
  UI is just a UX nicety on top of that. Never trust the frontend alone.
- **Schema already includes tables for later weeks** (timetable, attendance,
  leave_requests) so each new feature is "build the endpoint," not
  "redesign the database mid-project."

## Tech stack
Frontend: React, Vite, React Router, Axios, Tailwind CSS
Backend: Node.js, Express.js, JWT, bcrypt, Multer (ready for file uploads), Socket.IO (ready for chat)
Database: PostgreSQL
Deployment target: Vercel (client) / Render (server) / Neon (database)
