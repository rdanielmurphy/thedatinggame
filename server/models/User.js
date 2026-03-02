const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    bio: { type: String, default: '', maxlength: 500 },
    photos: [{ type: String }], // URLs / paths
    question: {
      text: { type: String, default: '' },
      options: { type: [String], default: ['', '', '', ''] },
      correctIndex: { type: Number, default: 0, min: 0, max: 3 },
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      city: { type: String, default: '' },
    },
    gender: { type: String, enum: ['male', 'female', 'nonbinary', 'other'], default: 'other' },
    interestedIn: { type: [String], default: ['male', 'female', 'nonbinary', 'other'] },
    age: { type: Number },
    profileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ 'location': '2dsphere' });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicProfile = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
