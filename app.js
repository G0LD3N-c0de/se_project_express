const express = require("express");

const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const clothingItemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");
const indexRouter = require("./routes/index");
const errors = require("./utils/errors");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

// ----- ROUTES ----- //
app.use("/items", clothingItemsRouter);
app.use("/users", usersRouter);
app.use("/", indexRouter);
// ----- END ROUTES ----- //

app.use((req, res) => {
  res.status(404).send({ message: "requested resource not found" });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "DocumentNotFoundError") {
    res.status(errors.NOT_FOUND).send({ message: "Item not found" });
  } else {
    res
      .status(errors.SERVER_ERROR)
      .send({ message: "An error occurred on the server" });
  }

  next();
});

app.listen(PORT, () => {
  console.log(`App is listening to ${PORT}`);
});
