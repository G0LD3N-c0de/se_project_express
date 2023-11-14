const express = require("express");
const indexRouter = express.Router();

const { loginUser, createUser } = require("../controllers/users");

indexRouter.post("/signin", loginUser);
indexRouter.post("/signup", createUser);

module.exports = indexRouter;
