const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Ensure uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get my profile
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user.toPublicProfile() });
});

// Update profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, bio, age, gender, interestedIn, question, location } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (age !== undefined) updates.age = age;
    if (gender !== undefined) updates.gender = gender;
    if (interestedIn !== undefined) updates.interestedIn = interestedIn;
    if (question !== undefined) updates.question = question;
    if (location !== undefined) {
      updates.location = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        city: location.city || '',
      };
    }

    // Check if profile is complete
    const user = await User.findById(req.user._id);
    const merged = { ...user.toObject(), ...updates };
    updates.profileComplete =
      merged.name &&
      merged.bio &&
      merged.photos?.length > 0 &&
      merged.question?.text &&
      merged.location?.coordinates?.[0] !== 0;

    const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user: updated.toPublicProfile() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload photo
router.post('/photos', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const photoUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { photos: photoUrl } },
      { new: true }
    );
    res.json({ user: user.toPublicProfile(), photoUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload photo as base64
router.post('/photos/base64', auth, async (req, res) => {
  try {
    const { image } = req.body; // data:image/jpeg;base64,...
    if (!image) return res.status(400).json({ error: 'No image provided' });
    const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: 'Invalid base64 image' });
    const ext = matches[1];
    const data = Buffer.from(matches[2], 'base64');
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    fs.writeFileSync(path.join(uploadsDir, filename), data);
    const photoUrl = `/uploads/${filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { photos: photoUrl } },
      { new: true }
    );
    res.json({ user: user.toPublicProfile(), photoUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete photo
router.delete('/photos', auth, async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { photos: photoUrl } },
      { new: true }
    );
    res.json({ user: user.toPublicProfile() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
