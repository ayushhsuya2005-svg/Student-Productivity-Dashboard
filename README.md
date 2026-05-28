<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

# 📚 StudyDash — Student Productivity Dashboard

> The all-in-one productivity platform designed for modern students. Track attendance, manage tasks, take notes, set schedules, and get AI-powered insights — all in one beautiful dashboard.

👉 **Live Demo**: [https://frontend-dun-five-96.vercel.app](https://frontend-dun-five-96.vercel.app)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | At-a-glance overview of streaks, tasks completed, CGPA, study hours, and weekly productivity charts |
| ✅ **Task Manager** | Create, edit, and organize tasks with priority levels, deadlines, and status tracking |
| 📝 **Notes** | Full-featured note-taking with create, edit, and delete functionality |
| 📅 **Schedule Planner** | Weekly timetable with color-coded events, drag-and-drop support, and today's schedule view |
| 🍅 **Pomodoro Timer** | Built-in focus timer with customizable work/break intervals |
| 📈 **Analytics** | Visual insights into your study patterns and productivity trends with Recharts |
| 🎯 **Placement Prep** | Dedicated section for placement and career preparation tracking |
| 🔐 **Authentication** | Secure JWT-based signup/login with protected routes |
| 🌗 **Dark/Light Mode** | Seamless theme switching with system preference detection |
| 🤖 **AI Assistant** | Smart study suggestions and personalized productivity insights |
| 📋 **Attendance Tracker** | Track class attendance with smart 75% criteria alerts |
| ⚙️ **Settings** | Customize your profile and app preferences |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — UI library with hooks & context API
- **Vite 8** — Lightning-fast build tool
- **TailwindCSS 4** — Utility-first styling
- **Framer Motion** — Smooth animations & transitions
- **Recharts** — Beautiful, responsive charts
- **Lucide React** — Modern icon library
- **React Router DOM v7** — Client-side routing

### Backend
- **Express 5** — Minimalist Node.js web framework
- **MongoDB + Mongoose 9** — NoSQL database with ODM
- **JWT** — Secure token-based authentication
- **bcryptjs** — Password hashing
- **CORS** — Cross-origin resource sharing

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/ayushhsuya2005-svg/Student-Productivity-Dashboard.git
cd Student-Productivity-Dashboard
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be running at **http://localhost:5173** (frontend) and **http://localhost:5000** (backend API).

---

## 📁 Project Structure

```
Student-Productivity-Dashboard/
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Auth logic (signup/login)
│   │   ├── taskController.js    # Task CRUD operations
│   │   ├── noteController.js    # Notes CRUD operations
│   │   └── scheduleController.js# Schedule CRUD operations
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Task.js              # Task schema
│   │   ├── Note.js              # Note schema
│   │   └── Schedule.js          # Schedule schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── tasks.js             # Task routes
│   │   ├── notes.js             # Note routes
│   │   └── schedule.js          # Schedule routes
│   ├── index.js                 # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIAssistant.jsx      # AI-powered study assistant
│   │   │   ├── AttendanceTracker.jsx # Attendance tracking widget
│   │   │   ├── PomodoroTimer.jsx    # Focus timer component
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   └── Topbar.jsx           # Top navigation bar
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   └── ThemeContext.jsx     # Dark/light theme state
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx  # Dashboard page wrapper
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Landing/home page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Signup.jsx           # Registration page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Tasks.jsx            # Task management
│   │   │   ├── Notes.jsx            # Note-taking
│   │   │   ├── Schedule.jsx         # Weekly schedule
│   │   │   ├── Pomodoro.jsx         # Pomodoro timer page
│   │   │   ├── Analytics.jsx        # Productivity analytics
│   │   │   ├── Placement.jsx        # Placement preparation
│   │   │   └── Settings.jsx         # User settings
│   │   ├── App.jsx                  # Root component & routing
│   │   ├── App.css                  # Global styles
│   │   ├── index.css                # Tailwind & base styles
│   │   └── main.jsx                 # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive JWT token |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks for logged-in user |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes` | Get all notes |
| `POST` | `/api/notes` | Create a note |
| `PUT` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |

### Schedule
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/schedule` | Get all schedule events |
| `POST` | `/api/schedule` | Create a schedule event |
| `PUT` | `/api/schedule/:id` | Update a schedule event |
| `DELETE` | `/api/schedule/:id` | Delete a schedule event |

> All endpoints (except auth) require a valid JWT token in the `Authorization: Bearer <token>` header.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/ayushhsuya2005-svg">Ayush</a>
</p>
