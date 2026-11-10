# Teacher Management System

A full-stack web application for managing teachers, departments, and school administration. Built with React, Node.js, Express, and PostgreSQL.

## Project Overview

The Teacher Management System provides a centralized platform for managing teacher profiles, departments, user accounts, and administrative information.

The application uses JWT authentication and role-based access control for Super Admin and Teacher accounts.

## Current Development Status

### Implemented features

- React frontend with Vite and Tailwind CSS
- Node.js and Express REST API
- PostgreSQL database and relational schema
- JWT-based authentication
- Role-based access control
- Super Admin login
- Dashboard with summary statistics
- Teacher management (CRUD)
- Department management (CRUD)
- Teacher login account provisioning
- Responsive application layout with sidebar and navigation

### Planned features

- Attendance management
- Leave request and approval workflow
- Timetable management with an 8-period grid
- Calendar and school notices
- Real-time messaging and chat
- Reports and analytics
- Production deployment

*Development is ongoing. Features listed as planned are not yet complete.*

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Authentication | JWT, bcrypt |
| Database | PostgreSQL |
| Real-time infrastructure | Socket.IO |

## Project Structure

```text
teacher-management-system/
│
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── package.json
│
├── database/
│   └── schema.sql          # Database schema
│
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

Install the following:

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the repository

```powershell
git clone https://github.com/Amangautam349/Teacher-Management-System.git

cd Teacher-Management-System
```

### 2. Set up the database

Create a PostgreSQL database named:

```text
teacher_management
```

Run the database schema from the project root:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5432 -d teacher_management -f database/schema.sql
```

If PostgreSQL's `psql` command is already available in your PATH, you can alternatively use:

```bash
psql -U postgres -d teacher_management -f database/schema.sql
```

### 3. Configure the backend

Open the server directory:

```powershell
cd server
```

Create the environment file:

```powershell
Copy-Item .env.example .env
```

Update `server/.env` with your local PostgreSQL connection details and a strong, unique JWT secret.

Example configuration structure:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:YOUR_ENCODED_PASSWORD@localhost:5432/teacher_management
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173

SEED_ADMIN_EMAIL=admin@tms.local
SEED_ADMIN_PASSWORD=YOUR_STRONG_ADMIN_PASSWORD
SEED_ADMIN_NAME=System Admin
```

Do not commit your actual `.env` file or share its credentials.

Install dependencies:

```powershell
npm install
```

Create the initial Super Admin account:

```powershell
npm run seed
```

Start the backend:

```powershell
npm run dev
```

Backend address:

`http://localhost:5000`

### 4. Configure the frontend

Open a second terminal at the project root:

```powershell
cd client
```

Create the frontend environment file:

```powershell
Copy-Item .env.example .env
```

Ensure `client/.env` contains:

```env
VITE_API_URL=http://localhost:5000/api
```

Install dependencies:

```powershell
npm install
```

Start the frontend:

```powershell
npm run dev
```

Frontend address:

`http://localhost:5173`

### 5. Log in

Use the Super Admin email and password configured in `server/.env`.

Change the initial administrator password before using the system with real data.

## Database Design

The PostgreSQL schema includes tables for:

- Users
- Departments
- Teachers
- Subjects
- Timetable
- Attendance
- Leave requests

The schema separates user authentication information from teacher profile information.

## Application Architecture

### Authentication and authorization

JWT authentication is used to identify authenticated users. Role-based middleware handles access restrictions on the backend.

### Teacher management

Teacher profiles are associated with user accounts. Teacher creation provisions the corresponding login account through a database transaction.

### Department management

Departments are managed through the backend API and displayed in the React frontend.

## Development Roadmap

The project is being developed incrementally, with a focus on building and testing each module before moving to the next stage.

Future development will include attendance, leave management, scheduling, communication, and reporting.

## Deployment Plans

Potential deployment services:

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

Production deployment and configuration are not yet completed.

## Author

**Aman Gautam**

GitHub: [@Amangautam349](https://github.com/Amangautam349)

## License

This project is currently under development. A formal license can be added when the distribution terms are decided.