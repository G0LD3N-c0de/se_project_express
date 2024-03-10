const express = require("express");

const usersRouter = express.Router();

const { validateUpdateUser } = require("../middlewares/validation");

const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const authorizationMiddleware = require("../middlewares/auth");

usersRouter.get("/me", authorizationMiddleware, getCurrentUser);
usersRouter.patch(
  "/me",
  authorizationMiddleware,
  validateUpdateUser,
  updateUserProfile,
);

module.exports = usersRouter;
