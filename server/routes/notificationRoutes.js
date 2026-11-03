
const express = require('express');

const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET NOTIFICATIONS FOR THE LOGGED-IN USER
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error('Fetch notifications error:', error);

    res.status(500).json({
      message: 'Failed to fetch notifications.',
    });
  }
});

// MARK ALL NOTIFICATIONS AS READ
router.patch('/read-all', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        userId: req.user.id,
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    res.json({
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    console.error('Mark notifications read error:', error);

    res.status(500).json({
      message: 'Failed to update notifications.',
    });
  }
});

module.exports = router;
