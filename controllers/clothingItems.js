const ClothingItem = require("../models/clothingItem");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");

const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();

    if (!items) {
      throw new NotFoundError("Clothing items not found");
    }

    res.send(items);
  } catch (err) {
    next(err);
  }
};

const postItem = async (req, res, next) => {
  try {
    const newItem = new ClothingItem({
      name: req.body.name,
      weather: req.body.weather,
      imageUrl: req.body.imageUrl,
      owner: req.user._id,
    });

    const savedItem = await newItem.save();

    return res.status(201).send(savedItem);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid data for creating item"));
    } else {
      next(err);
    }
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    const toBeDeletedItem = await ClothingItem.findById(req.params.itemId);

    if (!toBeDeletedItem) {
      throw new NotFoundError("Item not found");
    }
    // Check if the current user is the owner of the item to be deleted
    if (currentUserId !== toBeDeletedItem.owner.valueOf()) {
      throw new ForbiddenError("Current user did not create this item");
    }

    const deletedItem = await ClothingItem.deleteOne({
      _id: toBeDeletedItem._id,
    });
    return res.send(deletedItem);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      next(new NotFoundError("Item not found"));
    } else if (err.name === "CastError") {
      next(new BadRequestError("Invalid request"));
    } else {
      next(err);
    }
  }
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: {
        likes: req.user._id,
      },
    },
    { new: true },
  )
    .orFail()
    .then((updatedItem) => {
      res.send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid request"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else {
        next(err);
      }
    });
};

const unlikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail()
    .then((updatedItem) => {
      res.send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid request"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getItems,
  postItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
