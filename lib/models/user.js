import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,   // name must be provided
    trim: true        // trims whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true,     // each email must be unique
    lowercase: true,  // convert to lowercase
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],  // restrict roles to these options
    default: 'user'
  },
  aadhaar: {
    type: String,
    required: true,
    unique: true,
    length: 12       // Aadhaar is usually 12 digits
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create model from schema
const User = mongoose.model('User', userSchema);

export default User;
