const User = require("../models/user");
const Location = require("../models/location");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email }); //asteptam ca acea metoda sa se executa
  if (userExists)
    return res.status(403).json({
      error: "Email is already taken!",
    });
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashPassword;
  const user = new User(req.body);

  const location = await Location.findOne({ city: req.body.city }).exec();

  user.location = location;
  await user.save();
  res.status(200).json({ message: "Signup success! Please login." });
};

exports.signin = async (req, res) => {
  // find the user based on email

  const user = await User.findOne({ email: req.body.email })
    .populate("following", "_id firstName lastName")
    .populate("followers", "_id firstName lastName");
  if (!user)
    return res.status(403).json({
      error: "Email or password is wrong",
    });
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(403).json({
      error: "Email or passwordd is wrong",
    });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  const {
    _id,
    firstName,
    lastName,
    email,
    location,
    photo,
    following,
    followers,
    created,
    homeland
  } = user;
  res.json({
    token,
    user: {
      _id,
      firstName,
      lastName,
      email,
      location,
      photo,
      following,
      followers,
      created,
      homeland
    },
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});
