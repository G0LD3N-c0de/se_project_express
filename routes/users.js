const express = require("express");
const usersRouter = express.Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

usersRouter.get("/users", getUsers);
usersRouter.get("/users/:userId", getUser);
usersRouter.post("/users", createUser);

module.exports = usersRouter;
