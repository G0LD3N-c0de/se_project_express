const express = require("express");

const authorizationMiddleware = require("../middlewares/auth");

const { validateCardBody, validateId } = require("../middlewares/validation");

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
  authorizationMiddleware,
  validateCardBody,
  postItem,
);
clothingItemsRouter.delete(
  "/:itemId",
  authorizationMiddleware,
  validateId,
  deleteItem,
);
clothingItemsRouter.put(
  "/:itemId/likes",
  authorizationMiddleware,
  validateId,
  likeItem,
);
clothingItemsRouter.delete(
  "/:itemId/likes",
  authorizationMiddleware,
  validateId,
  unlikeItem,
);

module.exports = clothingItemsRouter;
