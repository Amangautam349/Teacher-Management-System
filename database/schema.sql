-- =========================================================
-- Teacher Management System — Database Schema
-- PostgreSQL (designed for Neon Postgres)
-- =========================================================

-- Clean slate (safe to re-run in dev)
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS timetable CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================================================
-- USERS  (login + role -> drives Teacher vs Super Admin access)
-- =========================================================
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(150) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'teacher')),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- DEPARTMENTS
-- =========================================================
CREATE TABLE departments (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- TEACHERS  (1-to-1 profile extending a 'teacher' role user)
-- =========================================================
CREATE TABLE teachers (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department_id  INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  employee_code  VARCHAR(30) UNIQUE NOT NULL,
  phone          VARCHAR(20),
  designation    VARCHAR(100),
  qualification  VARCHAR(150),
  joining_date   DATE,
  photo_url      TEXT,
  address        TEXT,
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- SUBJECTS
-- =========================================================
CREATE TABLE subjects (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  code          VARCHAR(20) UNIQUE NOT NULL,
  department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- TIMETABLE  (8 periods/day, per teacher)
-- =========================================================
CREATE TABLE timetable (
  id          SERIAL PRIMARY KEY,
  teacher_id  INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id  INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Mon ... 7=Sun
  period_no   SMALLINT NOT NULL CHECK (period_no BETWEEN 1 AND 8),
  room        VARCHAR(30),
  UNIQUE (teacher_id, day_of_week, period_no)
);

-- =========================================================
-- ATTENDANCE  (daily, per teacher)
-- =========================================================
CREATE TABLE attendance (
  id          SERIAL PRIMARY KEY,
  teacher_id  INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  status      VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'half_day', 'on_leave')),
  marked_by   INTEGER REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE (teacher_id, date)
);

-- =========================================================
-- LEAVE REQUESTS
-- =========================================================
CREATE TABLE leave_requests (
  id           SERIAL PRIMARY KEY,
  teacher_id   INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  start_date   DATE NOT NULL,
  end_date     DATE NOT NULL,
  reason       TEXT NOT NULL,
  status       VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by  INTEGER REFERENCES users(id),
  created_at   TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- Helpful indexes
-- =========================================================
CREATE INDEX idx_teachers_department ON teachers(department_id);
CREATE INDEX idx_attendance_teacher_date ON attendance(teacher_id, date);
CREATE INDEX idx_timetable_teacher ON timetable(teacher_id);
CREATE INDEX idx_leave_teacher ON leave_requests(teacher_id);

-- =========================================================
-- Seed: departments only. The Super Admin user is created by
-- running `npm run seed` in /server (see server/utils/seed.js) —
-- that hashes the password properly with bcrypt at runtime instead
-- of a hash baked into this file.
-- =========================================================
INSERT INTO departments (name, description) VALUES
  ('Science', 'Physics, Chemistry, Biology'),
  ('Mathematics', 'Pure and Applied Mathematics'),
  ('English', 'Language and Literature'),
  ('Computer Science', 'Programming and IT');
