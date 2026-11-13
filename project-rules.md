# Lab 04: Project Rules & Full-Stack Verification Contract

**Smart Software System Team (S3T) | University of Information Technology (UIT - VNUHCM)**  
**Author:** MSc. Tran Vinh Khiem  
**Student:** Trần Hữu Thắng (MSSV: 24521614)

---

## 1. Pedagogical Manifesto
> "HTML is the foundation. CSS enhances presentation. JavaScript enhances behavior. AI enhances the developer."

## 2. Full-Stack Verification Contract
1. **Strict Contract-First API & Component Design:** Every route, component, and REST handler must strictly follow its formal interface specification before implementation.
2. **Mandatory Client & Server Validation Parity:** Validation logic must remain synchronous, deterministic, and identical across tiers.
3. **Zero Unhandled Promise Rejections & Leaks:** All asynchronous data fetching must be bound to clean `AbortController` signal lifecycles.
4. **Deterministic Single-Pass Render State:** Banning multi-layer `useEffect` cascading waterfalls. All derived state must be calculated synchronously during render.

---

## 3. Deprecation Audit: Strict Bans & Modern Standards

| Deprecated (Warning / Error) | Modern Standard (Enforced) |
|---|---|
| ❌ React Router v5 (`<Switch>`, `<Redirect>`, `exact`, `activeClassName`, `component={...}`) | ✅ React Router v7 (`<Routes>`, `<Route element={<... />} >`, `NavLink className={({isActive}) => ...}`) |
| ❌ `react-media` JSX media query wrappers | ✅ Native CSS Grid layout (`minmax()`) and responsive `@media` queries |
| ❌ `typeface-roboto` monolithic npm packages | ✅ Modern web font `@font-face` / system font stacks |
| ❌ `defaultProps` on functional components | ✅ Standard JavaScript default parameters (`({ prop = defaultVal })`) |
| ❌ Material-UI v4 (`@material-ui/core`) div-soup | ✅ Headless / semantic HTML5 accessible design systems |
| ❌ 5-layer `useEffect` form validation cascades | ✅ Synchronous derived state via `FormContext` & React 19 `useId()` |
| ❌ Leaky `didCancel` boolean flags in async hooks | ✅ Native `AbortController` signal cleanup with `signal.aborted` guards |
| ❌ Hardcoded database secrets in code | ✅ `process.env.MONGODB_URI` environment variable isolation |
| ❌ Removed Mongoose 5 callback patterns | ✅ Mongoose 8 modern `async/await` and `.lean()` execution |
| ❌ Unlabelled icon buttons | ✅ WCAG 2.2 AA compliant `aria-label`, `aria-busy`, `aria-live` attributes |

---

## 4. Git Governance & Commit Hygiene
- **Strict 4-Stage Contract-First Loop:**
  1. `Contract`: Define API & component interface spec.
  2. `Fail Test`: Run automated verification script confirming failing invariants.
  3. `Implement`: Write minimal production code to satisfy invariants.
  4. `Refactor`: Clean code while maintaining green tests.
- **Conventional Atomic Git Commits:**
  - `init:` Initial repository scaffolding
  - `docs:` Documentation and project rules
  - `feat:` New features / routes / components
  - `style:` CSS, layouts, responsive styling
  - `refactor:` Code refactoring, removing anti-patterns
  - `test:` Automated test suites and verification scripts
