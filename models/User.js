const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const { role } = require('../helpers/constants');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(role),default:role.CUSTOMER },
  createdAt: { type: Date, default: Date.now },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
  } catch (error) {
      next(error);
  }
});


// 🔑 Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);