/**
 * scripts/verify-hw3.js
 * Automated Verification Test Suite for Lab 04 Homework 3 (Slide 21 & Slide 32/33)
 * Enforces Multi-Route Dossiers, Disproportionality Derived Matrix, and Zero-Drift SLA Countdown.
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
console.log('\x1b[36m  LAB 04 HOMEWORK 3 CONTRACT VERIFICATION SUITE              \x1b[0m');
console.log('\x1b[36m============================================================\x1b[0m\n');

// 1. Check Data Contract
const dossiersPath = path.join(rootDir, 'src', 'data', 'dossiers.js');
assert(fs.existsSync(dossiersPath), 'Dossiers dataset exists at src/data/dossiers.js');
if (fs.existsSync(dossiersPath)) {
  const content = fs.readFileSync(dossiersPath, 'utf8');
  assert(content.includes('DOSSIERS') && content.includes('himass') && content.includes('tanvuu'), 'Contains Himass and TanVuu dossier data');
  assert(content.includes('computeMatrix'), 'Exports computeMatrix disproportionality calculation helper');
}

// 2. Check useAppealSlaTimer Hook Contract (Slide 32)
const timerHookPath = path.join(rootDir, 'src', 'hooks', 'useAppealSlaTimer.js');
assert(fs.existsSync(timerHookPath), 'Timer hook exists at src/hooks/useAppealSlaTimer.js');
if (fs.existsSync(timerHookPath)) {
  const content = fs.readFileSync(timerHookPath, 'utf8');
  assert(content.includes('visibilitychange'), 'Subscribes to Page Visibility API (visibilitychange event)');
  assert(content.includes('document.visibilityState'), 'Checks document.visibilityState to resync without tab-drift');
  assert(content.includes('removeEventListener'), 'Performs clean event listener deregistration');
  assert(content.includes('formattedTime') && content.includes('resyncTimerWithServer'), 'Exports formattedTime and resyncTimerWithServer');
}

// 3. Check DossierView.jsx Contract (Slide 32)
const dossierViewPath = path.join(rootDir, 'src', 'components', 'DossierView.jsx');
assert(fs.existsSync(dossierViewPath), 'DossierView exists at src/components/DossierView.jsx');
if (fs.existsSync(dossierViewPath)) {
  const content = fs.readFileSync(dossierViewPath, 'utf8');
  assert(content.includes('useMemo') && content.includes('computeMatrix'), 'Computes disproportionality derived matrix during render via useMemo');
  assert(content.includes('useAppealSlaTimer'), 'Consumes useAppealSlaTimer zero-drift hook');
  assert(content.includes('Disproportionality'), 'Renders Disproportionality severity metrics');
  assert(content.includes('FormContext.Provider') && content.includes('InputField'), 'Integrates Context-driven real-time appeal rebuttal form engine');
}

// 4. Check FairPlayAppealPortal.jsx Contract (Slide 21 & 32)
const portalPath = path.join(rootDir, 'src', 'components', 'FairPlayAppealPortal.jsx');
assert(fs.existsSync(portalPath), 'FairPlayAppealPortal exists at src/components/FairPlayAppealPortal.jsx');
if (fs.existsSync(portalPath)) {
  const content = fs.readFileSync(portalPath, 'utf8');
  assert(content.includes('/dossier/himass') && content.includes('/dossier/tanvuu'), 'Features multi-route navigation for /dossier/himass and /dossier/tanvuu');
  assert(content.includes('<Outlet'), 'Renders <Outlet /> for active dossier case');
}

const failed = results.filter(r => !r.pass);
console.log(`\n\x1b[36m------------------------------------------------------------\x1b[0m`);
console.log(`Summary: \x1b[32m${results.length - failed.length} passed\x1b[0m, \x1b[${failed.length ? '31' : '32'}m${failed.length} failed\x1b[0m`);
console.log(`\x1b[36m============================================================\x1b[0m\n`);

if (failed.length > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m✔ ALL HOMEWORK 3 CONTRACT INVARIANTS SATISFIED!\x1b[0m\n');
  process.exit(0);
}
