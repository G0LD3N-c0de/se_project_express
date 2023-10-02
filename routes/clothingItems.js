const express = require("express");
const clothingItemsRouter = express.Router();
const {
  getItems,
  postItem,
  deleteItem,
} = require("../controllers/clothingItems");

clothingItemsRouter.get("/items", getItems);
clothingItemsRouter.post("/items", postItem);
clothingItemsRouter.delete("/items/:itemId", deleteItem);

module.exports = clothingItemsRouter;
