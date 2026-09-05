# Campus Skill Exchange

A peer-to-peer skill exchange platform for college students. Students can register, log in, discover tutors, send collaboration requests, and track their learning journey.

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | HTML5, CSS3, Bootstrap 5, Vanilla JS    |
| Backend  | Node.js, Express.js                     |
| Database | PostgreSQL                              |
| Auth     | JWT (JSON Web Tokens) + bcrypt          |

---

## Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 or higher)
- A browser (Chrome, Firefox, Edge, etc.)

---

## Setup & Execution Steps

### Step 1 - Clone or Download the Project

`ash
git clone https://github.com/your-username/WEB_PROGRAMMING_MINIPROJECT.git
cd WEB_PROGRAMMING_MINIPROJECT
`

> Or simply extract the ZIP and open the folder.

---

### Step 2 - Set Up the PostgreSQL Database

1. Open **pgAdmin** or the **psql** command-line tool.
2. Create a new database:

`sql
CREATE DATABASE wpproj;
`

3. Connect to the database and run the initialisation script to create all tables:

`ash
psql -U postgres -d wpproj -f backend/database/init.sql
`

> On Windows you can also open ackend/database/init.sql in pgAdmin's Query Tool and execute it manually.

---

### Step 3 - Configure Environment Variables

Open ackend/.env and update the values to match your local PostgreSQL setup:

`env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wpproj
JWT_SECRET=super_secret_jwt_key_2026
`

> **Important:** Change DB_PASSWORD to match your actual PostgreSQL password.

---

### Step 4 - Install Backend Dependencies

Open a terminal, navigate to the backend folder, and install packages:

`ash
cd backend
npm install
`

---

### Step 5 - Start the Backend Server

**For development** (auto-restarts on file changes):

`ash
npm run dev
`

**For production:**

`ash
npm start
`

You should see:

`
Server running on port 5000
`

> The backend API will be available at http://localhost:5000.

---

### Step 6 - Open the Frontend

Simply open the main page in your browser:

`
campus-skill-exchange/index.html
`

You can double-click the file in File Explorer, or drag it into your browser.

> **No additional build step is needed** - the frontend is plain HTML/CSS/JS.

---

## Project Structure

`
WEB_PROGRAMMING_MINIPROJECT/
|
+-- campus-skill-exchange/         <- Frontend HTML pages
|   +-- index.html                 (Landing Page)
|   +-- login.html                 (Login)
|   +-- register.html              (Registration)
|   +-- dashboard.html             (Main Dashboard)
|   +-- search.html                (Find Students)
|   +-- student-profile.html       (View Student Profile)
|   +-- profile.html               (Edit Your Profile)
|   +-- requests.html              (Collaboration Requests)
|   +-- achievements.html          (Badges & Achievements)
|   +-- learning-paths.html        (Learning Journeys)
|   +-- community-highlights.html  (Featured Tutors)
|
+-- css/
|   +-- style.css                  (Global styles)
|
+-- js/
|   +-- script.js                  (Frontend JavaScript - API calls & UI logic)
|
+-- backend/
|   +-- server.js                  (Express app entry point)
|   +-- package.json
|   +-- .env                       (Environment variables - DO NOT commit)
|   +-- database/
|   |   +-- init.sql               (PostgreSQL schema - run this first)
|   +-- src/
|       +-- config/
|       |   +-- db.js              (PostgreSQL connection pool)
|       +-- controllers/
|       |   +-- authController.js  (Register & Login logic)
|       |   +-- requestController.js (Skill request logic)
|       +-- routes/
|           +-- authRoutes.js
|           +-- requestRoutes.js
|
+-- README.md
`

---

## API Endpoints

| Method | Endpoint             | Description                     | Auth Required |
|--------|----------------------|---------------------------------|---------------|
| POST   | /api/auth/register   | Register a new user             | No            |
| POST   | /api/auth/login      | Login and receive a JWT token   | No            |
| POST   | /api/requests        | Create a new skill-swap request | Yes (JWT)     |

### Register - Request Body
`json
{
  "username": "Aditi Verma",
  "email": "aditi@college.edu",
  "password": "yourpassword"
}
`

### Login - Request Body
`json
{
  "email": "aditi@college.edu",
  "password": "yourpassword"
}
`

### Login - Response
`json
{
  "token": "<JWT token>",
  "user": {
    "id": "<uuid>",
    "username": "Aditi Verma"
  }
}
`

> The JWT token is automatically stored in localStorage by the frontend after a successful login.

---

## How Authentication Works

1. Register an account at egister.html.
2. Log in at login.html.
3. The backend validates credentials and returns a signed JWT token.
4. The frontend stores the token in localStorage as campusskill_token.
5. The token is valid for **1 day**.
6. Clicking **Logout** removes the token from localStorage.

---

## Common Issues

| Problem                               | Solution                                                          |
|---------------------------------------|-------------------------------------------------------------------|
| ECONNREFUSED on login/register        | Backend is not running - run 
pm run dev inside ackend/      |
| password authentication failed      | Wrong DB_PASSWORD in .env                                     |
| elation "users" does not exist     | init.sql was not run - repeat Step 2                            |
| CORS error in browser console         | Ensure backend is running on port 5000                            |

---

## Team

Web Programming Mini Project - Campus Skill Exchange Platform

---

Happy learning!
