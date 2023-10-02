const express = require("express");
const usersRouter = express.Router();

usersRouter.get("/users");
usersRouter.get("/users/:userId");
usersRouter.post("/users");

module.exports = usersRouter;
