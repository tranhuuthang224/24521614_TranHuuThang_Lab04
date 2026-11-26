# Lab 04: Multi-Route SPA Architecture, Context Form Engine & Full-Stack React 19 Systems

- **Course:** Web Development — University of Information Technology (UIT - VNUHCM)
- **Instructor:** MSc. Tran Vinh Khiem (Smart Software System Team - S3T)
- **Student:** Trần Hữu Thắng (MSSV: 24521614)

## Tech Stack
- **Frontend:** React 19, React Router v7 (`react-router`), Vite 6, CSS Modules
- **Backend:** Express 5, CORS middleware, Node `crypto.randomUUID()`, Mongoose 9 / MongoDB

## Project Structure & Governance (Slide 33)
- `project-rules.md` — Architectural bans & full-stack verification contracts
- `TASK_DECOMPOSITION.md` — Work Breakdown Structure across Sprints 1–3 and Homeworks 1–3
- `AI_FAILURE_AUDIT.md` — Documented AI hallucinations and engineering fixes (15% evaluation component)
- `.env.example` — Environment template (copy to `.env` for local MongoDB configuration)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
3. **Run Backend API + MongoDB server (Terminal 1):**
   ```bash
   npm run server
   ```
4. **Run Vite Frontend dev server (Terminal 2):**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173`.

## Verification & Build

Run all contract verification suites (`102` checks across Sprints 1–3 and Homeworks 1–3) and production bundle build:
```bash
npm run test:verify:all
npm run build
```

## Git Branch Guide
Each branch runs and builds standalone:
- `ex1` — Sprint 1: React Router v7 `<Outlet />`, `useParams()`, CSS Grid, `React.lazy()` + `<Skeleton />`
- `ex2` — Sprint 2: Context Form Engine (`FormContext`, `useId()`, `ShowData` inspector)
- `ex3` — Sprint 3: Full-Stack Forum REST API & `AbortController` hook
- `hw1` — Homework 1: Photo & Evidence Gallery SPA (`useSearchParams()` + native `<dialog>`)
- `hw2` — Homework 2: Interactive Card-Swipe Deck (`SwipeDeck`, LIFO Undo Stack, Mongoose persistence)
- `hw3` — Homework 3: Esports Fair-Play Appeal Tribunal (`FairPlayAppealPortal`, `useAppealSlaTimer` Page Visibility API, Context Appeal Form)
- `main` — Unified complete submission
