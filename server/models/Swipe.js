const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema(
  {
    swiper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    target: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    direction: { type: String, enum: ['left', 'right'], required: true },
    answeredCorrectly: { type: Boolean, default: null }, // null = left swipe, true/false = right swipe answer result
  },
  { timestamps: true }
);

swipeSchema.index({ swiper: 1, target: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', swipeSchema);
