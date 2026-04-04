import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  leftAt: {
    type: Date,
    default: null,
  },
  duration: {
    type: Number,
    default: 0,
  },
  chatMessages: [{
    roomId: String,
    from: {
      userId: String,
      username: String,
    },
    text: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  positions: [{
    x: Number,
    y: Number,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;
