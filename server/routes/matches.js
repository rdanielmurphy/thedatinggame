const router = require('express').Router();
const auth = require('../middleware/auth');
const Match = require('../models/Match');

// Get all matches for current user
router.get('/', auth, async (req, res) => {
  try {
    const matches = await Match.find({ users: req.user._id })
      .populate('users', 'name photos bio')
      .populate('conversation')
      .sort({ createdAt: -1 });

    // Format: return the other user's info with each match
    const formatted = matches.map((match) => {
      const otherUser = match.users.find((u) => u._id.toString() !== req.user._id.toString());
      return {
        _id: match._id,
        user: otherUser,
        conversationId: match.conversation?._id,
        createdAt: match.createdAt,
      };
    });

    res.json({ matches: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
