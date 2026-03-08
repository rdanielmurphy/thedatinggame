const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const Conversation = require('../models/Conversation');

// Get nearby users to swipe on
router.get('/feed', auth, async (req, res) => {
  try {
    const me = req.user;
    const maxDistance = (req.query.distance || process.env.MAX_DISTANCE_KM || 50) * 1000; // km to meters

    // Get IDs of users already swiped on
    const swipedIds = (await Swipe.find({ swiper: me._id }).select('target')).map((s) => s.target);

    const query = {
      _id: { $nin: [...swipedIds, me._id] },
      profileComplete: true,
    };

    // If user has location set, use geospatial query
    if (me.location?.coordinates?.[0] !== 0 || me.location?.coordinates?.[1] !== 0) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: me.location.coordinates },
          $maxDistance: maxDistance,
        },
      };
    }

    const users = await User.find(query).limit(20).select('-__v');
    res.json({ users: users.map((u) => u.toPublicProfile()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Swipe on a user
router.post('/swipe', auth, async (req, res) => {
  try {
    const { targetId, direction } = req.body;
    if (!targetId || !['left', 'right'].includes(direction)) {
      return res.status(400).json({ error: 'targetId and direction (left/right) required' });
    }

    // Prevent duplicate swipes
    const existing = await Swipe.findOne({ swiper: req.user._id, target: targetId });
    if (existing) return res.status(400).json({ error: 'Already swiped on this user' });

    if (direction === 'left') {
      await Swipe.create({ swiper: req.user._id, target: targetId, direction: 'left' });
      return res.json({ result: 'passed' });
    }

    // Right swipe — return the target's question
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ error: 'User not found' });

    res.json({
      result: 'question',
      question: {
        text: target.question.text,
        options: target.question.options,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Answer question after right swipe
router.post('/answer', auth, async (req, res) => {
  try {
    const { targetId, answerIndex } = req.body;
    if (!targetId || answerIndex === undefined) {
      return res.status(400).json({ error: 'targetId and answerIndex required' });
    }

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ error: 'User not found' });

    const correct = target.question.correctIndex === answerIndex;

    // Record the swipe
    await Swipe.findOneAndUpdate(
      { swiper: req.user._id, target: targetId },
      { swiper: req.user._id, target: targetId, direction: 'right', answeredCorrectly: correct },
      { upsert: true }
    );

    if (!correct) {
      return res.json({ result: 'wrong', message: 'Wrong answer! Better luck next time.' });
    }

    // Check if the other user also swiped right AND answered correctly
    const theirSwipe = await Swipe.findOne({
      swiper: targetId,
      target: req.user._id,
      direction: 'right',
      answeredCorrectly: true,
    });

    if (theirSwipe) {
      // It's a match! Create conversation and match
      const existingMatch = await Match.findOne({
        users: { $all: [req.user._id, targetId] },
      });
      if (!existingMatch) {
        const conversation = await Conversation.create({
          participants: [req.user._id, targetId],
        });
        await Match.create({
          users: [req.user._id, targetId],
          conversation: conversation._id,
        });
      }
      return res.json({ result: 'match', message: "It's a match! 🎉" });
    }

    res.json({ result: 'correct', message: 'Correct! Waiting for them to answer your question.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
