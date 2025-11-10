const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  bio: { type: String },
  company: { type: String },
  jobTitle: { type: String },
  website: { type: String },
  location: { type: String },
  avatarUrl: { type: String }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  profile: { type: ProfileSchema, default: {} }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('User', UserSchema);
