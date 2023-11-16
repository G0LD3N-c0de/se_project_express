const express = require("express");
const usersRouter = express.Router();

const { getCurrentUser, updateUserProfile } = require("../controllers/users");

usersRouter.get("/me", getCurrentUser);
usersRouter.patch("/me", updateUserProfile);

module.exports = usersRouter;
