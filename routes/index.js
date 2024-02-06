const express = require("express");

const indexRouter = express.Router();

const { loginUser, createUser } = require("../controllers/users");

const {
  validateNewUser,
  validateUserLogin,
} = require("../middlewares/validation");

indexRouter.post("/signin", validateUserLogin, loginUser);
indexRouter.post("/signup", validateNewUser, createUser);

module.exports = indexRouter;
