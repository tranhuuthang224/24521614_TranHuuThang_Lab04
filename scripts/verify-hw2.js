/**
 * scripts/verify-hw2.js
 * Automated Verification Test Suite for Lab 04 Homework 2 (Slide 20 & Slide 30/31)
 * Enforces Keyboard/Pointer event handlers, LIFO Undo Stack, and Asymmetric Score Derived State.
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
console.log('\x1b[36m  LAB 04 HOMEWORK 2 CONTRACT VERIFICATION SUITE              \x1b[0m');
console.log('\x1b[36m============================================================\x1b[0m\n');

// 1. Check Data Contract
const profilesPath = path.join(rootDir, 'src', 'data', 'profiles.js');
assert(fs.existsSync(profilesPath), 'Profiles dataset exists at src/data/profiles.js');
if (fs.existsSync(profilesPath)) {
  const content = fs.readFileSync(profilesPath, 'utf8');
  assert(content.includes('PROFILES'), 'Exports PROFILES dataset');
  assert(content.includes('asymmetricFactor') && content.includes('redFlags'), 'Contains asymmetric factor and red flag properties');
}

// 2. Check SwipeDeck.jsx Contract (Slide 30/31)
const deckPath = path.join(rootDir, 'src', 'components', 'SwipeDeck.jsx');
assert(fs.existsSync(deckPath), 'SwipeDeck.jsx exists at src/components/SwipeDeck.jsx');
if (fs.existsSync(deckPath)) {
  const content = fs.readFileSync(deckPath, 'utf8');
  assert(content.includes('ArrowLeft') && content.includes('ArrowRight') && content.includes('ArrowUp') && content.includes('Backspace'), 'Implements keyboard event mapping (ArrowLeft, ArrowRight, ArrowUp, Backspace)');
  assert(content.includes('handlePointerDown') && content.includes('handlePointerUp'), 'Implements pointer gesture event tracking');
  assert(content.includes('dx > 50') && content.includes('dx < -50'), 'Validates swipe gesture thresholds (dx > 50, dx < -50)');
  assert(content.includes('slice(0, -1)') || content.includes('slice(0,-1)'), 'Implements LIFO Undo Stack via history.slice(0, -1)');
  assert(content.includes('history.reduce') && content.includes('10') && content.includes('5'), 'Calculates asymmetric score via pure derived state (history.reduce)');
  assert(content.includes('/api/swipe'), 'Integrates full-stack persistence dispatch to /api/swipe');
}

const failed = results.filter(r => !r.pass);
console.log(`\n\x1b[36m------------------------------------------------------------\x1b[0m`);
console.log(`Summary: \x1b[32m${results.length - failed.length} passed\x1b[0m, \x1b[${failed.length ? '31' : '32'}m${failed.length} failed\x1b[0m`);
console.log(`\x1b[36m============================================================\x1b[0m\n`);

if (failed.length > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m✔ ALL HOMEWORK 2 CONTRACT INVARIANTS SATISFIED!\x1b[0m\n');
  process.exit(0);
}
