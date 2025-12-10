import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
  team: {
    type: String,
    required: true,
    enum: ['real', 'city']
  },
  homeScore: {
    type: Number,
    required: false
  },
  awayScore: {
    type: Number,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Vote', VoteSchema);
