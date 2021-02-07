const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { SECRET } = process.env;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//delete password before sending
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

// generate auth token
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const payload = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(payload, SECRET, {
    expiresIn: 360000,
  });

  await user.save();

  return token;
};

//hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(8);

    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});

module.exports = User = mongoose.model('user', userSchema);
