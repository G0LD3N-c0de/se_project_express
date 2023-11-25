const ClothingItem = require("../models/clothingItem");

const errors = require("../utils/errors");

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.send(items);
  } catch (error) {
    console.error(SyntaxError);
    res
      .status(errors.SERVER_ERROR)
      .send({ error: "An error occurred retrieving items" });
  }
};

const postItem = async (req, res) => {
  try {
    const newItem = new ClothingItem({
      name: req.body.name,
      weather: req.body.weather,
      imageUrl: req.body.imageUrl,
      owner: req.user._id,
    });

    const savedItem = await newItem.save();

    return res.status(201).send(savedItem);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res
        .status(errors.BAD_REQUEST)
        .send({ message: "Invalid data for creating item" });
    }
    return res
      .status(errors.SERVER_ERROR)
      .send({ message: "An error occured on the server" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const toBeDeletedItem = await ClothingItem.findById(req.params.itemId);

    if (!toBeDeletedItem) {
      return res.status(errors.NOT_FOUND).send({ message: "Item not found" });
    }
    // Check if the current user is the owner of the item to be deleted
    if (currentUserId !== toBeDeletedItem.owner.valueOf()) {
      return res
        .status(errors.FORBIDDEN)
        .send({ message: "Current user did not create this item" });
    }

    const deletedItem = await ClothingItem.deleteOne({
      _id: toBeDeletedItem._id,
    });
    return res.send(deletedItem);
  } catch (error) {
    console.error(error);
    if (error.name === "DocumentNotFoundError") {
      return res.status(errors.NOT_FOUND).send({ message: "Item not found" });
    }
    if (error.name === "CastError") {
      return res
        .status(errors.BAD_REQUEST)
        .send({ message: "Invalid request" });
    }
    return res
      .status(errors.SERVER_ERROR)
      .send({ message: "An error occured on the server" });
  }
};

const likeItem = (req, res) => {
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
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(errors.BAD_REQUEST)
          .send({ message: "Invalid request" });
      }
      if (error.name === "DocumentNotFoundError") {
        return res.status(errors.NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(errors.SERVER_ERROR)
        .send({ message: "An error occured within the server" });
    });
};

const unlikeItem = (req, res) => {
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
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(errors.BAD_REQUEST)
          .send({ message: "Invalid request" });
      }
      if (error.name === "DocumentNotFoundError") {
        return res.status(errors.NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(errors.SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = {
  getItems,
  postItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
