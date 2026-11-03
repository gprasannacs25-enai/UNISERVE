
const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    officeId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    place: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ['Available', 'Unavailable', 'Tentative'],
      default: 'Available',
    },

    note: {
      type: String,
      default: '',
    },

    next: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'Availability',
  availabilitySchema
);
