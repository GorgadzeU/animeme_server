const controllers = (module.exports = exports = {});
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const objectHasAllFields = require('../utils/validation');
const { cloudinary } = require('../utils/cloudinary');
const { DEFAULT_AVATAR } = process.env;

/**
 * REGISTER NEW USER
 * @param {name, email, password, confirm_password, image} req.body
 * ----------------------------------------------------------
 */
controllers.register = async (req, res) => {
  const { name, email, password, password_confirm, image } = req.body;

  //CHECK IF REQUIRED FIELDS ARE ABSENT
  const validationRes = objectHasAllFields(req.body, [
    'name',
    'email',
    'password',
    'password_confirm',
  ]);

  if (!(validationRes === true)) throw validationRes;

  //CHECK IF USER ALREADY EXISTS
  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ error: true, msg: 'User already exists' });
  }

  // console.log(password);
  console.log(password_confirm);

  //   CHECK IF PASSWORDS MATCH
  if (password !== password_confirm) {
    return res
      .status(400)
      .json({ error: true, msg: 'Passwords does not match' });
  }

  // UPLOAD IMAGE ON CLOUDINARY
  let avatar;
  if (image) {
    const { secure_url } = await cloudinary.uploader.upload(image, {
      upload_preset: 'user_avatar',
      eager: [{ width: 150, height: 150, crop: 'pad' }],
    });

    avatar = secure_url;
  } else {
    avatar = DEFAULT_AVATAR;
  }

  // CREATE NEW USER
  user = new User({
    name,
    email,
    password,
    avatar,
  });

  const token = await user.generateAuthToken();

  res.status(201).json({ token });
};

/**
 * LOG IN
 * @param { email, password} req.body
 * ----------------------------------------------------------
 */

controllers.logIn = async (req, res) => {
  const { email, password } = req.body;

  //CHECK IF REQUIRED FIELDS ARE ABSENT
  const validationRes = objectHasAllFields(req.body, ['email', 'password']);

  if (!(validationRes === true)) throw validationRes;

  // CHECK IF USER EXISTS
  let user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: true, msg: 'Invalid credentials' });
  }

  // CHECK IF PASSWORD IS CORRECT
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ error: true, msg: 'Invalid credentials' });
  }

  //GENERATE TOKEN
  const token = await user.generateAuthToken();

  res.status(200).json({ token });
};

/**
 * LOAD USER
 * ----------------------------------------------------------
 */

controllers.load = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};
