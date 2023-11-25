const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");
const errors = require("../utils/errors");

const authorizationMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(errors.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res
      .status(errors.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }
  req.user = payload;
  return next();
};

module.exports = authorizationMiddleware;
