const express = require("express");
import authorization from "../middlewares/auth";

const clothingItemsRouter = express.Router();
const {
  getItems,
  postItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

clothingItemsRouter.get("/", getItems);
clothingItemsRouter.post("/", authorization, postItem);
clothingItemsRouter.delete("/:itemId", authorization, deleteItem);
clothingItemsRouter.put("/:itemId/likes", authorization, likeItem);
clothingItemsRouter.delete("/:itemId/likes", authorization, unlikeItem);

module.exports = clothingItemsRouter;
