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

### Step 1 — Clone or Download the Project

```bash
git clone https://github.com/your-username/WEB_PROGRAMMING_MINIPROJECT.git
cd WEB_PROGRAMMING_MINIPROJECT
```

> Or simply extract the project folder and open it.

---

### Step 2 — Set Up PostgreSQL Database & Seed Data

1. Open **pgAdmin** or the **psql** command-line tool.
2. Create a new database named `wpproj`:

```sql
CREATE DATABASE wpproj;
```

3. Connect to the `wpproj` database and execute the initialization script:

```bash
psql -U postgres -d wpproj -f backend/database/init.sql
```

> **Using pgAdmin (GUI):**
> 1. Expand **Databases** → right-click **wpproj** → click **Query Tool**.
> 2. Open `backend/database/init.sql` (or copy/paste its entire content).
> 3. Click **Execute (F5)**.
> 
> This creates all tables and automatically seeds **20 realistic student profiles** (with skills, departments, bios, and active interconnections). The default login password for all demo accounts is `password123`.

---

### Step 3 — Configure Environment Variables (.env)

For security reasons, `.env` contains sensitive passwords and secrets and is intentionally excluded from Git via `.gitignore`. 

A safe template [`backend/.env.example`](backend/.env.example) is provided. Create your `.env` file from this template:

**On Windows (PowerShell):**
```powershell
Copy-Item backend/.env.example -Destination backend/.env
```

**On macOS / Linux:**
```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and update the parameters to match your local PostgreSQL credentials:

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wpproj
JWT_SECRET=super_secret_jwt_key_2026
```

> **Note:**
> - Set `DB_PASSWORD` to your actual PostgreSQL superuser password.
> - Ensure `DB_NAME` matches the database you created in Step 2 (`wpproj`).

---

### Step 4 — Install Backend Dependencies

Open a terminal in the `backend/` directory and install the required npm packages:

```bash
cd backend
npm install
```

---

### Step 5 — Start the Backend Server

**For development (auto-restarts on file changes via nodemon):**
```bash
npm run dev
```

**For production:**
```bash
npm start
```

You should see:
```
Server running on http://localhost:5000
```

---

### Step 6 — Run and Access the Application

> ⚠️ **IMPORTANT — DO NOT OPEN AS A LOCAL FILE (`file:///`):**
> You cannot simply double-click `campus-skill-exchange/index.html` from File Explorer. Modern web browsers enforce strict security and Cross-Origin Resource Sharing (CORS) restrictions on `file:///` URLs, which will block API requests and local storage handling. **You must access the app through a `localhost` web address.**

#### Option A (Recommended — Direct via Backend Server):
Since the backend server serves the frontend static files automatically, simply open your browser and go to:
👉 **[http://localhost:5000](http://localhost:5000)**
*(or http://localhost:5000/campus-skill-exchange/index.html)*

#### Option B (Using VS Code Live Server):
If you prefer running a dedicated frontend development server:
1. Open the project in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `campus-skill-exchange/index.html` → select **"Open with Live Server"**.
4. Your browser will open the app at `http://127.0.0.1:5500/campus-skill-exchange/index.html`.

---

## Project Structure

```
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
|       |   +-- db.js                  (PostgreSQL connection pool)
|       +-- middleware/
|       |   +-- auth.js                (JWT authentication middleware)
|       +-- controllers/
|       |   +-- authController.js      (Register, Login, getMe logic)
|       |   +-- userController.js      (Student search & profile query)
|       |   +-- skillController.js     (Skills CRUD & profile update)
|       |   +-- requestController.js   (Connection requests CRUD)
|       +-- routes/
|           +-- authRoutes.js          (POST /register, /login)
|           +-- userRoutes.js          (GET /search, /:id)
|           +-- profileRoutes.js       (GET/PUT /me, skills CRUD)
|           +-- requestRoutes.js       (GET, POST, PUT, DELETE requests)
|
+-- backend/.env.example               (Safe template for environment variables)
+-- .gitignore                         (Protects .env, node_modules, logs)
+-- README.md
```

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| **POST** | `/api/auth/register` | Register a new user | No |
| **POST** | `/api/auth/login` | Login and receive a JWT token | No |
| **GET** | `/api/profile/me` | Fetch logged-in user profile | Yes (JWT) |
| **PUT** | `/api/profile/update` | Update bio, department, year | Yes (JWT) |
| **GET** | `/api/profile/skills` | Get offering & learning skills | Yes (JWT) |
| **POST** | `/api/profile/skills` | Add an offering or learning skill | Yes (JWT) |
| **DELETE** | `/api/profile/skills/:skillId/:type` | Remove a skill | Yes (JWT) |
| **GET** | `/api/users/search` | Search students by name, skill, dept | Yes (JWT) |
| **GET** | `/api/users/:id` | Get specific student profile & skills | Yes (JWT) |
| **GET** | `/api/requests` | Get incoming & outgoing requests | Yes (JWT) |
| **POST** | `/api/requests` | Send a collaboration request | Yes (JWT) |
| **PUT** | `/api/requests/:id` | Accept or decline incoming request | Yes (JWT) |
| **DELETE** | `/api/requests/:id` | Cancel request or remove connection | Yes (JWT) |

---

## Common Issues & Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| **`Cannot GET /`** | Accessing backend root before static routing | Visit `http://localhost:5000` (auto-redirects) or `http://localhost:5000/campus-skill-exchange/index.html` |
| **API calls fail when opening `index.html`** | Opening as `file:///...` directly | Browsers block `file:///` API calls due to CORS. Always access via `http://localhost:5000` |
| **`ECONNREFUSED` on login/register** | Backend server is offline | Start backend with `npm run dev` inside `backend/` |
| **`password authentication failed`** | Incorrect PostgreSQL password in `.env` | Update `DB_PASSWORD` in `backend/.env` to match PostgreSQL |
| **`relation "users" does not exist`** | Database schema was not initialized | Run `backend/database/init.sql` in pgAdmin Query Tool |
| **Duplicate key error during seeding** | Seed data already exists | All statements have `ON CONFLICT DO NOTHING`, safe to re-run |

---

## Team

Web Programming Mini Project — Campus Skill Exchange Platform

---

Happy learning!
