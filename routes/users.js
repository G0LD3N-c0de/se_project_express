const express = require("express");

const usersRouter = express.Router();

const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const authorization = require("../middlewares/auth");

usersRouter.get("/me", authorization, getCurrentUser);
usersRouter.patch("/me", authorization, updateUserProfile);

module.exports = usersRouter;
