
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['student', 'staff', 'admin'],
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    voters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['student', 'staff', 'admin'],
      required: true,
    },

    suggest: {
      type: String,
      default: null,
    },

    voters: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],

    accepted: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    answers: [answerSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
