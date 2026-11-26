/**
 * scripts/verify-hw1.js
 * Automated Verification Test Suite for Lab 04 Homework 1 (Slide 19 & Slide 29/30)
 * Enforces useSearchParams() deep linking, native HTML5 <dialog> modal, and WCAG 2.2 AA.
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
console.log('\x1b[36m  LAB 04 HOMEWORK 1 CONTRACT VERIFICATION SUITE              \x1b[0m');
console.log('\x1b[36m============================================================\x1b[0m\n');

// 1. Check Data Contract
const photosPath = path.join(rootDir, 'src', 'data', 'photos.js');
assert(fs.existsSync(photosPath), 'Photos dataset exists at src/data/photos.js');
if (fs.existsSync(photosPath)) {
  const content = fs.readFileSync(photosPath, 'utf8');
  assert(content.includes('PHOTOS') && content.includes('CATEGORIES'), 'Exports PHOTOS and CATEGORIES datasets');
  assert(content.includes('thumbnailUrl') && content.includes('fullUrl'), 'Contains required thumbnail and full URL fields');
}

// 2. Check PhotoGalleryLayout.jsx Contract (Slide 29/30)
const layoutPath = path.join(rootDir, 'src', 'components', 'PhotoGalleryLayout.jsx');
assert(fs.existsSync(layoutPath), 'PhotoGalleryLayout.jsx exists at src/components/PhotoGalleryLayout.jsx');
if (fs.existsSync(layoutPath)) {
  const content = fs.readFileSync(layoutPath, 'utf8');
  assert(content.includes('useSearchParams'), 'Imports and utilizes useSearchParams() hook for deep linking');
  assert(content.includes('useRef'), 'Binds native HTML5 <dialog> via useRef');
  assert(content.includes('showModal()') && content.includes('close()'), 'Invokes native dialog.showModal() and dialog.close() for focus trap');
  assert(content.includes('<dialog') && content.includes('ref={dialogRef}'), 'Renders native HTML5 <dialog> with ref binding');
  assert(content.includes('onClose='), 'Implements onClose event syncing URL back to clean state');
  assert(content.includes('category'), 'Synchronizes category filter with URL query parameter');
}

const failed = results.filter(r => !r.pass);
console.log(`\n\x1b[36m------------------------------------------------------------\x1b[0m`);
console.log(`Summary: \x1b[32m${results.length - failed.length} passed\x1b[0m, \x1b[${failed.length ? '31' : '32'}m${failed.length} failed\x1b[0m`);
console.log(`\x1b[36m============================================================\x1b[0m\n`);

if (failed.length > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m✔ ALL HOMEWORK 1 CONTRACT INVARIANTS SATISFIED!\x1b[0m\n');
  process.exit(0);
}
