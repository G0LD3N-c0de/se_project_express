const express = require("express");
const usersRouter = express.Router();

const { getCurrentUser } = require("../controllers/users");

usersRouter.get("/me", getCurrentUser);

module.exports = usersRouter;
