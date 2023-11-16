const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid token" });
  }
};

module.exports = {
  authorization,
};
