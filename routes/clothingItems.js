const express = require("express");

const clothingItemsRouter = express.Router();
const {
  getItems,
  postItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

clothingItemsRouter.get("/", getItems);
clothingItemsRouter.post("/", postItem);
clothingItemsRouter.delete("/:itemId", deleteItem);
clothingItemsRouter.put("/:itemId/likes", likeItem);
clothingItemsRouter.delete("/:itemId/likes", unlikeItem);

module.exports = clothingItemsRouter;
