const express = require("express");
const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItems");
const errors = require("./utils/errors");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "651c7a9dc04b301de5c8d94e",
  };
  next();
});

app.use("/users", usersRouter);
app.use("/items", clothingItemsRouter);

// app.use((req, res) => {
//   res.status(404).send({ message: "requested resource not found" });
// });

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "DocumentNotFoundError") {
    // Handle not found errors (404 Not Found)
    res.status(errors.NOT_FOUND).send({ message: "Item not found" });
  } else {
    // Handle other errors (500 Internal Server Error)
    res
      .status(errors.SERVER_ERROR)
      .send({ message: "An error occurred on the server" });
  }
});

app.listen(PORT, () => {
  console.log(`App is listening to ${PORT}`);
});
