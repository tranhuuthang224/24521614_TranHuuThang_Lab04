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

## 4. Sprint 2 Verified Engineering Defenses
- Eliminated cascading 5-layer `useEffect` validation waterfalls in favor of a single-render-pass synchronous validation engine.
- Bound unique accessible IDs via React 19 `useId()` and linked `aria-invalid` / `aria-describedby` to `${id}-error`.
- Replaced raw `JSON.stringify` dumps with semantic `<ShowData />` inspector using `<dl>`, `<dt>`, `<dd>`.

## 5. Sprint 3 Verified Engineering Defenses
- Guarded asynchronous data fetching using native `AbortController` signal cleanup to guarantee zero memory leaks and prevent race condition state corruption during rapid channel switching.
- Enforced `!controller.signal.aborted` guards across `try/catch/finally` blocks before committing state.
- Secured Express backend routes with CORS origin validation and strict POST payload verification.
- Utilized `crypto.randomUUID()` for cryptographically secure entity IDs.

## 6. Homework 1 Verified Engineering Defenses (Photo Gallery SPA)
- Adopted native HTML5 `<dialog>` element with standard `showModal()` and `close()` API instead of fragile custom `<div>` modal wrappers.
- Integrated automated focus trapping and keyboard `Escape` dismissal without leaking event listeners.
- Bound modal visibility and category filtering directly to browser query strings via `useSearchParams()`.

## 7. Homework 2 Verified Engineering Defenses (Card-Swipe Deck)
- Implemented an immutable LIFO Undo Stack (`slice(0, -1)`) preventing accidental in-place mutations and syncing undo deletions (`DELETE /api/swipe/:profileId`).
- Computed game metrics and asymmetric scores purely during render using `Array.prototype.reduce()`, completely bypassing unnecessary `useEffect` recalculation loops.
- Hydrated `PROFILES` from Express/Mongoose (`GET /api/profiles`) with `AbortController` cleanup and automatic seed population on startup.
- Applied clean Mongoose async/await + `.lean()` patterns reading `process.env.MONGODB_URI` (zero hardcoded credentials or deprecated `useNewUrlParser`/`useUnifiedTopology` flags).

## 8. Homework 3 Verified Engineering Defenses (Esports Appeal Tribunal)
- Mitigated browser background tab throttling using the Page Visibility API (`visibilitychange`), recalculating remaining time against absolute system clock deltas (`Date.now()`) and re-syncing cleanly when switching between `Himass` and `TanVuu` dossiers.
- Rendered disproportionality severity metrics synchronously in a single render pass via `useMemo()`.
- Integrated `FormContext` + `InputField` (`useId()`, `aria-invalid`, `role="alert"`) with pure synchronous `validateAppealForm()` for zero-`useEffect` real-time field validation.
