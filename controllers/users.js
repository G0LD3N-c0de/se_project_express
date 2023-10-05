const User = require("../models/user");
const errors = require("../utils/errors");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res
      .status(errors.SERVER_ERROR)
      .send({ error: "An error occurred with fetching users" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail();
    res.send(user);
  } catch (error) {
    if ((error.name = "ValidationError")) {
      res
        .status(errors.BAD_REQUEST)
        .send({ message: "invalid data for request" });
    } else if (error) {
      if ((error.name = "documentNotFoundError")) {
        res.status(errors.NOT_FOUND).send({ message: "No user with that Id" });
      }
    } else {
      console.error(error);
      res
        .status(errors.SERVER_ERROR)
        .send({ message: "An error occured on the server" });
    }
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      avatar: req.body.avatar,
    });

    const savedUser = await newUser.save();

    res.status(201).send(savedUser);
  } catch (error) {
    if ((error.name = "ValidationError")) {
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

module.exports = {
  getUsers,
  getUser,
  createUser,
};
