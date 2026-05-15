# Inkwell — Notes App with Authentication

A full-stack notes application built with the MERN stack.
Write, organize, and search your notes with markdown support.

🔗 **Live Demo:** https://notes-app-yourname.vercel.app

## Features

- JWT authentication (signup, login, logout)
- Full CRUD for notes
- Markdown editor with live preview
- Pin important notes to the top
- Real-time search across all notes
- Responsive design — works on all screen sizes
- Secure — password hashing with bcrypt, protected API routes

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Axios, React Router DOM  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs  
**Deployment:** Vercel (frontend) + Render (backend) + MongoDB Atlas

## Running Locally

```bash
# Clone
git clone https://github.com/itsakash-real/notes-app.git
cd notes-app

# Backend
cd backend
npm install
# Create .env with MONGO_URI, JWT_SECRET, PORT
npm run dev

# Frontend
cd ../frontend
npm install
# Create .env with VITE_API_URL=http://localhost:8000/api
npm run dev
```
## Architecture

- MVC pattern in backend (Models, Controllers, Routes)
- JWT stored in localStorage, attached via Axios interceptors
- Protected routes on both frontend (React Router) and backend (middleware)
- Custom React hook (useNotes) for clean separation of API logic

🏗️ Project Architecture Diagram (For Whiteboard Rounds)
┌──────────────────────────────────────────────────────────┐
│                    MERN Stack Architecture               │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  FRONTEND (React + Vite)                                 │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │AuthContext │  │ React Router │  │  Axios Instance │   │
│  │(JWT store) │  │ (navigation) │  │  (interceptors) │   │
│  └────────────┘  └──────────────┘  └────────┬────────┘   │
│                                             │            │
│                           HTTP + JWT        │            │
├─────────────────────────────────────────────┼────────────┤
│                                             ▼            │
│  BACKEND (Node.js + Express)                             │
│  ┌──────────────────────────────────────────────────┐    │
│  │  server.js → Routes → Middleware → Controllers   │    │
│  │                          │                       │    │
│  │               protect() verifies JWT             │    │
│  └──────────────────────────┬───────────────────────┘    │
│                             │ Mongoose                   │
├─────────────────────────────┼──────────────────────────  │
│                             ▼                            │
│  DATABASE (MongoDB Atlas)                                │
│  ┌──────────────┐  ┌───────────────────────────────┐     │
│  │ users        │  │ notes                         │     │
│  │ _id          │  │ _id, userId (→users), title   │     │
│  │ fullName     │  │ content, tags, isPinned       │     │
│  │ email        │  │ createdAt, updatedAt          │     │
│  │ password     │  └───────────────────────────────┘     │
│  │ (hashed)     │                                        │
│  └──────────────┘                                        │
└──────────────────────────────────────────────────────────┘
