/**
 * scripts/verify-sprint1.js
 * Automated Verification Test Suite for Lab 04 Sprint 1 (Exercise 1)
 * Enforces the Full-Stack Verification Contract & S3T Pedagogical Guidelines.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const results = [];

function assert(condition, description) {
  if (condition) {
    results.push({ pass: true, desc: description });
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${description}`);
  } else {
    results.push({ pass: false, desc: description });
    console.error(`  \x1b[31m✖ FAIL\x1b[0m ${description}`);
  }
}

console.log('\n\x1b[36m============================================================\x1b[0m');
console.log('\x1b[36m  LAB 04 SPRINT 1 (EXERCISE 1) CONTRACT VERIFICATION SUITE  \x1b[0m');
console.log('\x1b[36m============================================================\x1b[0m\n');

// 1. Check Data Contract
const peoplePath = path.join(rootDir, 'src', 'data', 'people.js');
assert(fs.existsSync(peoplePath), 'Data source exists at src/data/people.js');
if (fs.existsSync(peoplePath)) {
  const content = fs.readFileSync(peoplePath, 'utf8');
  assert(content.includes('export const PEOPLE') || content.includes('export default'), 'Exports people dataset');
  assert(content.includes('id:') && content.includes('name:') && content.includes('role:'), 'Dataset contains id, name, and role fields');
}

// 2. Check PeopleLayout.jsx Contract (Slide 22)
const layoutPath = path.join(rootDir, 'src', 'components', 'PeopleLayout.jsx');
assert(fs.existsSync(layoutPath), 'PeopleLayout.jsx exists at src/components/PeopleLayout.jsx');
if (fs.existsSync(layoutPath)) {
  const content = fs.readFileSync(layoutPath, 'utf8');
  assert(content.includes("from 'react-router'") || content.includes('from "react-router"'), "Imports from 'react-router' (v7 standard)");
  assert(content.includes('NavLink') && content.includes('Outlet'), 'Imports NavLink and Outlet');
  assert(content.includes('<Outlet'), 'Renders <Outlet /> for nested route view');
  assert(content.includes('people-frame') && content.includes('sidebar') && content.includes('content-area'), 'Implements semantic frame layout structure');
  assert(content.includes('isActive'), 'Uses dynamic active link callback styling');
  assert(!content.includes('<Switch>'), 'Zero React Router v5 <Switch> anti-patterns');
}

// 3. Check PersonDetail.jsx Contract (Slide 11 & Slide 22)
const detailPath = path.join(rootDir, 'src', 'components', 'PersonDetail.jsx');
assert(fs.existsSync(detailPath), 'PersonDetail.jsx exists at src/components/PersonDetail.jsx');
if (fs.existsSync(detailPath)) {
  const content = fs.readFileSync(detailPath, 'utf8');
  assert(content.includes('useParams'), 'Imports and utilizes useParams() hook');
  assert(content.includes('people.find'), 'Performs safe record lookup via people.find()');
  assert(content.includes('404: Person Not Found') && content.includes('role="alert"'), 'Explicit 404 boundary guard with role="alert"');
  assert(content.includes('<dl') && content.includes('<dt') && content.includes('<dd'), 'Uses semantic HTML <dl>, <dt>, <dd> definition list');
}

// 4. Check Skeleton.jsx Contract (Slide 9 - Ex 1.1)
const skeletonPath = path.join(rootDir, 'src', 'components', 'Skeleton.jsx');
assert(fs.existsSync(skeletonPath), 'Skeleton.jsx fallback component exists');
if (fs.existsSync(skeletonPath)) {
  const content = fs.readFileSync(skeletonPath, 'utf8');
  assert(content.includes('aria-busy="true"') && content.includes('aria-live="polite"'), 'Skeleton integrates aria-busy="true" and aria-live="polite"');
  assert(content.includes('skeleton'), 'Contains dimension-matched skeleton CSS styling');
}

// 5. Check App.jsx Route Setup & Code Splitting (Slide 9, 10, 11)
const appPath = path.join(rootDir, 'src', 'App.jsx');
assert(fs.existsSync(appPath), 'App.jsx root component exists');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  assert(content.includes('React.lazy') || content.includes('lazy('), 'Implements code-splitting via React.lazy()');
  assert(content.includes('<Suspense'), 'Wraps route views in <Suspense>');
  assert(content.includes('Routes') && content.includes('Route'), 'Uses React Router v7 <Routes> and <Route>');
  assert(content.includes('element='), 'Uses modern element={<Component />} prop syntax');
}

// 6. Check CSS Grid & Responsive Contract (Slide 11)
const cssFiles = [
  path.join(rootDir, 'src', 'components', 'PeopleLayout.module.css'),
  path.join(rootDir, 'src', 'App.css'),
  path.join(rootDir, 'src', 'index.css'),
];
const foundCss = cssFiles.some(f => fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('grid-template-columns') && fs.readFileSync(f, 'utf8').includes('minmax(280px'));
assert(foundCss, 'Defines CSS Grid layout with minmax(280px, 1fr) 2fr');

const failed = results.filter(r => !r.pass);
console.log(`\n\x1b[36m------------------------------------------------------------\x1b[0m`);
console.log(`Summary: \x1b[32m${results.length - failed.length} passed\x1b[0m, \x1b[${failed.length ? '31' : '32'}m${failed.length} failed\x1b[0m`);
console.log(`\x1b[36m============================================================\x1b[0m\n`);

if (failed.length > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m✔ ALL SPRINT 1 CONTRACT INVARIANTS SATISFIED!\x1b[0m\n');
  process.exit(0);
}
