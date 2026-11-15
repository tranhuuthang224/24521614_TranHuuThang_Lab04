/**
 * scripts/verify-sprint2.js
 * Automated Verification Test Suite for Lab 04 Sprint 2 (Exercise 2 / Ex 1.3)
 * Enforces the Synchronous Form Validation Engine & Slide 23/24 Code Contracts.
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
console.log('\x1b[36m  LAB 04 SPRINT 2 (EXERCISE 2) CONTRACT VERIFICATION SUITE  \x1b[0m');
console.log('\x1b[36m============================================================\x1b[0m\n');

// 1. Check FormContext.jsx Contract (Slide 14 & Slide 24 / 23 in deck)
const contextPaths = [
  path.join(rootDir, 'src', 'context', 'FormContext.jsx'),
  path.join(rootDir, 'src', 'context', 'FormContext.js'),
];
const contextPath = contextPaths.find(p => fs.existsSync(p));
assert(!!contextPath, 'FormContext exists at src/context/FormContext.jsx');
if (contextPath) {
  const content = fs.readFileSync(contextPath, 'utf8');
  assert(content.includes('createContext') && content.includes('useContext'), 'Imports and initializes createContext & useContext');
  assert(content.includes('FormContext'), 'Exports or defines FormContext');
  assert(content.includes('useFormContext'), 'Exports useFormContext custom hook');
  assert(!content.includes('useEffect('), 'Zero useEffect waterfalls in FormContext (Synchronous evaluation contract)');
}

// 2. Check InputField.jsx Contract (Slide 24 / 25 in deck)
const inputPath = path.join(rootDir, 'src', 'components', 'InputField.jsx');
assert(fs.existsSync(inputPath), 'InputField.jsx exists at src/components/InputField.jsx');
if (fs.existsSync(inputPath)) {
  const content = fs.readFileSync(inputPath, 'utf8');
  assert(content.includes('useId()') || content.includes('useId'), 'Utilizes React 19 useId() hook for stable deterministic binding');
  assert(content.includes('aria-invalid'), 'Implements aria-invalid attribute for accessibility');
  assert(content.includes('aria-describedby'), 'Implements aria-describedby linked to error ID');
  assert(content.includes('role="alert"'), 'Accessible error message with role="alert"');
  assert(content.includes('field-group'), 'Adheres to .field-group layout structure');
}

// 3. Check ShowData.jsx Contract (Slide 24 / 25 in deck)
const showDataPath = path.join(rootDir, 'src', 'components', 'ShowData.jsx');
assert(fs.existsSync(showDataPath), 'ShowData.jsx exists at src/components/ShowData.jsx');
if (fs.existsSync(showDataPath)) {
  const content = fs.readFileSync(showDataPath, 'utf8');
  assert(content.includes('json-inspector'), 'Uses className="json-inspector"');
  assert(content.includes('<dl') && content.includes('<dt') && content.includes('<dd'), 'Renders accessible semantic definition list (<dl>, <dt>, <dd>)');
  assert(content.includes('Object.entries'), 'Dynamically renders key-value pairs via Object.entries');
  assert(content.includes('data-row'), 'Implements .data-row container per key-value entry');
}

// 4. Check SimpleForm.jsx Contract (Slide 13, 14, 15, 24 in deck)
const formPath = path.join(rootDir, 'src', 'components', 'SimpleForm.jsx');
assert(fs.existsSync(formPath), 'SimpleForm.jsx exists at src/components/SimpleForm.jsx');
if (fs.existsSync(formPath)) {
  const content = fs.readFileSync(formPath, 'utf8');
  assert(!content.includes('useEffect('), 'Zero useEffect validation waterfalls in SimpleForm (Single render pass contract)');
  assert(content.includes('FormContext.Provider') || content.includes('FormProvider'), 'Wraps form in Context Provider');
  assert(content.includes('ShowData'), 'Integrates ShowData JSON state inspector');
}

// 5. Check App.jsx Route Integration (Sprint 1 + Sprint 2)
const appPath = path.join(rootDir, 'src', 'App.jsx');
assert(fs.existsSync(appPath), 'App.jsx root component exists');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  assert(content.includes('/form') || content.includes('SimpleForm'), 'App.jsx exposes /form route for Sprint 2 Context Form Engine');
}

const failed = results.filter(r => !r.pass);
console.log(`\n\x1b[36m------------------------------------------------------------\x1b[0m`);
console.log(`Summary: \x1b[32m${results.length - failed.length} passed\x1b[0m, \x1b[${failed.length ? '31' : '32'}m${failed.length} failed\x1b[0m`);
console.log(`\x1b[36m============================================================\x1b[0m\n`);

if (failed.length > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m✔ ALL SPRINT 2 CONTRACT INVARIANTS SATISFIED!\x1b[0m\n');
  process.exit(0);
}
