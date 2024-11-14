import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Correct import for bcryptjs

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Changed fullName to name
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Password hashing and comparison methods
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10); // Hashing password with bcryptjs
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Using bcryptjs to compare passwords
};

const User = mongoose.model('User', userSchema);
export default User;
