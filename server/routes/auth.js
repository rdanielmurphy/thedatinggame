const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    const user = await User.create({ email, password, name });
    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toPublicProfile() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    console.log('Login attempt for:', email, 'User found:', !!user);
    console.log('comparePassword:', password);
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    res.json({ token, user: user.toPublicProfile() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
