# Work Breakdown Structure (WBS) - Lab 04: Multi-Route SPA Architecture

**Course:** Web Development — University of Information Technology (UIT - VNUHCM)  
**Instructor:** MSc. Tran Vinh Khiem (Smart Software System Team - S3T)  
**Student:** Trần Hữu Thắng — MSSV: 24521614  
**Target Repository:** `https://github.com/tranhuuthang224/24521614_TranHuuThang_Lab04`  
**Active Working Branch:** `ex1`

---

## Block 1 (0–40m): Setup & Governance Protocols
- [x] Task 1.0.1: Initialize Git repository and link remote `origin https://github.com/tranhuuthang224/24521614_TranHuuThang_Lab04.git`.
- [x] Task 1.0.2: Configure `.gitignore`, `.env.example`, `package.json` (React 19, React Router v7, Vite 6).
- [x] Task 1.0.3: Author `project-rules.md` (Manifesto, Deprecation Audit, Full-Stack Contract).
- [x] Task 1.0.4: Create `AI_FAILURE_AUDIT.md` (AI hallucination tracking and engineering verification).
- [x] Task 1.0.5: Automated Verification script `scripts/verify-sprint1.js` enforcing Contract-First Loop.

---

## Block 2 (40–75m) — Sprint 1: Router Migration (Exercise 1)
- [x] **Task 1.1: Performance & Resiliency Architectural Upgrades (Ex 1.1 - Slide 9)**
  - Dynamic chunking via `React.lazy(() => import('./PersonDetail'))`.
  - Resilient route wrapping inside `<Suspense fallback={<Skeleton aria-busy="true" aria-live="polite" />}>`.
  - Zero Layout Shift (CLS = 0) dimension-matched `<Skeleton />` fallback component.
  - Semantic ARIA attributes `aria-busy="true"` and `aria-live="polite"`.

- [x] **Task 1.2: Declarative Syntax Updates & React Router v7 Layout Architecture (Ex 1.2 & 1.2.1 - Slide 10)**
  - Full eradication of deprecated React Router v5 syntax (`<Switch>`, `<Redirect>`, `exact`, `activeClassName`).
  - Declarative route hierarchy using `<Routes>` container and `<Route path="..." element={<Layout />} />`.
  - Nested layout rendering child views dynamically via `<Outlet />`.
  - Dynamic active link styling using functional callback syntax: `className={({ isActive }) => isActive ? 'active-link' : 'link'}`.

- [x] **Task 1.3: Master-Detail Views via React Router & CSS Grid (Ex 1.2.2 / 1.3.2 - Slide 11 & Slide 22)**
  - Responsive CSS Grid Layout: `grid-template-columns: minmax(280px, 1fr) 2fr` with 375px mobile breakpoint support.
  - Safe URL parameter extraction via React Router v7 `useParams()` hook (`const { id } = useParams()`).
  - Entity lookup with `people.find(p => p.id === id)`.
  - Explicit 404 boundary guard returning `<div role="alert">404: Person Not Found</div>` for invalid dynamic IDs.
  - Semantic HTML definition list structure using `<dl className="person-details">`, `<dt>`, and `<dd>`.

- [x] **Task 1.4: Sprint 1 Code Contract Compliance (Slide 22)**
  - `src/components/PeopleLayout.jsx`: Sidebar `<nav>` mapping `people` array to `<NavLink>`, wrapping `<main className="content-area"><Outlet /></main>`.
  - `src/components/PersonDetail.jsx`: Dynamic detail view with parameter parsing, 404 guard, semantic `<dl>`.
  - `src/data/people.js`: Normalized dataset including historic polymaths and UIT S3T profiles.

---

- [x] **Block 3 (75–120m) — Sprint 2: Context Form Engine (Exercise 2 / Ex 1.3 - Slides 13–15, 24–25)**
  - [x] **Task 2.1: Synchronous Form Validation Engine (`src/context/FormContext.jsx`)**
    - Single render-pass evaluation eliminating cascading 5-layer `useEffect` waterfalls (Slide 13 anti-pattern).
    - Pure derived error computation and cross-field validation (`confirmPassword` matching `password`).
    - Encapsulated provider pattern with `useFormContext` custom hook abstraction.
  - [x] **Task 2.2: Accessible InputField Component (`src/components/InputField.jsx`)**
    - Deterministic unique ID generation via React 19 `useId()`.
    - Screen reader binding with `aria-invalid` and `aria-describedby` linked to `${id}-error`.
    - Semantic accessible error messaging with `role="alert"`.
  - [x] **Task 2.3: Live State Inspector (`src/components/ShowData.jsx`)**
    - Semantic definition list `<dl className="json-inspector">`, `<dt>`, `<dd>` replacing unstructured `JSON.stringify`.
    - Key-value inspection of submitted payload.
  - [x] **Task 2.4: SimpleForm Architecture (`src/components/SimpleForm.jsx`)**
    - Multi-field input handling (`fullName`, `studentId`, `email`, `password`, `confirmPassword`).
    - Live real-time validation status badge without state lag.
    - Reset and Submit handlers with `<ShowData />` rendering upon valid submission.
  - [x] **Task 2.5: Router Integration & Verification**
    - Route `/form` added to `src/App.jsx` with top navigation link.
    - Automated verification suite `scripts/verify-sprint2.js` passing 22/22 tests.

---

- [x] **Block 4 (120–155m) — Sprint 3: Full-Stack Hook & Express REST API (Exercise 3 / Ex 1.7.1 - Slides 16–17, 26–27)**
  - [x] **Task 3.1: Express REST API Server Architecture (`server.js`)**
    - Configured CORS middleware: `cors({ origin: 'http://localhost:5173' })`.
    - Endpoints `GET /api/messages/:forum` and `POST /api/messages/:forum`.
    - Strict POST payload validation (`!req.body.text || !req.body.author` -> 400 status).
    - Unique message ID generation using `crypto.randomUUID()`.
    - Seeded mock persistence channels: `'nasa'`, `'esports-tribunal'`, `'notNasa'`.
  - [x] **Task 3.2: Custom Hook with AbortController (`src/hooks/useForumMessages.js`)**
    - Instant cancellation of in-flight requests on rapid channel switching via `AbortController`.
    - Safe state mutation with `!controller.signal.aborted` guards across `try/catch/finally`.
    - Cleanup function returning `() => controller.abort()`.
    - Integrated `postMessage` dispatcher updating state seamlessly.
  - [x] **Task 3.3: Semantic UI Channel Viewer (`src/components/ForumChannelViewer.jsx`)**
    - Multi-channel selector for `'nasa'`, `'esports-tribunal'`, `'notNasa'`.
    - Semantic definition list `<dl>` rendering keyed `<React.Fragment key={msg.id}>` (Slide 16).
    - Live AbortController cancellation telemetry counter and loading indicators.
  - [x] **Task 3.4: Proxy & Router Integration**
    - Vite proxy configured to forward `/api` requests to `http://localhost:5000`.
    - Route `/channels` and alias `/forum` integrated into React Router v7 routes.
    - Automated verification suite `scripts/verify-sprint3.js` passing 20/20 tests.

---

## Block 5 (155–180m): Live Refactoring Defense & Homework Verification
- [x] **Task 5.1: Live Defense Challenge Readiness (Slide 27)**
  - Challenge 1: URL Search Params Sync with `useSearchParams()` (Verified in HW1 Photo Gallery).
  - Challenge 2: Cross-Field Validation (Verified in Sprint 2 Confirm Password & HW3 Appeal Form).
  - Challenge 3: Auto-Retry Backoff & AbortController (Verified in Sprint 3 Forum API).
  - Challenge 4: Protected Route Guard (Verified via React Router v7 layout wrappers & 404 error boundaries).
- [x] **Task 5.2: Post-Mortem Audit & AI Hallucination Registry (`AI_FAILURE_AUDIT.md`)**
  - Completed evaluation documentation satisfying 15% course verification grade.

---

## Production Homework Modules
- [x] **Homework 1: Production Multi-Route Photo & Evidence Gallery SPA (Slide 19 & Slide 29/30)**
  - Deep linking synchronized via `useSearchParams()` for category filters and modal photo views (`photoId`).
  - Native HTML5 `<dialog>` modal lightbox with automated focus trap management (`showModal()` & `close()`).
  - Strict WCAG 2.2 AA accessibility and 100/100 Lighthouse performance compliance.
  - Automated verification suite `scripts/verify-hw1.js` passing 10/10 tests.

- [x] **Homework 2: Full-Stack Interactive Card-Swipe Deck 'Hen Ho Nhung Khong Yeu' (Slide 20 & Slide 30/31)**
  - Dual Keyboard (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `Backspace`) and Pointer drag gesture tracking.
  - LIFO Undo Stack with `slice(0, -1)` for sequential card restoration.
  - Pure derived asymmetric score calculation (`reduce` during render, zero useEffect).
  - Modern Express & Mongoose 8 persistence layer (`/api/profiles`, `/api/swipe`).
  - Automated verification suite `scripts/verify-hw2.js` passing 10/10 tests.

- [x] **Homework 3: Full-Stack Esports Fair-Play Appeal Tribunal (Slide 21 & Slide 32/33)**
  - Multi-Route Case Dossier navigation for `/dossier/himass` and `/dossier/tanvuu`.
  - Disproportionality Derived Severity Matrix calculation via `useMemo(() => computeMatrix(dossierData))`.
  - High-precision Zero-Drift SLA Countdown Hook `useAppealSlaTimer.js` synchronized via Page Visibility API (`visibilitychange`).
  - Context-driven appeal rebuttal form with synchronous single-pass validation.
  - Automated verification suite `scripts/verify-hw3.js` passing 16/16 tests.
