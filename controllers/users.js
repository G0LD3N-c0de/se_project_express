const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const errors = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(errors.NOT_FOUND).send({ message: "User not found" });
    }
    return res.send(currentUser);
  } catch (error) {
    return res
      .status(errors.SERVER_ERROR)
      .send({ message: "An error occured on the server" });
  }
};

const updateUserProfile = (req, res) => {
  const userId = req.user._id;
  const updates = req.body;

  User.findByIdAndUpdate(userId, updates, {
    runValidators: true,
    new: true,
  })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(errors.NOT_FOUND).send({ message: "User not found" });
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(errors.BAD_REQUEST)
          .send({ message: "Invalid request" });
      }
      return res
        .status(errors.SERVER_ERROR)
        .send({ message: "An error occured on the server" });
    });
};

const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email) {
      return res
        .status(errors.BAD_REQUEST)
        .send({ message: "No email was provided" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(errors.CONFLICT)
        .send({ message: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const savedUser = await User.create(newUser);

    const userResponse = {
      name: savedUser.name,
      _id: savedUser._id,
      email: savedUser.email,
      avatar: savedUser.avatar,
      __v: savedUser.__v,
    };

    return res.status(201).send(userResponse);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(errors.CONFLICT)
        .send({ message: "Email already in use" });
    }
    if (error.name === "ValidationError") {
      return res
        .status(errors.BAD_REQUEST)
        .send({ message: "Invalid data for creating user" });
    }
    return res
      .status(errors.SERVER_ERROR)
      .send({ message: "An error occured on the server" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.send({ token });
  } catch (err) {
    if (err.message === "Invalid email or password") {
      res.status(errors.UNAUTHORIZED).send({ message: err.message });
    }
    console.error(err);
    res
      .status(errors.SERVER_ERROR)
      .send({ message: "A problem occured on the server" });
  }
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
};
