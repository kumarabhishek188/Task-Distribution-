# MERN Admin-Agent Task Distribution System

## Overview
A mini CRM system for managing agents and distributing tasks/leads via CSV upload.

### Features
- JWT-based admin authentication
- Agent management (add/edit/delete agents)
- CSV/XLS/XLSX upload for leads/tasks
- Automatic, equal distribution of tasks among agents
- MongoDB storage for agents and tasks
- Frontend dashboard for task distribution

### Tech Stack
- Frontend: Next.js (React, TypeScript, Tailwind CSS)
- Backend: Express.js (Node.js)
- Database: MongoDB
- Auth: JWT
- File Handling: Multer, csv-parser, xlsx

## Getting Started

### Frontend
```
cd client
npm install
npm run dev
```

### Backend
```
cd server
npm install
npm start
```

### Docker (recommended for easiest run)
```
cd /Users/banke2408/Downloads/task
docker compose up --build
```
Services:
- MongoDB: localhost:27017
- Backend API: http://localhost:5000/api
- Frontend: http://localhost:3000

Environment overrides:
- Set JWT_SECRET in your shell before running:
	- macOS zsh: `export JWT_SECRET=change_me`
```

## Folder Structure
- `/client` - Next.js frontend
- `/server` - Express.js backend
- `/shared` - (optional) shared types

## Setup Instructions
1. Install dependencies in both `client` and `server` folders.
2. Configure MongoDB connection in backend.
3. Start backend and frontend servers.

---
For more details, see `.github/copilot-instructions.md`.
