const router = require('express').Router();
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Get all conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name photos')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    const formatted = conversations.map((c) => {
      const other = c.participants.find((p) => p._id.toString() !== req.user._id.toString());
      return {
        _id: c._id,
        user: other,
        lastMessage: c.lastMessage,
        updatedAt: c.updatedAt,
      };
    });

    res.json({ conversations: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages for a conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Verify user is participant
    const convo = await Conversation.findById(conversationId);
    if (!convo || !convo.participants.includes(req.user._id)) {
      return res.status(403).json({ error: 'Not a participant' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name photos')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ messages: messages.reverse() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message (REST fallback)
router.post('/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    const convo = await Conversation.findById(conversationId);
    if (!convo || !convo.participants.includes(req.user._id)) {
      return res.status(403).json({ error: 'Not a participant' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text,
    });
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    const populated = await message.populate('sender', 'name photos');
    res.status(201).json({ message: populated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
