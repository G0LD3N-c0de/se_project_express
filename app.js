const express = require("express");

const cors = require("cors");
const helmet = require("helmet");

const app = express();

require("dotenv").config();

const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const clothingItemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");
const indexRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundError = require("./errors/NotFoundError");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.use(cors());

// ----- Security ----- //
app.use(helmet());
app.use(helmet.contentSecurityPolicy());
app.use(helmet.hsts());
app.use(helmet.frameguard());

// Request logger (Placement: before routes)
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// ----- Routes ----- //
app.use("/users", usersRouter);
app.use("/items", clothingItemsRouter);
app.use("/", indexRouter);

// Error logger (Placement: after routes but before error handling)
app.use(() => {
  throw new NotFoundError("Requested resource not found");
});

app.use(errorLogger);

// Celebrate error handling middleware
app.use(errors());

// Central error handling middleware
app.use(errorHandler);

app.listen(PORT);
