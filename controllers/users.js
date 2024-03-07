const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      throw new NotFoundError("No user with matching ID found");
    }

    return res.send(currentUser);
  } catch (err) {
    next(err);
  }
};

const updateUserProfile = (req, res, next) => {
  const userId = req.user._id;
  const updates = req.body;

  User.findByIdAndUpdate(userId, updates, {
    runValidators: true,
    new: true,
  })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError("User not found");
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid request"));
      } else next(err);
    });
};

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email) {
      throw new BadRequestError("No email was provided");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ConflictError("Email is already in use");
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
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError("Email already in use"));
    } else if (err.name === "ValidationError") {
      console.error(err);
      next(new BadRequestError("Invalid data for creating user"));
    } else {
      next(err);
    }
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.send({ token });
  } catch (err) {
    if (err.message === "Invalid email or password") {
      next(new UnauthorizedError("Invalid email or password"));
    } else {
      next(err);
    }
  }
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
};
