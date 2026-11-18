import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { PROFILES } from './src/data/profiles.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Slide 26 Code Contract: CORS middleware & JSON body parsing
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ============================================================================
// Slide 31 / 32 Code Contract: Modern Express + Mongoose 8 Server
// ============================================================================
// 1. Environment Variable Security Guard
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lab04_fullstack';

let isMongoConnected = false;

// 2. Modern Connection Syntax (Zero Deprecated Flags in Mongoose 8)
async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    isMongoConnected = true;
    console.log('[Mongoose 8] Connected successfully to MongoDB:', MONGODB_URI);
  } catch (err) {
    isMongoConnected = false;
    console.warn('[Mongoose 8] MongoDB not detected locally; fallback in-memory persistence active.');
  }
}
connectDatabase();

// Mongoose Schemas & Models
const ProfileSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    tagline: String,
    bio: String,
    image: String,
    asymmetricFactor: String,
    redFlags: [String],
    interests: [String],
  },
  { timestamps: true }
);

const SwipeSchema = new mongoose.Schema(
  {
    profileId: { type: String, required: true },
    profileName: { type: String, required: true },
    type: { type: String, enum: ['LIKE', 'PASS', 'SUPERLIKE'], required: true },
    scoreDelta: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const AppealSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => crypto.randomUUID() },
    caseNumber: { type: String, required: true },
    playerName: { type: String, required: true },
    representative: { type: String, required: true },
    email: { type: String, required: true },
    statement: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
const Swipe = mongoose.models.Swipe || mongoose.model('Swipe', SwipeSchema);
const Appeal = mongoose.models.Appeal || mongoose.model('Appeal', AppealSchema);

// In-Memory Fallback Stores
const memorySwipes = [];
const memoryAppeals = [];

// ============================================================================
// Sprint 3: Forum Channels In-Memory Store
// ============================================================================
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

const db = {
  async getMessagesByForum(forum) {
    return forumDb[forum] || [];
  },
  async addMessage(forum, message) {
    if (!forumDb[forum]) forumDb[forum] = [];
    forumDb[forum].push(message);
    return message;
  },
};

// GET /api/messages/:forum
app.get('/api/messages/:forum', async (req, res) => {
  const forum = req.params.forum;
  const delay = parseInt(req.query.delay || '0', 10);

  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  const messages = await db.getMessagesByForum(forum);
  res.json(messages);
});

// POST /api/messages/:forum
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

// ============================================================================
// Homework 2 Endpoints: Slide 31 Code Contract
// ============================================================================

// 3. Async/Await GET Endpoint (Optimized read via .lean())
app.get('/api/profiles', async (req, res) => {
  try {
    if (isMongoConnected) {
      const profiles = await Profile.find().lean();
      if (profiles && profiles.length > 0) {
        return res.json(profiles);
      }
    }
    // Fallback to rich PROFILES dataset
    res.json(PROFILES);
  } catch (err) {
    res.json(PROFILES);
  }
});

// 4. Async/Await POST Endpoint with Try/Catch Block
app.post('/api/swipe', async (req, res) => {
  try {
    if (!req.body.profileId || !req.body.type) {
      return res.status(400).json({ error: 'Missing profileId or type' });
    }

    const swipeData = {
      profileId: req.body.profileId,
      profileName: req.body.profileName || 'Unknown Profile',
      type: req.body.type,
      scoreDelta: Number(req.body.scoreDelta) || 0,
      timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date(),
    };

    if (isMongoConnected) {
      const record = await Swipe.create(swipeData);
      return res.status(201).json(record);
    } else {
      memorySwipes.push({ id: crypto.randomUUID(), ...swipeData });
      return res.status(201).json(swipeData);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/swipes', async (req, res) => {
  if (isMongoConnected) {
    const list = await Swipe.find().sort({ timestamp: -1 }).lean();
    return res.json(list);
  }
  res.json([...memorySwipes].reverse());
});

// ============================================================================
// Homework 3 Endpoints: Esports Appeals
// ============================================================================
app.post('/api/appeals', async (req, res) => {
  try {
    if (!req.body.caseNumber || !req.body.representative) {
      return res.status(400).json({ error: 'Missing required appeal fields' });
    }

    const record = {
      id: crypto.randomUUID(),
      caseNumber: req.body.caseNumber,
      playerName: req.body.playerName,
      representative: req.body.representative,
      email: req.body.email,
      statement: req.body.statement,
      submittedAt: new Date().toISOString(),
    };

    if (isMongoConnected) {
      await Appeal.create(record);
    } else {
      memoryAppeals.push(record);
    }

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/appeals', async (req, res) => {
  if (isMongoConnected) {
    const list = await Appeal.find().sort({ submittedAt: -1 }).lean();
    return res.json(list);
  }
  res.json([...memoryAppeals].reverse());
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Lab04 Full-Stack Server',
    mongoConnected: isMongoConnected,
    timestamp: new Date(),
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Express API] Lab 04 Server listening on http://localhost:${PORT}`);
    console.log(`[Express API] Channels available: nasa, esports-tribunal, notNasa`);
    console.log(`[Express API] Homework 2 endpoints: GET /api/profiles, POST /api/swipe`);
    console.log(`[Express API] Homework 3 endpoints: POST /api/appeals, GET /api/appeals`);
  });
}

export default app;
