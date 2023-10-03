const express = require("express");
const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItems");

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.use("/users", usersRouter);
app.use("/clothingItems", clothingItemsRouter);

app.use((req, res) => {
  res.status(404).send({ message: "requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`App is listening to ${PORT}`);
});
