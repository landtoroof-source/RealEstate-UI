# PropAI — React Frontend

Luxury real estate AI chat interface connected to your FastAPI backend.

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start (make sure your FastAPI backend is also running)
npm start
# → Opens at http://localhost:3000
```

## Features
- AI chat via Groq Mixtral
- Quick reply chips to guide new users
- Auto lead capture banner after 4 exchanges (or when AI prompts for details)
- Lead form modal with name / email / phone
- Market stats sidebar
- Fully dark luxury theme

## Connecting to production backend

Edit `.env`:
```
REACT_APP_API_URL=https://your-app.onrender.com
```

Then rebuild:
```bash
npm run build
```

## Deploy frontend (free)

Option 1 — **Vercel** (recommended):
```bash
npm install -g vercel
vercel
```

Option 2 — **Netlify**:
```bash
npm run build
# Drag the /build folder to netlify.com/drop
```
