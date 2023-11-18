const express = require("express");

const usersRouter = express.Router();

const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const authorizationMiddleware = require("../middlewares/auth");

usersRouter.get("/me", authorizationMiddleware, getCurrentUser);
usersRouter.patch("/me", authorizationMiddleware, updateUserProfile);

module.exports = usersRouter;
