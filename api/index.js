import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Vote from './models/Vote.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Routes
app.get('/api/votes', async (req, res) => {
  try {
    // Aggregate votes
    const votes = await Vote.aggregate([
      {
        $group: {
          _id: '$team',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      real: 0,
      city: 0
    };

    votes.forEach(v => {
      if (v._id === 'real') result.real = v.count;
      if (v._id === 'city') result.city = v.count;
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.post('/api/vote', async (req, res) => {
  try {
    const { team, homeScore, awayScore } = req.body;

    if (!team || !['real', 'city'].includes(team)) {
      return res.status(400).json({ error: 'Invalid team' });
    }

    const newVote = new Vote({
      team,
      homeScore,
      awayScore
    });

    await newVote.save();

    res.status(201).json({ message: 'Vote registered' });
  } catch (error) {
    console.error('Error saving vote:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Soccer Voting API is running');
});

// Start Server (for local dev)
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app; // Export for Vercel
