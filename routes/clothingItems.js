const express = require("express");

const authorizationMiddleware = require("../middlewares/auth");

const clothingItemsRouter = express.Router();
const {
  getItems,
  postItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

clothingItemsRouter.get("/", getItems);
clothingItemsRouter.post("/", authorizationMiddleware, postItem);
clothingItemsRouter.delete("/:itemId", authorizationMiddleware, deleteItem);
clothingItemsRouter.put("/:itemId/likes", authorizationMiddleware, likeItem);
clothingItemsRouter.delete(
  "/:itemId/likes",
  authorizationMiddleware,
  unlikeItem,
);

module.exports = clothingItemsRouter;
