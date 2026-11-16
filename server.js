import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';

const app = express();
const PORT = process.env.PORT || 5000;

// Slide 26 Code Contract: CORS middleware & JSON parsing
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// In-Memory Database Store for Lab 4 Channels
const forumDb = {
  nasa: [
    {
      id: crypto.randomUUID(),
      author: 'Dr. Sarah Connor',
      text: 'Deep Space Network telemetry confirmed for Voyager 1 at 24 billion km.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      author: 'Commander John Glenn',
      text: 'Artemis lunar gateway orbital insertion simulation achieved 99.8% precision.',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
  ],
  'esports-tribunal': [
    {
      id: crypto.randomUUID(),
      author: 'Tribunal Head Judge',
      text: 'Case Dossier: Reviewing Himass & TanVuu match logs for competitive integrity.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      author: 'FairPlay Officer (UIT)',
      text: 'Disproportionality matrix analysis submitted. Zero-drift SLA timer active.',
      timestamp: new Date(Date.now() - 900000).toISOString(),
    },
  ],
  notNasa: [
    {
      id: crypto.randomUUID(),
      author: 'Amateur Astrophotographer',
      text: 'Captured M31 Andromeda Galaxy using a 200mm telephoto lens with 2h exposure.',
      timestamp: new Date(Date.now() - 5400000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      author: 'Rocketry Hobbyist',
      text: 'Solid rocket motor static test fired successfully with 450 N average thrust.',
      timestamp: new Date(Date.now() - 600000).toISOString(),
    },
  ],
};

// Database helper functions
const db = {
  async getMessagesByForum(forum) {
    if (!forumDb[forum]) {
      forumDb[forum] = [];
    }
    return forumDb[forum];
  },
  async addMessage(forum, message) {
    if (!forumDb[forum]) {
      forumDb[forum] = [];
    }
    forumDb[forum].push(message);
    return message;
  },
};

// GET /api/messages/:forum
// Supports optional delay query param (?delay=ms) to test simulated Slow 3G and AbortController cancellation
app.get('/api/messages/:forum', async (req, res) => {
  const forum = req.params.forum;
  const delay = parseInt(req.query.delay || '0', 10);

  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  const messages = await db.getMessagesByForum(forum);
  res.json(messages);
});

// Slide 26 Code Contract: POST Payload Validation & ID Generation
app.post('/api/messages/:forum', async (req, res) => {
  if (!req.body.text || !req.body.author) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newMessage = {
    id: crypto.randomUUID(),
    author: req.body.author.trim(),
    text: req.body.text.trim(),
    timestamp: new Date().toISOString(),
  };

  await db.addMessage(req.params.forum, newMessage);
  res.status(201).json(newMessage);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Lab04 Express REST API', timestamp: new Date() });
});

// Start listening if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Express API] Lab 04 Server listening on http://localhost:${PORT}`);
    console.log(`[Express API] Channels available: nasa, esports-tribunal, notNasa`);
  });
}

export default app;
