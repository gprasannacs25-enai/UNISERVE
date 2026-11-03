
const express = require('express');
const mongoose = require('mongoose');

const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// HELPER: FIND A REQUEST BY ITS UNISERVE ID
const findRequest = (id, filter = {}) => {
  if (id.startsWith('UNI-')) {
    return Request.findOne({ requestId: id, ...filter });
  }

  return Request.findOne({
    _id: id,
    ...filter,
  });
};

// HELPER: CREATE A NOTIFICATION
const createNotification = async (userId, text) => {
  if (!userId) return;

  await Notification.create({
    userId,
    text,
  });
};

// CREATE A NEW SERVICE REQUEST
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      type,
      item,
      title,
      dept,
      details,
      location,
    } = req.body;

    if (req.user.role !== 'student') {
      return res.status(403).json({
        message: 'Only students can submit service requests.',
      });
    }

    if (!type || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({
        message: 'Invalid request information.',
      });
    }

    const requestCount = await Request.countDocuments();

    const request = await Request.create({
      requestId: `UNI-${1041 + requestCount}`,
      type,
      item,
      title,
      dept,
      studentId: req.user.id,
      details,
      location,
      status: 'Assigned',

      timeline: [
        {
          status: 'Submitted',
          by: 'Student',
          note: 'Request submitted successfully.',
        },
        {
          status: 'Assigned',
          by: 'UniServe',
          note: 'Request sent to the department.',
        },
      ],
    });

    await createNotification(
      req.user.id,
      `${request.requestId} submitted and sent to the department.`
    );

    res.status(201).json({
      message: 'Service request created successfully!',
      request,
    });

  } catch (error) {
    console.error('Create request error:', error);

    res.status(500).json({
      message: 'Failed to create request.',
    });
  }
});


// GET ALL REQUESTS FOR STAFF AND ADMIN
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'You are not authorized to view all requests.',
      });
    }

    let filter = {};

    // STAFF CAN ONLY ACCESS THEIR OWN DEPARTMENT
    if (req.user.role === 'staff') {
      const staff = await User.findById(req.user.id).select('dept');

      if (!staff || !staff.dept) {
        return res.status(403).json({
          message: 'No department is assigned to this staff account.',
        });
      }

      filter.dept = staff.dept;
    }

    const requests = await Request.find(filter)
      .populate('studentId', 'name email usn')
      .populate('assignee', 'name email');

    res.json(requests);

  } catch (error) {
    console.error('Fetch requests error:', error);

    res.status(500).json({
      message: 'Failed to fetch requests.',
    });
  }
});


// GET LOGGED-IN STUDENT'S REQUESTS
router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({
        message: 'Only students can access this route.',
      });
    }

    const studentId = req.user.id;

    const requests = await Request.find({ studentId })
      .populate('studentId', 'name email usn')
      .populate('assignee', 'name email');

    res.json(requests);

  } catch (error) {
    console.error('Fetch student requests error:', error);

    res.status(500).json({
      message: 'Failed to fetch requests.',
    });
  }
});


// UPDATE REQUEST STATUS, COMMENTS, DEPARTMENT OR ASSIGNEE
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    if (!['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Only staff and admin can update requests.',
      });
    }

    const {
      status,
      comment,
      dept,
      assignee,
    } = req.body;

    const allowedStatuses = [
      'Submitted',
      'Assigned',
      'In review',
      'Resolved',
      'Rejected',
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid request status.',
      });
    }

    // STAFF CAN ONLY UPDATE REQUESTS FROM THEIR OWN DEPARTMENT
    let filter = {};

    if (req.user.role === 'staff') {
      const staff = await User.findById(req.user.id).select('dept');

      if (!staff || !staff.dept) {
        return res.status(403).json({
          message: 'No department is assigned to this staff account.',
        });
      }

      filter.dept = staff.dept;
    }

    const request = await findRequest(req.params.id, filter);

    if (!request) {
      return res.status(404).json({
        message: 'Request not found or you are not authorized to update it.',
      });
    }

    const staffUser = await User.findById(req.user.id).select('name');
    const actorName = staffUser?.name || req.user.role;
    const now = new Date();

    let notificationMessage = '';

    // CHANGE STATUS
    if (status && status !== request.status) {
      request.status = status;

      request.timeline.push({
        status,
        at: now,
        by: actorName,
        note: comment?.trim() || '',
      });

      notificationMessage =
        `${request.requestId} is now ${status.toLowerCase()}.`;
    }

    // ADD A NOTE
    if (comment?.trim() && !status) {
      request.comments.push({
        by: actorName,
        text: comment.trim(),
        at: now,
      });

      notificationMessage =
        `New note on ${request.requestId}.`;
    }

    // CHANGE DEPARTMENT
    if (dept && dept !== request.dept) {
      request.dept = dept;

      request.timeline.push({
        status: request.status,
        at: now,
        by: actorName,
        note: `Passed to ${dept}`,
      });

      notificationMessage =
        `${request.requestId} has been passed to another office.`;
    }

    // ASSIGN REQUEST TO STAFF MEMBER
    if (assignee !== undefined) {
      if (
        assignee !== null &&
        !mongoose.Types.ObjectId.isValid(assignee)
      ) {
        return res.status(400).json({
          message: 'Invalid assignee.',
        });
      }

      request.assignee = assignee;
    }

    await request.save();

    // SAVE NOTIFICATION FOR THE STUDENT
    if (notificationMessage) {
      await createNotification(
        request.studentId,
        notificationMessage
      );
    }

    const updatedRequest = await Request.findById(request._id)
      .populate('studentId', 'name email usn')
      .populate('assignee', 'name email');

    res.json({
      message: 'Request updated successfully!',
      request: updatedRequest,
    });

  } catch (error) {
    console.error('Update request error:', error);

    res.status(500).json({
      message: 'Failed to update request.',
      error: error.message,
    });
  }
});

module.exports = router;
