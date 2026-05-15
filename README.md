<div align="center">

<br />

```
██╗███╗   ██╗██╗  ██╗██╗    ██╗███████╗██╗     ██╗
██║████╗  ██║██║ ██╔╝██║    ██║██╔════╝██║     ██║
██║██╔██╗ ██║█████╔╝ ██║ █╗ ██║█████╗  ██║     ██║
██║██║╚██╗██║██╔═██╗ ██║███╗██║██╔══╝  ██║     ██║
██║██║ ╚████║██║  ██╗╚███╔███╔╝███████╗███████╗███████╗
╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚══════╝╚══════╝
```

### Where ideas find their home.

<br />

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-e8b86d?style=for-the-badge&logoColor=white)](https://notes-app-yourname.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-Render-46E3B7?style=for-the-badge&logoColor=white)](https://notes-api-xxxx.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/itsakash-real/notes-app)

<br />

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

<br />

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Security](#-security)
- [Interview Q&A](#-interview-qa)
- [Author](#-author)

---

## 🔍 Overview

**Inkwell** is a production-grade, full-stack notes application built with the MERN stack. It supports secure user authentication using JSON Web Tokens, complete CRUD operations for notes, real-time keyword search, markdown formatting with live preview, and the ability to pin important notes to the top of your dashboard.

The project follows industry-standard practices — MVC architecture on the backend, custom React hooks and Context API on the frontend, Axios interceptors for automatic token injection, and protected routes on both client and server.

> Built as a portfolio project to demonstrate full-stack development skills across authentication, REST API design, database modelling, state management, and cloud deployment.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| **Frontend** | https://notes-app-yourname.vercel.app |
| **Backend API** | https://notes-api-xxxx.onrender.com |

> **Note:** The backend is hosted on Render's free tier. The first request after inactivity may take 30–60 seconds to wake the server. This is expected behaviour on the free plan.

**Test Account** *(feel free to use)*

```
Email:    demo@inkwell.app
Password: demo1234
```

---

## ✨ Features

### Authentication
- ✅ User registration with full name, email, and password
- ✅ Secure login with JWT token issuance (7-day expiry)
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Persistent sessions via localStorage
- ✅ Auto-logout on token expiry with redirect to login
- ✅ Protected routes on both client and server

### Notes
- ✅ Create, read, update, and delete notes
- ✅ Markdown editor with live preview tab
- ✅ Real-time search across title, content, and tags
- ✅ Pin / unpin notes — pinned notes always appear first
- ✅ Tag system with comma-separated input and live preview
- ✅ Notes sorted by pin status then last updated

### UI / UX
- ✅ Custom dark "Writer's Den" design system — warm amber on charcoal
- ✅ Responsive layout — works on mobile, tablet, and desktop
- ✅ Skeleton loading states while notes fetch
- ✅ Toast notifications for all user actions
- ✅ Hover-reveal action buttons on note cards
- ✅ Keyboard shortcut `⌘K` / `Ctrl+K` to create a new note
- ✅ Empty states for no notes and no search results
- ✅ Word count in note editor
- ✅ Password strength meter on signup

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI library |
| Vite | 5 | Build tool and dev server |
| Tailwind CSS | 3 | Utility-first styling |
| React Router DOM | 6 | Client-side routing |
| Axios | 1.x | HTTP client with interceptors |
| React Markdown | 9 | Render markdown in note cards |
| React Hot Toast | 2 | Toast notifications |
| Lucide React | 0.383 | Icon library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4 | Web framework |
| MongoDB | 7 | NoSQL database |
| Mongoose | 7 | MongoDB ODM |
| jsonwebtoken | 9 | JWT creation and verification |
| bcryptjs | 2 | Password hashing |
| cors | 2 | Cross-origin resource sharing |
| dotenv | 16 | Environment variable management |
| nodemon | 3 | Dev auto-restart |

### Infrastructure

| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted database (M0 free tier) |
| Render | Backend deployment (free web service) |
| Vercel | Frontend deployment (hobby plan) |
| GitHub | Version control and CI/CD trigger |

---

## 🏗 Architecture

### System Architecture

```
                        ┌──────────────────────────┐
  Browser / Mobile      │   Vercel CDN (Frontend)  │
  ─────────────────────▶│   React + Vite           │
                        │   Global Edge Network     │
                        └────────────┬─────────────┘
                                     │
                         HTTPS + JWT Bearer Token
                                     │
                                     ▼
                        ┌──────────────────────────┐
                        │   Render (Backend)       │
                        │   Node.js + Express      │
                        │                          │
                        │  ┌──────────────────┐   │
                        │  │  Middleware       │   │
                        │  │  ├ CORS           │   │
                        │  │  ├ JSON Parser    │   │
                        │  │  └ Auth (JWT)     │   │
                        │  └────────┬─────────┘   │
                        │           │              │
                        │  ┌────────▼─────────┐   │
                        │  │  Controllers     │   │
                        │  │  ├ authController│   │
                        │  │  └ notesController│  │
                        │  └────────┬─────────┘   │
                        └───────────┼──────────────┘
                                    │
                              Mongoose ODM
                                    │
                                    ▼
                        ┌──────────────────────────┐
                        │   MongoDB Atlas          │
                        │   Cloud Database         │
                        │                          │
                        │  Collections:            │
                        │  ├── users               │
                        │  └── notes               │
                        └──────────────────────────┘
```

### Backend MVC Structure

```
Request → Routes → Middleware → Controller → Model → MongoDB
                       │
                   protect()
                  (JWT verify)
```

### Authentication Flow

```
1. SIGNUP / LOGIN
   Client ──POST credentials──▶ Express
   Express ──bcrypt.compare()──▶ password check
   Express ──jwt.sign(userId)──▶ generate token
   Express ──token + user──────▶ Client
   Client stores token in localStorage

2. AUTHENTICATED REQUEST
   Client ──request + "Bearer <token>"──▶ Express
   protect middleware ──jwt.verify()────▶ validate token
   protect middleware ──req.user = user─▶ attach user
   Controller runs and returns data──────▶ Client

3. TOKEN EXPIRY
   Client request ──401 response──▶ Axios interceptor
   Interceptor ──clear localStorage, redirect /login──▶ User
```

---

## 📡 API Reference

**Base URL:** `https://notes-api-xxxx.onrender.com/api`

All protected routes require the header:
```
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | ❌ | Register a new user |
| `POST` | `/auth/login` | ❌ | Login and receive JWT token |
| `GET` | `/auth/me` | ✅ | Get current authenticated user |

#### POST `/auth/signup`

```json
// Request Body
{
  "fullName": "Akash Maurya",
  "email": "akash@example.com",
  "password": "mypassword123"
}

// Response 201
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64abc123...",
    "fullName": "Akash Maurya",
    "email": "akash@example.com"
  }
}
```

#### POST `/auth/login`

```json
// Request Body
{
  "email": "akash@example.com",
  "password": "mypassword123"
}

// Response 200
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "fullName": "...", "email": "..." }
}
```

### Notes Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/notes` | ✅ | Get all notes (pinned first) |
| `POST` | `/notes` | ✅ | Create a new note |
| `GET` | `/notes/:id` | ✅ | Get a single note |
| `PUT` | `/notes/:id` | ✅ | Update a note |
| `DELETE` | `/notes/:id` | ✅ | Delete a note |
| `PUT` | `/notes/:id/pin` | ✅ | Toggle pin status |
| `GET` | `/notes/search?q=` | ✅ | Search notes by keyword |

#### POST `/notes`

```json
// Request Body
{
  "title": "My Note Title",
  "content": "# Heading\n\nContent with **markdown** support.",
  "tags": ["work", "ideas"]
}

// Response 201
{
  "success": true,
  "message": "Note created successfully",
  "note": {
    "_id": "64abc...",
    "userId": "64xyz...",
    "title": "My Note Title",
    "content": "# Heading\n\nContent with **markdown** support.",
    "tags": ["work", "ideas"],
    "isPinned": false,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

#### GET `/notes/search?q=keyword`

```json
// Response 200
{
  "success": true,
  "count": 2,
  "query": "keyword",
  "notes": [ ...matching notes ]
}
```

### HTTP Status Codes Used

| Code | Meaning | When |
|---|---|---|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Missing or invalid fields |
| `401` | Unauthorized | No token / invalid token |
| `403` | Forbidden | Valid token, wrong ownership |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Email already registered |
| `500` | Server Error | Unexpected server failure |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

```bash
node --version   # v18.0.0 or higher
npm --version    # v9.0.0 or higher
git --version    # any recent version
```

You will also need:
- A free [MongoDB Atlas](https://mongodb.com/atlas) account
- A free [Render](https://render.com) account (for deployment)
- A free [Vercel](https://vercel.com) account (for deployment)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/itsakash-real/notes-app.git
cd notes-app
```

**2. Setup the Backend**

```bash
cd backend
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Open `.env` and fill in your values (see [Environment Variables](#-environment-variables) below).

Start the backend development server:

```bash
npm run dev
# Server running on http://localhost:8000
```

**3. Setup the Frontend**

Open a new terminal:

```bash
cd frontend
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Start the frontend development server:

```bash
npm run dev
# App running on http://localhost:5173
```

**4. Run Both Simultaneously (Optional)**

From the root `notes-app/` folder:

```bash
npm install        # installs concurrently
npm run dev        # starts both frontend and backend
```

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
# Server
PORT=8000
NODE_ENV=development

# Database — get from MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/notesapp?retryWrites=true&w=majority

# JWT — use a long, random string (minimum 32 characters)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# Frontend URL — for CORS (update to Vercel URL in production)
FRONTEND_URL=http://localhost:5173
```

### Frontend — `frontend/.env`

```env
# Backend API URL
VITE_API_URL=http://localhost:8000/api
```

### Frontend — `frontend/.env.production`

```env
# Replace with your actual Render backend URL
VITE_API_URL=https://notes-api-xxxx.onrender.com/api
```

> ⚠️ **Never commit `.env` files to Git.** All secret files are included in `.gitignore`. Add environment variables directly through your hosting provider's dashboard in production.

**Generate a secure JWT_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📁 Project Structure

```
notes-app/
│
├── backend/                          # Node.js + Express API
│   ├── config/
│   │   └── db.js                     # MongoDB connection with error handling
│   │
│   ├── controllers/                  # Business logic layer
│   │   ├── authController.js         # signup, login, getUser
│   │   └── notesController.js        # CRUD, search, pin toggle
│   │
│   ├── middleware/
│   │   └── authMiddleware.js         # JWT verification — protect()
│   │
│   ├── models/                       # Mongoose schemas
│   │   ├── User.js                   # email, fullName, password (hashed)
│   │   └── Note.js                   # title, content, tags, isPinned, userId
│   │
│   ├── routes/                       # Express route definitions
│   │   ├── authRoutes.js             # /api/auth/*
│   │   └── notesRoutes.js            # /api/notes/*
│   │
│   ├── .env                          # ← NOT committed to Git
│   ├── .env.example                  # Template with placeholder values
│   ├── .gitignore
│   ├── package.json
│   ├── Procfile                      # Render deployment config
│   └── server.js                     # Express app entry point
│
├── frontend/                         # React + Vite SPA
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── DeleteConfirmModal.jsx # Confirmation dialog before delete
│   │   │   ├── EmptyState.jsx         # No notes / no search results states
│   │   │   ├── InputField.jsx         # Reusable input with icon + error
│   │   │   ├── Navbar.jsx             # Search bar + user menu + new note btn
│   │   │   ├── NoteCard.jsx           # Note preview with hover actions
│   │   │   ├── NoteModal.jsx          # Create/Edit modal with markdown editor
│   │   │   ├── PageTransition.jsx     # Fade-in wrapper for pages
│   │   │   ├── ProtectedRoute.jsx     # Auth guard — redirects to /login
│   │   │   └── ScrollToTop.jsx        # Resets scroll on navigation
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global auth state + login/logout
│   │   │
│   │   ├── hooks/
│   │   │   └── useNotes.js            # All notes API logic in one hook
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Main notes grid + modals
│   │   │   ├── Login.jsx              # Split-screen login page
│   │   │   └── Signup.jsx             # Split-screen signup + password strength
│   │   │
│   │   ├── utils/
│   │   │   └── axiosInstance.js       # Pre-configured Axios + interceptors
│   │   │
│   │   ├── App.jsx                    # Router setup + Toaster
│   │   ├── index.css                  # Design system + Tailwind + fonts
│   │   └── main.jsx                   # React DOM entry point
│   │
│   ├── .env                           # ← NOT committed to Git
│   ├── .env.example
│   ├── .env.production                # Production API URL
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js             # Custom "Writer's Den" theme
│   └── vite.config.js                 # Vite + code splitting config
│
├── .gitignore                         # Root-level ignore file
├── package.json                       # Root — concurrently scripts
└── README.md
```

---

## ☁️ Deployment

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Configure:
   ```
   Root Directory:  backend
   Build Command:   npm install
   Start Command:   node server.js
   Instance Type:   Free
   ```
5. Add environment variables in the Render dashboard:
   ```
   NODE_ENV      production
   PORT          8000
   MONGO_URI     mongodb+srv://...
   JWT_SECRET    your_secret_here
   FRONTEND_URL  https://your-app.vercel.app
   ```
6. Deploy — your API will be live at `https://your-api.onrender.com`

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Configure:
   ```
   Framework:         Vite
   Root Directory:    frontend
   Build Command:     npm run build
   Output Directory:  dist
   ```
4. Add environment variable:
   ```
   VITE_API_URL   https://your-api.onrender.com/api
   ```
5. Deploy — your app will be live at `https://your-app.vercel.app`

### MongoDB Atlas Setup

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Database Access:** Create user with `Atlas Admin` role
3. **Network Access:** Add `0.0.0.0/0` (allow from anywhere)
4. **Connect:** Copy the connection string to your `MONGO_URI`

---

## 🔒 Security

This project implements the following security measures:

| Measure | Implementation |
|---|---|
| **Password Hashing** | bcryptjs with 10 salt rounds — passwords never stored in plain text |
| **JWT Signing** | Tokens signed with HS256 algorithm using a secret key |
| **Token Expiry** | JWT tokens expire after 7 days — limits damage if stolen |
| **IDOR Prevention** | Every write operation verifies `note.userId === req.user._id` |
| **CORS Restriction** | Backend only accepts requests from the configured frontend origin |
| **Input Validation** | Schema-level and controller-level validation on all inputs |
| **Environment Secrets** | All secrets in `.env` — never committed to version control |
| **HTTP Headers** | Security headers added via custom middleware |
| **Payload Limit** | JSON body limited to 10kb — prevents large payload attacks |
| **Vague Auth Errors** | Login returns "Invalid email or password" — prevents user enumeration |

### Known Limitations (Portfolio Project)

- JWT stored in localStorage (production should use HttpOnly cookies)
- No rate limiting on auth endpoints (would add `express-rate-limit` in production)
- No refresh token mechanism (access tokens expire and require re-login)
- Free-tier backend has cold start delay after inactivity

---

## 🗺️ Roadmap

- [ ] Refresh token implementation
- [ ] Note folders / collections
- [ ] Rich text editor option (TipTap)
- [ ] Note sharing via public link
- [ ] Dark / light theme toggle
- [ ] Export notes as PDF or Markdown file
- [ ] Mobile app (React Native)
- [ ] Collaborative notes (WebSockets)

---

## 🎤 Interview Q&A

A full set of **50 technical interview questions and answers** based on this project are documented separately.

Topics covered:
- JWT authentication flow
- bcrypt password hashing
- MongoDB schema design and indexing
- React Context API and custom hooks
- Axios interceptors
- REST API conventions
- MVC architecture
- IDOR security vulnerability
- Deployment and environment configuration
- Scaling considerations

> This project was built as part of a structured full-stack bootcamp. Every line of code was written with intent — not copied from templates.

---

## 🧑‍💻 Author

**Akash Maurya**
*Computer Science Undergraduate — Lovely Professional University*

[![GitHub](https://img.shields.io/badge/GitHub-itsakash--real-181717?style=flat-square&logo=github)](https://github.com/itsakash-real)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-akash--maurya--3160z-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/akash-maurya-3160z)
[![Email](https://img.shields.io/badge/Email-akashmaurya3160@gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:akashmaurya3160@gmail.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

```
MIT License — Copyright (c) 2025 Akash Maurya

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files, to deal in
the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software.
```

---

<div align="center">

**Built with 🔥 and a lot of `console.log()` debugging**

*If this project helped you learn — give it a ⭐ on GitHub*

</div>
