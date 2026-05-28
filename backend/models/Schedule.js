const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Lecture', 'Study', 'Break', 'Lab', 'Other'],
    default: 'Lecture'
  },
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String, // HH:MM format
    required: true
  },
  endTime: {
    type: String, // HH:MM format
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
