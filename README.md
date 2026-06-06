# Inkwell

<div align="center">

### A full-stack notes application built with the MERN stack

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-5c5fef?style=for-the-badge)](https://frontend-ten-sigma-76.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://backend-gamma-two-24.vercel.app)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)

</div>

---

## Project Overview

Inkwell is a production-grade, full-stack notes application that lets users create, organize, and search personal notes with markdown support. It solves the common problem of scattered note-taking by providing a clean, fast interface with real-time search, tag organization, and the ability to pin important notes to the top.

**Key benefits:**
- Capture ideas instantly with markdown formatting and live preview
- Find any note in seconds with real-time keyword search
- Keep important notes visible with pinning
- Access your notes from anywhere with cloud sync

Built as a portfolio project to demonstrate professional full-stack engineering — from design system and state management to API design, security hardening, and deployment.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | [https://frontend-ten-sigma-76.vercel.app](https://frontend-ten-sigma-76.vercel.app) |
| Backend API | [https://backend-gamma-two-24.vercel.app](https://backend-gamma-two-24.vercel.app) |

> **Test Account:** `demo@inkwell.app` / `Demo1234`

---

## Application Walkthrough Video

<!-- Replace with your actual demo video embed -->
[![Inkwell Demo](https://img.shields.io/badge/Watch_Demo-Coming_Soon-5c5fef?style=for-the-badge)](https://youtube.com)

---

## Features

### Authentication & Security
- User registration with password strength validation
- JWT-based authentication with 7-day token expiry
- Password hashing with bcrypt (10 salt rounds)
- Server-side input validation on all endpoints
- Rate limiting on authentication routes
- MongoDB operator injection protection
- IDOR prevention — every mutation verifies ownership atomically
- Security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)

### Notes
- Full CRUD operations with optimistic UI updates
- Markdown editor with inline preview tab
- Real-time search across title, content, and tags
- Pin/unpin — pinned notes always sort first
- Tag system with comma-separated input and live tag preview
- Word count tracking

### UI / UX
- Professional SaaS design system with custom color palette
- Fully responsive — mobile, tablet, and desktop
- Skeleton loading states during data fetch
- Toast notifications for all user actions
- Error states with retry capability
- Empty states for new users and no search results
- Keyboard shortcut `⌘K` / `Ctrl+K` to create a new note
- Relative timestamps on note cards ("5m ago", "2d ago")

---

## Architecture Overview

### System Design

```
┌──────────────┐     HTTPS + JWT      ┌──────────────────┐     Mongoose      ┌──────────────┐
│   Browser    │ ──────────────────▶ │  Express API      │ ──────────────▶  │ MongoDB Atlas │
│  React SPA   │ ◀────────────────── │  (Vercel Serverless)│ ◀──────────────  │  (M0 Cluster) │
└──────────────┘     JSON responses   └──────────────────┘                   └──────────────┘
```

### Frontend
- **React 19** with functional components and hooks
- **Context API** for global auth state
- **Custom hooks** for API-mediated data fetching
- **Feature-based folder structure** — auth and notes are self-contained
- **API abstraction layer** — components never touch Axios directly
- **Code splitting** — routes load as separate chunks via `React.lazy`
- **React.memo** and **useMemo** for render optimization
- **Tailwind CSS 3** with a custom design system

### Backend
- **Express 5** with MVC + Service Layer pattern
- **Service layer** — business logic separated from controllers
- **Validation middleware** — custom declarative validation engine
- **Centralized error handling** — `AppError` class + catch-all middleware
- **Async handler wrapper** — eliminates try/catch in controllers
- **Dual entry points** — shared `app.js` for both local dev and Vercel serverless

### Database
- **MongoDB Atlas** — cloud-hosted NoSQL database
- **Mongoose ODM** — schema validation, compound indexes, lean queries
- **Optimized indexes** — compound index on `(userId, isPinned, updatedAt)` for listing queries, text index for search, email index for login lookups

### Authentication
- **JWT** — stateless token authentication with configurable expiry
- **bcryptjs** — salted password hashing (10 rounds)
- **Password complexity** — minimum 8 characters with uppercase, lowercase, and digit required
- **`select: false`** on password field — never returned in queries unless explicitly selected
- **Atomic ownership checks** — `findOneAndUpdate({_id, userId})` combines auth + mutation in one query

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|--------|
| **Frontend** | React 19 | UI library |
| | Tailwind CSS 3 | Utility-first styling |
| | Vite 8 | Build tool and dev server |
| | React Router DOM 7 | Client-side routing with lazy loading |
| | Axios 1.x | HTTP client with interceptors |
| | React Markdown 10 | Markdown rendering in cards and preview |
| | React Hot Toast 2 | Toast notifications |
| | Lucide React 1.x | Icon library (tree-shaken) |
| **Backend** | Node.js | JavaScript runtime |
| | Express 5 | Web framework |
| | Mongoose 9 | MongoDB ODM with schema validation |
| | jsonwebtoken 9 | JWT signing and verification |
| | bcryptjs 3 | Password hashing |
| | dotenv 17 | Environment variable management |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL (M0 free tier) |
| **Deployment** | Vercel | Serverless backend + CDN frontend |

---

## Backend Architecture

```mermaid
graph TD
    subgraph "Entry Points"
        SERVER[server.js<br/>Local Dev] --> APP
        VERCEL[api/index.js<br/>Vercel Serverless] --> APP
    end

    subgraph "App Setup"
        APP[app.js] --> CORS[CORS Config]
        APP --> SEC[Security Headers<br/>HSTS, CSP, X-Frame-Options]
        APP --> RATE[Rate Limiter<br/>10 req/15min on auth]
        APP --> JSON[JSON Parser<br/>10KB limit]
        APP --> ROUTES
    end

    subgraph "Routes"
        ROUTES --> AUTH_ROUTES[/api/auth]
        ROUTES --> NOTES_ROUTES[/api/notes]
    end

    subgraph "Middleware Pipeline"
        AUTH_ROUTES --> VALIDATE_AUTH[validate<br/>signup/login rules]
        AUTH_ROUTES --> PROTECT[protect<br/>JWT verify]
        VALIDATE_AUTH --> AUTH_CTRL
        NOTES_ROUTES --> PROTECT
        PROTECT --> VALIDATE_NOTES[validate<br/>note rules]
        VALIDATE_NOTES --> NOTES_CTRL
    end

    subgraph "Service Layer"
        AUTH_CTRL[authController] --> AUTH_SVC[authService<br/>signup / login / getUser]
        NOTES_CTRL[notesController] --> NOTES_SVC[notesService<br/>CRUD / search / pin]
    end

    subgraph "Data Layer"
        AUTH_SVC --> USER_MODEL[User Model]
        NOTES_SVC --> NOTE_MODEL[Note Model]
        USER_MODEL --> DB[(MongoDB Atlas)]
        NOTE_MODEL --> DB
    end

    subgraph "Error Handling"
        AUTH_CTRL --> ERR[errorMiddleware]
        NOTES_CTRL --> ERR
        AUTH_SVC --> ERR
        NOTES_SVC --> ERR
        ERR --> CLIENT[Consistent Error Response]
    end
```

**Request lifecycle:**
1. Request enters → CORS validation → Security headers added
2. Auth routes: rate limiter → input validation → controller → service → model → DB
3. Notes routes: JWT verification → input validation → controller → service → model → DB
4. Service layer handles business logic and throws `AppError` for expected failures
5. Error middleware catches all errors → returns consistent `{success: false, message}` response

---

## Folder Structure

```
notes-app/
├── backend/
│   ├── api/
│   │   └── index.js                    # Vercel serverless entry
│   ├── config/
│   │   ├── db.js                       # MongoDB connection (timeouts, pool)
│   │   └── env.js                      # Typed env access + validation
│   ├── controllers/
│   │   ├── authController.js           # Thin — delegates to authService
│   │   └── notesController.js          # Thin — delegates to notesService
│   ├── middleware/
│   │   ├── asyncHandler.js             # Wraps async route handlers
│   │   ├── authMiddleware.js           # JWT verification — protect()
│   │   ├── errorMiddleware.js          # Centralized error handler
│   │   ├── rateLimiter.js              # In-memory rate limiter
│   │   └── validate.js                 # Declarative validation engine
│   ├── models/
│   │   ├── User.js                     # email, fullName, password (select: false)
│   │   └── Note.js                     # title, content, tags, isPinned, userId
│   ├── routes/
│   │   ├── authRoutes.js               # /api/auth/* with validation
│   │   └── notesRoutes.js              # /api/notes/* with validation
│   ├── services/
│   │   ├── authService.js              # Business logic — signup, login, getById
│   │   └── notesService.js             # Business logic — CRUD, search, pin
│   ├── utils/
│   │   ├── AppError.js                 # Custom error with status code
│   │   └── response.js                 # Consistent response formatter
│   ├── validators/
│   │   ├── auth.js                     # Signup/login validation rules
│   │   └── notes.js                    # Note CRUD/search validation rules
│   ├── app.js                          # Shared Express app
│   ├── server.js                       # Local dev entry
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                        # API abstraction layer
│   │   │   ├── client.js               # Axios instance + interceptors
│   │   │   ├── auth.js                 # loginUser(), signupUser()
│   │   │   └── notes.js                # fetchNotes(), createNote(), etc.
│   │   ├── components/
│   │   │   ├── layout/                 # Structural components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── ScrollToTop.jsx
│   │   │   └── ui/                     # Reusable presentational components
│   │   │       ├── EmptyState.jsx
│   │   │       ├── ErrorBanner.jsx
│   │   │       ├── InputField.jsx
│   │   │       ├── PageTransition.jsx
│   │   │       └── SkeletonCard.jsx
│   │   ├── features/                   # Feature-based modules
│   │   │   ├── auth/
│   │   │   │   ├── AuthContext.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   └── notes/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── NoteCard.jsx
│   │   │       ├── NoteModal.jsx
│   │   │       ├── DeleteConfirmModal.jsx
│   │   │       └── useNotes.js
│   │   ├── hooks/
│   │   │   └── useDebounce.js
│   │   ├── App.jsx                     # Router + Suspense + Toaster
│   │   ├── index.css                   # Design system + Tailwind
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js                  # Code splitting config
│   └── package.json
│
├── .gitignore
├── package.json                        # Root — concurrently scripts
└── README.md
```

---

## API Endpoints

**Base URL:** `https://backend-gamma-two-24.vercel.app/api`  
**Local:** `http://localhost:8000/api`

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/signup` | No | Register new user |
| `POST` | `/auth/login` | No | Login, receive JWT |
| `GET` | `/auth/me` | Yes | Get current user profile |

### Notes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/notes` | Yes | List all notes (pinned first) |
| `POST` | `/notes` | Yes | Create a note |
| `GET` | `/notes/search?q=` | Yes | Search notes by keyword |
| `GET` | `/notes/:id` | Yes | Get single note |
| `PUT` | `/notes/:id` | Yes | Update a note |
| `DELETE` | `/notes/:id` | Yes | Delete a note |
| `PUT` | `/notes/:id/pin` | Yes | Toggle pin status |

### Example Request — Create Note

```http
POST /api/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "title": "Meeting Notes",
  "content": "# Agenda\n\n- Review Q4 goals\n- Plan Q1 roadmap",
  "tags": ["work", "meeting"]
}
```

### Example Response — Create Note

```json
{
  "success": true,
  "message": "Note created successfully",
  "note": {
    "_id": "674a1b2c3d4e5f6a7b8c9d0e",
    "userId": "674a1b2c3d4e5f6a7b8c9d01",
    "title": "Meeting Notes",
    "content": "# Agenda\n\n- Review Q4 goals\n- Plan Q1 roadmap",
    "tags": ["work", "meeting"],
    "isPinned": false,
    "createdAt": "2026-06-06T10:00:00.000Z",
    "updatedAt": "2026-06-06T10:00:00.000Z"
  }
}
```

### Example Request — Search

```http
GET /api/notes/search?q=meeting
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Error Response Format

All errors follow a consistent structure:
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

| Code | Meaning |
|------|---------|
| `200` | OK |
| `201` | Created |
| `400` | Bad Request — validation failed |
| `401` | Unauthorized — missing/invalid token |
| `403` | Forbidden — not your resource |
| `404` | Not Found |
| `409` | Conflict — duplicate entry |
| `429` | Too Many Requests — rate limited |
| `500` | Internal Server Error |

---

## Authentication Flow

### Signup
1. Client sends `{fullName, email, password}` to `POST /api/auth/signup`
2. Validation middleware checks field lengths, email format, password complexity (8+ chars, uppercase, lowercase, digit)
3. `authService.signup()` checks for existing email → hashes password with bcrypt → creates user
4. JWT generated with `{id: userId}` payload, signed with `JWT_SECRET`, expires in 7 days
5. Response returns `{token, user: {id, fullName, email}}` — password never included

### Login
1. Client sends `{email, password}` to `POST /api/auth/login`
2. Service looks up user by email, explicitly selects `+password` (hidden by default)
3. bcrypt constant-time comparison — identical error for wrong email or wrong password
4. JWT returned with user info

### Authenticated Requests
1. Axios interceptor reads token from localStorage, attaches `Authorization: Bearer <token>` header
2. `protect()` middleware extracts token → `jwt.verify(token, JWT_SECRET)` → looks up user → attaches `req.user`
3. All notes routes use `router.use(protect)` — every endpoint is guarded
4. Notes mutations use `findOneAndUpdate({_id, userId})` — ownership check is atomic with the mutation
5. On 401 response, Axios response interceptor clears localStorage and redirects to /login

### Token Flow Diagram
```
SIGNUP / LOGIN                    AUTHENTICATED REQUEST
───────────────                   ─────────────────────
Client                              Client
  │                                   │
  │ POST credentials                  │ GET /api/notes
  ▼                                   │ Authorization: Bearer <token>
Express                               ▼
  │                                 protect middleware
  │ bcrypt.hash / .compare            │ jwt.verify(token, secret)
  ▼                                   │ User.findById(decoded.id)
MongoDB                               ▼
  │                                 req.user = user
  │ user created / found              │
  ▼                                   ▼
Express                             Controller
  │ jwt.sign({id}, secret)            │ notesService.getAll(userId)
  ▼                                   ▼
Client                              MongoDB
  │ {token, user}                     │ Note.find({userId})
  ▼                                   ▼
localStorage                        Client
  setItem("token", token)             │ 200 {notes: [...]}
                                      ▼
                                    Render dashboard
```

---

## Database Schema

### User Collection

| Field | Type | Constraints |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated |
| `fullName` | String | Required, 2-50 chars, trimmed |
| `email` | String | Required, unique, lowercase, validated format |
| `password` | String | Required, 8+ chars, `select: false` (never returned in queries) |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

**Index:** `{email: 1}` — optimizes login lookups

### Note Collection

| Field | Type | Constraints |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated |
| `userId` | ObjectId (ref: User) | Required, indexed |
| `title` | String | Required, max 150 chars, trimmed |
| `content` | String | Required, max 100k chars |
| `tags` | [String] | Max 10 items, lowercase |
| `isPinned` | Boolean | Default `false` |
| `createdAt` | Date | Auto (timestamps) |
| `updatedAt` | Date | Auto (timestamps) |

**Indexes:**
- `{userId: 1}` — single-field (from schema)
- `{userId: 1, isPinned: -1, updatedAt: -1}` — compound, covers main listing query
- `{title: "text", content: "text"}` — text index for search

---

## Security Features

| Category | Implementation |
|----------|---------------|
| **Authentication** | JWT signed with HS256, 7-day expiry, configurable via `JWT_EXPIRY` env var. `JWT_SECRET` must be ≥32 characters (validated at startup). |
| **Password Storage** | bcryptjs with 10 salt rounds. Password field has `select: false` on the schema — never returned in responses unless explicitly selected. |
| **Password Policy** | Minimum 8 characters. Must include uppercase, lowercase, and a digit. Enforced by both client-side validation and server-side validator middleware. |
| **Rate Limiting** | In-memory rate limiter on all `/api/auth` routes — 10 requests per 15-minute window per IP. Configurable via `RATE_LIMIT_WINDOW` and `RATE_LIMIT_MAX` env vars. |
| **IDOR Prevention** | Mutations use `findOneAndUpdate({_id, userId})` / `findOneAndDelete({_id, userId})` — ownership check and mutation are atomic. No separate check-then-act. List endpoints filter by `userId` at the query level. |
| **Input Validation** | Declarative validation middleware runs before every controller. Validates types, lengths, patterns. Strips unknown fields. Rejects `$`-prefixed keys (MongoDB operator injection protection). |
| **Query Sanitization** | Search queries have regex special characters escaped before `$regex`. Search results capped at 100 documents. |
| **ObjectId Validation** | All `:id` route params validated as valid MongoDB ObjectIds before DB queries — prevents CastErrors and injection. |
| **CORS** | Whitelist-based — only configured `FRONTEND_URL` and localhost dev origins. Strict methods and headers. |
| **Security Headers** | `Strict-Transport-Security` (HSTS), `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. |
| **Error Sanitization** | Operational errors return explicit messages via `AppError`. Unexpected errors return generic "Internal server error" in production. Stack traces only in development. |
| **Payload Limit** | JSON body parser limited to 10KB. |
| **Header Suppression** | `X-Powered-By` disabled. |
| **Frontend** | Safe `JSON.parse` of localStorage with try/catch. Token validated (min length, type check) before attaching to requests. 401 interceptor skips redirect if already on login page. ReactMarkdown sanitizes HTML by default. |
| **Environment** | All secrets in `.env`, gitignored. Required vars validated at startup with clear error messages. |

---

## Screenshots

### Login Page
<!-- Replace with actual screenshot -->
![Login Page](https://via.placeholder.com/800x500/f8f9fb/5c5fef?text=Login+Page+Screenshot)

### Signup Page
<!-- Replace with actual screenshot -->
![Signup Page](https://via.placeholder.com/800x500/f8f9fb/5c5fef?text=Signup+Page+Screenshot)

### Dashboard with Notes
<!-- Replace with actual screenshot -->
![Dashboard](https://via.placeholder.com/800x500/f8f9fb/5c5fef?text=Dashboard+Screenshot)

### Create Note Modal
<!-- Replace with actual screenshot -->
![Create Note](https://via.placeholder.com/800x500/f8f9fb/5c5fef?text=Create+Note+Screenshot)

### Search Notes
<!-- Replace with actual screenshot -->
![Search Notes](https://via.placeholder.com/800x500/f8f9fb/5c5fef?text=Search+Notes+Screenshot)

### Edit Note with Preview
<!-- Replace with actual screenshot -->
![Edit Note](https://via.placeholder.com/800x500/f8f9fb/5c5fef?text=Edit+Note+Screenshot)

---

## Installation

### Prerequisites

- Node.js 18+ and npm 9+
- MongoDB Atlas account (free tier works)
- Git

### Step 1 — Clone

```bash
git clone https://github.com/itsakash-real/Full-Stack-Notes-Application-Inkwell.git
cd Full-Stack-Notes-Application-Inkwell
```

### Step 2 — Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/inkwell?retryWrites=true&w=majority
JWT_SECRET=<generate-with-node-crypto>
FRONTEND_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
# → http://localhost:8000
```

### Step 3 — Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

Start the dev server:
```bash
npm run dev
# → http://localhost:5173
```

### Step 4 — Run Both (Optional)

From the project root:
```bash
npm install
npm run dev
# Starts backend + frontend concurrently
```

---

## Deployment

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Database Access** → Create user with read/write permissions
3. **Network Access** → Add `0.0.0.0/0` (required for Vercel's dynamic IPs)
4. Copy the connection string

### Backend — Vercel

```bash
cd backend
npx vercel --prod
```

Environment variables in Vercel dashboard:
| Variable | Value |
|----------|-------|
| `MONGO_URI` | Your Atlas connection string |
| `JWT_SECRET` | Generated 64-char random string |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Your Vercel frontend URL |
| `RATE_LIMIT_MAX` | `10` |
| `RATE_LIMIT_WINDOW` | `15` |

### Frontend — Vercel

```bash
cd frontend
npx vercel --prod
```

Environment variable:
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend.vercel.app/api` |

---

## Future Improvements

- **Refresh tokens** — add short-lived access tokens (15min) with long-lived refresh tokens stored in HttpOnly cookies
- **Pagination** — add limit/offset to notes list for users with hundreds of notes
- **Folders/Notebooks** — group notes into collections
- **Dark/Light theme toggle** — persist preference in localStorage
- **Note sharing** — generate shareable public links
- **Export** — download notes as Markdown or PDF
- **Rich text editor** — add a WYSIWYG option alongside markdown
- **Offline support** — service worker for basic offline note creation
- **Note version history** — track edits and allow rollback
- **Collaborative editing** — real-time sync with WebSockets

---

<div align="center">

Built with ❤️ by **Akash Maurya**

[GitHub](https://github.com/itsakash-real) · [LinkedIn](https://linkedin.com/in/akash-maurya-3160z) · [Email](mailto:akashmaurya3160@gmail.com)

</div>
