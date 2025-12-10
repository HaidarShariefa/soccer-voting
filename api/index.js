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

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not defined in .env file');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

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
    res.status(500).json({ error: 'Internal Server Error' });
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
    res.status(500).json({ error: 'Internal Server Error' });
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
