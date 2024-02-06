const express = require("express");

const authorizationMiddleware = require("../middlewares/auth");

const { validateCardBody } = require("../middlewares/validation");

const clothingItemsRouter = express.Router();
const {
  getItems,
  postItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

clothingItemsRouter.get("/", getItems);
clothingItemsRouter.post(
  "/",
  validateCardBody,
  authorizationMiddleware,
  postItem,
);
clothingItemsRouter.delete("/:itemId", authorizationMiddleware, deleteItem);
clothingItemsRouter.put("/:itemId/likes", authorizationMiddleware, likeItem);
clothingItemsRouter.delete(
  "/:itemId/likes",
  authorizationMiddleware,
  unlikeItem,
);

module.exports = clothingItemsRouter;
