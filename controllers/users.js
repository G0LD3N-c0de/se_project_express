const User = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: "An error occurred with fetching users" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: "An error occured with fetching user" });
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
    res.status(500).send({ error: "An error occured while creating user" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
