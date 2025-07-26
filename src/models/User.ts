import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your first name.'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true, // Ensures no two users can have the same email
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['shopkeeper', 'seller'],
    required: true,
  },
}, { timestamps: true }); 

export default mongoose.models.User || mongoose.model('User', UserSchema);