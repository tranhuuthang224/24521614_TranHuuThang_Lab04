# AI Failure Mode Audit & Engineering Verification Log

**Course:** Web Development — University of Information Technology (UIT - VNUHCM)  
**Student:** Trần Hữu Thắng (MSSV: 24521614)  
**Lab Assignment:** Lab 04 — Multi-Route SPA Architecture & React Router v7 Systems

---

## 1. Audit Overview & Evaluation Purpose
As mandated by **Slide 18 & Slide 28** of the UIT S3T Lab 4 curriculum, this audit constitutes 15% of the engineering verification grade. It documents AI code generation failures, hallucinated APIs, architectural anti-patterns, and the manual engineering interventions required to ensure production compliance.

---

## 2. Top AI Hallucination & Failure Pattern Register

### Hallucination 01: React Router v5 `<Switch>` & `component={...}` Injections
- **Identified Failure:** AI assistants frequently generate obsolete React Router v5 syntax, including `<Switch>`, `<Redirect>`, `exact`, `activeClassName`, and `<Route component={...}>`.
- **Root Cause:** Training bias towards legacy React tutorials (2018–2021).
- **Engineering Fix:** Applied React Router v7 declarative standard: `<Routes>`, `<Route element={<... />} >`, `<Outlet />`, and functional callback classNames `className={({ isActive }) => isActive ? 'active-link' : 'link'}`.

### Hallucination 02: Cascading `useEffect` Form Validation Cascades
- **Identified Failure:** AI frequently suggests chaining 5 `useEffect` hooks across `InputField` and `SimpleForm` to synchronize errors and validity.
- **Root Cause:** Overuse of side-effects for values that can be derived synchronously during render.
- **Impact:** Triggers up to 5 re-renders per keystroke, race conditions during rapid typing, and `Max update depth exceeded` exceptions.
- **Engineering Fix:** Implemented a single-render-pass synchronous validation engine using `FormContext` and React 19 `useId()`.

### Hallucination 03: Leaky Asynchronous Requests in Custom Hooks
- **Identified Failure:** AI generates async `useEffect` data fetching using leaky `didCancel` booleans or uncancelled promises.
- **Root Cause:** Lack of understanding of browser connection lifecycles and component unmounting.
- **Engineering Fix:** Integrated native `AbortController` signal cleanup returning `() => controller.abort()` and `if (!controller.signal.aborted)` guards.

### Hallucination 04: Hardcoded Database Secrets & Deprecated Mongoose Flags
- **Identified Failure:** AI introduces connection strings with plaintext credentials committed into git, alongside deprecated Mongoose 5 flags (`useNewUrlParser: true`, `useUnifiedTopology: true`).
- **Root Cause:** Stale snippets from pre-Mongoose 6 repositories.
- **Engineering Fix:** Isolated all secrets behind `process.env.MONGODB_URI` and used clean Mongoose 8 async connection syntax.

### Hallucination 05: Unlabelled Icon Buttons & Div-Soup
- **Identified Failure:** AI writes non-semantic clickable `<div>` elements without keyboard `tabIndex`, or icon buttons lacking `aria-label`.
- **Root Cause:** Prioritizing visual style over accessibility.
- **Engineering Fix:** Enforced WCAG 2.2 AA standards: semantic `<button type="button">`, `<dl>/<dt>/<dd>`, `role="alert"`, and explicit `aria-live` / `aria-busy` attributes.

---

## 3. Sprint 1 Verified Engineering Defenses
- Verified dynamic chunk splitting with `React.lazy()` and dimension-matched `<Skeleton />`.
- Enforced clean URL param extraction via `useParams()` with explicit 404 boundary guard.
- Tested responsive CSS Grid layout (`grid-template-columns: minmax(280px, 1fr) 2fr`) across desktop and 375px mobile viewports.
