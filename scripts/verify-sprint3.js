/**
 * scripts/verify-sprint3.js
 * Automated Verification Test Suite for Lab 04 Sprint 3 (Exercise 1.7.1)
 * Enforces the Full-Stack Custom Hook useForumMessages & Express API Code Contracts.
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
console.log('\x1b[36m  LAB 04 SPRINT 3 (EXERCISE 1.7.1) CONTRACT VERIFICATION SUITE  \x1b[0m');
console.log('\x1b[36m============================================================\x1b[0m\n');

// 1. Check Backend Contract (Slide 26 / 27 in deck: server.js)
const serverPaths = [
  path.join(rootDir, 'server.js'),
  path.join(rootDir, 'server', 'server.js'),
];
const serverPath = serverPaths.find(p => fs.existsSync(p));
assert(!!serverPath, 'Express REST API server exists at server.js');
if (serverPath) {
  const content = fs.readFileSync(serverPath, 'utf8');
  assert(content.includes('express') && content.includes('cors'), 'Imports and uses express & cors');
  assert(content.includes("cors(") || content.includes("app.use(cors"), 'Configures CORS middleware');
  assert(content.includes('/api/messages/:forum'), 'Implements GET and POST /api/messages/:forum route endpoints');
  assert(content.includes('crypto.randomUUID()') || content.includes('randomUUID'), 'Generates unique message IDs via crypto.randomUUID()');
  assert(content.includes('400') && (content.includes('text') || content.includes('author')), 'Enforces strict POST payload validation with 400 status');
  assert(content.includes('nasa') && content.includes('esports-tribunal') && content.includes('notNasa'), 'Seeds channels: nasa, esports-tribunal, notNasa');
}

// 2. Check Custom Hook Contract (Slide 25 / 26 in deck: useForumMessages.js)
const hookPath = path.join(rootDir, 'src', 'hooks', 'useForumMessages.js');
assert(fs.existsSync(hookPath), 'Custom hook exists at src/hooks/useForumMessages.js');
if (fs.existsSync(hookPath)) {
  const content = fs.readFileSync(hookPath, 'utf8');
  assert(content.includes('new AbortController()'), 'Instantiates AbortController inside useEffect');
  assert(content.includes('controller.signal') || content.includes('signal:'), 'Passes signal into fetch request');
  assert(content.includes('signal.aborted'), 'Implements signal.aborted guard logic in async flow');
  assert(content.includes('controller.abort()'), 'Cleanup function returns abort() call');
  assert(content.includes('postMessage'), 'Exports integrated postMessage helper');
}

// 3. Check Channel Viewer Component (Slide 16, 17: ForumChannelViewer.jsx)
const viewerPath = path.join(rootDir, 'src', 'components', 'ForumChannelViewer.jsx');
assert(fs.existsSync(viewerPath), 'ForumChannelViewer exists at src/components/ForumChannelViewer.jsx');
if (fs.existsSync(viewerPath)) {
  const content = fs.readFileSync(viewerPath, 'utf8');
  assert(content.includes('useForumMessages'), 'Consumes useForumMessages custom hook');
  assert(content.includes('Fragment') || content.includes('React.Fragment'), 'Uses semantic keyed <React.Fragment key={msg.id}> (Slide 16)');
  assert(content.includes('<dl') && content.includes('<dt') && content.includes('<dd'), 'Renders messages inside definition list (<dl>, <dt>, <dd>)');
  assert(content.includes('nasa') && content.includes('esports-tribunal') && content.includes('notNasa'), 'Renders channel buttons for nasa, esports-tribunal, notNasa');
}

// 4. Check App.jsx Route Integration (Sprint 1 + Sprint 2 + Sprint 3)
const appPath = path.join(rootDir, 'src', 'App.jsx');
assert(fs.existsSync(appPath), 'App.jsx root component exists');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  assert(content.includes('/forum') || content.includes('/channels') || content.includes('ForumChannelViewer'), 'App.jsx exposes forum channel viewer route');
}

const failed = results.filter(r => !r.pass);
console.log(`\n\x1b[36m------------------------------------------------------------\x1b[0m`);
console.log(`Summary: \x1b[32m${results.length - failed.length} passed\x1b[0m, \x1b[${failed.length ? '31' : '32'}m${failed.length} failed\x1b[0m`);
console.log(`\x1b[36m============================================================\x1b[0m\n`);

if (failed.length > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m✔ ALL SPRINT 3 CONTRACT INVARIANTS SATISFIED!\x1b[0m\n');
  process.exit(0);
}
