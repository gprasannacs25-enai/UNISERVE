
const express = require('express');
const router = express.Router();

const Availability = require('../models/Availability');
const authMiddleware = require('../middleware/authMiddleware');

// SIX DEFAULT OFFICE RECORDS
const DEFAULT_OFFICES = [
  {
    officeId: 'av1',
    name: 'Principal',
    place: 'Administrative Block',
    status: 'Unavailable',
    note: 'In a board meeting',
    next: 'Today, 3:30 PM',
    updatedAt: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    officeId: 'av2',
    name: 'Dean – Academics',
    place: 'Main Block',
    status: 'Available',
    note: 'Open for walk-ins',
    next: null,
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    officeId: 'av3',
    name: 'Dean – Student Affairs',
    place: 'Main Block',
    status: 'Tentative',
    note: 'May be called to a meeting',
    next: 'Today, 2:00 PM',
    updatedAt: new Date(Date.now() - 50 * 60 * 1000),
  },
  {
    officeId: 'av4',
    name: 'HOD, CSE',
    place: 'CSE Block',
    status: 'Available',
    note: '',
    next: null,
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    officeId: 'av5',
    name: 'Examination Section',
    place: 'Main Block',
    status: 'Available',
    note: 'Counter open 10 AM – 4 PM',
    next: null,
    updatedAt: new Date(Date.now() - 90 * 60 * 1000),
  },
  {
    officeId: 'av6',
    name: 'Accounts Section',
    place: 'Main Block',
    status: 'Unavailable',
    note: 'Closed for audit',
    next: 'Tomorrow, 10:00 AM',
    updatedAt: new Date(Date.now() - 120 * 60 * 1000),
  },
];

// INSERT DEFAULT OFFICES IF COLLECTION IS EMPTY
async function initializeAvailability() {
  const count = await Availability.countDocuments();

  if (count === 0) {
    await Availability.insertMany(DEFAULT_OFFICES);
    console.log('Default office availability inserted into MongoDB.');
  }
}

// FORMAT OFFICE DATA FOR FRONTEND
const formatOffice = (office) => ({
  id: office.officeId,
  name: office.name,
  place: office.place,
  status: office.status,
  note: office.note,
  updatedAt: office.updatedAt,
  next: office.next,
});

// GET ALL OFFICE AVAILABILITY
router.get('/', authMiddleware, async (req, res) => {
  try {
    await initializeAvailability();

    const offices = await Availability.find().sort({
      officeId: 1,
    });

    res.json(offices.map(formatOffice));
  } catch (error) {
    console.error('Fetch availability error:', error);

    res.status(500).json({
      message: 'Could not load office availability.',
    });
  }
});

// UPDATE OFFICE AVAILABILITY
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    // Only staff and admin can update availability
    if (!['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Only staff and admins can update availability.',
      });
    }

    await initializeAvailability();

    const { status, note, next, place } = req.body;

    const updates = {};

    // Validate status
    if (status !== undefined) {
      if (
        !['Available', 'Unavailable', 'Tentative'].includes(status)
      ) {
        return res.status(400).json({
          message: 'Invalid availability status.',
        });
      }

      updates.status = status;
    }

    if (note !== undefined) {
      updates.note = note;
    }

    if (next !== undefined) {
      updates.next = next;
    }

    if (place !== undefined) {
      updates.place = place;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'No valid updates provided.',
      });
    }

    const office = await Availability.findOneAndUpdate(
      { officeId: req.params.id },
      { $set: updates },
      {
        new: true,
        runValidators: true,
        timestamps: true,
      }
    );

    if (!office) {
      return res.status(404).json({
        message: 'Office not found.',
      });
    }

    res.json({
      message: 'Office availability updated successfully.',
      office: formatOffice(office),
    });
  } catch (error) {
    console.error('Update availability error:', error);

    res.status(500).json({
      message: 'Could not update office availability.',
    });
  }
});

module.exports = router;
