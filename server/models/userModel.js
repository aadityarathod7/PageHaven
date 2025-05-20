const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Password encryption middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Pre-save middleware to auto-increment userId
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastUser = await this.constructor.findOne({}, {}, { sort: { 'userId': -1 } });
    this.userId = lastUser ? lastUser.userId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);