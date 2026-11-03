
const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const allowedCategories = [
  'Documents',
  'Academics',
  'Maintenance',
  'Administration',
  'Technical',
  'Campus',
  'General',
];

// GET ALL POSTS
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .lean();

    const userId = req.user.id;

    const formattedPosts = posts.map((post) => ({
      ...post,
      id: post._id.toString(),
      votes: post.voters.length,
      voted: post.voters.some(
        (id) => id.toString() === userId
      ),
      accepted: post.accepted
        ? post.accepted.toString()
        : null,
      answers: post.answers.map((answer) => ({
        ...answer,
        id: answer._id.toString(),
        votes: answer.voters.length,
        voted: answer.voters.some(
          (id) => id.toString() === userId
        ),
      })),
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error('Fetch posts error:', error);

    res.status(500).json({
      message: 'Failed to fetch UniHelp posts.',
    });
  }
});


// CREATE A POST
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, body, category, suggest } = req.body;

    if (
      !title?.trim() ||
      title.trim().length < 8 ||
      !body?.trim() ||
      body.trim().length < 10 ||
      !allowedCategories.includes(category)
    ) {
      return res.status(400).json({
        message: 'Please provide a valid question, details and category.',
      });
    }

    const author = await User.findById(req.user.id).select(
      'name role'
    );

    if (!author) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    const post = await Post.create({
      title: title.trim(),
      body: body.trim(),
      category,
      suggest: suggest || null,
      authorId: author._id,
      author: author.name,
      role: author.role,
    });

    res.status(201).json({
      message: 'Question posted successfully.',
      post: {
        ...post.toObject(),
        id: post._id.toString(),
        votes: 0,
        voted: false,
        accepted: null,
        answers: [],
      },
    });
  } catch (error) {
    console.error('Create post error:', error);

    res.status(500).json({
      message: 'Failed to create question.',
    });
  }
});


// UPVOTE OR REMOVE UPVOTE FROM A POST
router.patch('/:id/vote', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid post ID.',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found.',
      });
    }

    const alreadyVoted = post.voters.some(
      (id) => id.toString() === req.user.id
    );

    if (alreadyVoted) {
      post.voters.pull(req.user.id);
    } else {
      post.voters.addToSet(req.user.id);
    }

    await post.save();

    res.json({
      votes: post.voters.length,
      voted: !alreadyVoted,
    });
  } catch (error) {
    console.error('Vote post error:', error);

    res.status(500).json({
      message: 'Failed to vote on post.',
    });
  }
});


// ADD AN ANSWER
router.post('/:id/answers', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid post ID.',
      });
    }

    if (!text?.trim() || text.trim().length < 3) {
      return res.status(400).json({
        message: 'Write an answer of at least 3 characters.',
      });
    }

    const author = await User.findById(req.user.id).select(
      'name role'
    );

    if (!author) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found.',
      });
    }

    post.answers.push({
      authorId: author._id,
      author: author.name,
      role: author.role,
      text: text.trim(),
    });

    await post.save();

    const answer = post.answers[post.answers.length - 1];

    res.status(201).json({
      message: 'Answer added successfully.',
      answer: {
        ...answer.toObject(),
        id: answer._id.toString(),
        votes: 0,
        voted: false,
      },
    });
  } catch (error) {
    console.error('Add answer error:', error);

    res.status(500).json({
      message: 'Failed to add answer.',
    });
  }
});


// UPVOTE OR REMOVE UPVOTE FROM AN ANSWER
router.patch(
  '/:id/answers/:answerId/vote',
  authMiddleware,
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(req.params.id) ||
        !mongoose.Types.ObjectId.isValid(req.params.answerId)
      ) {
        return res.status(400).json({
          message: 'Invalid post or answer ID.',
        });
      }

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          message: 'Post not found.',
        });
      }

      const answer = post.answers.id(req.params.answerId);

      if (!answer) {
        return res.status(404).json({
          message: 'Answer not found.',
        });
      }

      const alreadyVoted = answer.voters.some(
        (id) => id.toString() === req.user.id
      );

      if (alreadyVoted) {
        answer.voters.pull(req.user.id);
      } else {
        answer.voters.addToSet(req.user.id);
      }

      await post.save();

      res.json({
        votes: answer.voters.length,
        voted: !alreadyVoted,
      });
    } catch (error) {
      console.error('Vote answer error:', error);

      res.status(500).json({
        message: 'Failed to vote on answer.',
      });
    }
  }
);


// ACCEPT OR REMOVE AN ANSWER
router.patch(
  '/:id/answers/:answerId/accept',
  authMiddleware,
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(req.params.id) ||
        !mongoose.Types.ObjectId.isValid(req.params.answerId)
      ) {
        return res.status(400).json({
          message: 'Invalid post or answer ID.',
        });
      }

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          message: 'Post not found.',
        });
      }

      if (post.authorId.toString() !== req.user.id) {
        return res.status(403).json({
          message: 'Only the question author can accept an answer.',
        });
      }

      const answer = post.answers.id(req.params.answerId);

      if (!answer) {
        return res.status(404).json({
          message: 'Answer not found.',
        });
      }

      post.accepted =
        post.accepted?.toString() === req.params.answerId
          ? null
          : answer._id;

      await post.save();

      res.json({
        accepted: post.accepted
          ? post.accepted.toString()
          : null,
      });
    } catch (error) {
      console.error('Accept answer error:', error);

      res.status(500).json({
        message: 'Failed to update accepted answer.',
      });
    }
  }
);

module.exports = router;
