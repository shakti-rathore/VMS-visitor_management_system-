import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['host', 'receptionist'] },
  email: { type: String }, // Optional, will be added later if not available
  emailPassword: { type: String, required: true }, // New field for email password
});

const User = mongoose.model('User', userSchema);

export default User;