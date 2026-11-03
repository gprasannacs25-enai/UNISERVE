
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  item: String,
  title: String,
  dept: String,
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  details: String,
  location: String,
  status: {
    type: String,
    enum: ['Submitted', 'Assigned', 'In review', 'Resolved', 'Rejected'],
    default: 'Submitted'
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  comments: [{
    by: String,
    text: String,
    at: {
      type: Date,
      default: Date.now
    }
  }],
  timeline: [{
    status: String,
    at: {
      type: Date,
      default: Date.now
    },
    by: String,
    note: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);
