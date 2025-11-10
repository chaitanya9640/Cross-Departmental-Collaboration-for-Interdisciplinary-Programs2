# CollaborateAI (Frontend + Backend)

## What's included
- `frontend/` — static HTML, styles, and JS (Tailwind used via CDN)
- `backend/` — Node.js + Express server, Socket.io, Mongoose models
- `backend/models` — Agent and Project Mongoose models
- `.env.example` — example environment variables

## Quick start (local)
1. Make sure you have Node.js and MongoDB installed.
2. Start MongoDB (e.g. `mongod` or use your OS service).
3. In a terminal:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # (edit .env if using a remote MongoDB URI)
   npm run dev
   ```
4. Open your browser at `http://localhost:5000`

Frontend will try to fetch `/api/agents`. If the DB is empty, you can POST agents:
```bash
curl -X POST http://localhost:5000/api/agents -H "Content-Type: application/json" -d '{"name":"ProjectManager","status":"working","tasks":24,"successRate":96.5}'
```
