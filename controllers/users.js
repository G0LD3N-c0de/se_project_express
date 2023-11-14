const User = require("../models/user");
const errors = require("../utils/errors");
const bcrypt = require("bcrypt");
import { JWT_SECRET } from "../utils/config";

// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.send(users);
//   } catch (error) {
//     res
//       .status(errors.SERVER_ERROR)
//       .send({ error: "An error occurred with fetching users" });
//   }
// };

// const getUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId).orFail();
//     res.send(user);
//   } catch (error) {
//     if (error.name === "CastError") {
//       res
//         .status(errors.BAD_REQUEST)
//         .send({ message: "invalid data for request" });
//     } else if (error.name === "DocumentNotFoundError") {
//       res.status(errors.NOT_FOUND).send({ message: "Item not found" });
//     } else {
//       console.error("Error retreiving user:", error);
//       res
//         .status(errors.SERVER_ERROR)
//         .send({ message: "An error occured on the server" });
//     }
//   }
// };

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(errors.NOT_FOUND).send({ message: "User not found" });
    }

    res.status(200).send(currentUser);
  } catch (error) {
    console.error(error);
    res
      .status(errors.SERVER_ERROR)
      .send({ message: "An error occured on the server" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(errors.BAD_REQUEST)
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

    res.status(201).send(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Email is already in use");
    } else if (error.name === "ValidationError") {
      res
        .status(errors.BAD_REQUEST)
        .send({ message: "Invalid data for creating user" });
    } else {
      console.error(error);
      res
        .status(errors.SERVER_ERROR)
        .send({ message: "An error occured on the server" });
    }
  }
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send(token);
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
};
