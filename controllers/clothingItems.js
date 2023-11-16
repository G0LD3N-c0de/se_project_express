const ClothingItem = require("../models/clothingItem");
const errors = require("../utils/errors");
const { getCurrentUser } = require("./users");

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.send(items);
  } catch (error) {
    console.error("Error retreiving item:", error);
    res
      .status(errors.SERVER_ERROR)
      .send({ error: "An error occured retrieving items" });
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

    res.status(201).send(savedItem);
  } catch (error) {
    if (error.name === "ValidationError") {
      res
        .status(errors.BAD_REQUEST)
        .send({ message: "Invalid data for creating item" });
    } else {
      console.error("Error posting item", error);
      res
        .status(errors.SERVER_ERROR)
        .send({ message: "An error occured on the server" });
    }
  }
};

// const deleteItem = async (req, res) => {
//   try {
//     const deletedItem = await ClothingItem.findByIdAndDelete(
//       req.params.itemId,
//     ).orFail();
//     res.status(200).send(deletedItem);
//   } catch (error) {
//     if (error.name === "DocumentNotFoundError") {
//       res.status(errors.NOT_FOUND).send({ message: "Item not found" });
//     } else if (error.name === "CastError") {
//       res.status(errors.BAD_REQUEST).send({ message: "Invalid request" });
//     } else {
//       console.error("Error deleting item:", error);
//       res
//         .status(errors.SERVER_ERROR)
//         .send({ message: "An error occured on the server" });
//     }
//   }
// };

const deleteItem = (req, res) => {
  const currentUser = getCurrentUser();
  const currentUserId = currentUser._id;

  const toBeDeletedItem = ClothingItem.findById(req.params.itemId)
    .then((item) => {
      // Check for item in database
      if (!item) {
        return res.status(errors.NOT_FOUND).send({ message: "Item not found" });
      }
      // Check current user to owner of item
      if (currentUserId !== item.owner._id) {
        return res
          .status(errors.BAD_REQUEST)
          .send({ message: "Current user did not create this item" });
      }
      // Remove item if current user is the owner of item
      ClothingItem.deleteOne({ _id: item._id }).then(() => {
        res.status(200).send(toBeDeletedItem);
      });
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        res.status(errors.NOT_FOUND).send({ message: "Item not found" });
      } else if (error.name === "CastError") {
        res.status(errors.BAD_REQUEST).send({ message: "Invalid request" });
      } else {
        console.error("Error deleting item:", error);
        res
          .status(errors.SERVER_ERROR)
          .send({ message: "An error occured on the server" });
      }
    });
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
      res.status(200).send(updatedItem);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(errors.BAD_REQUEST).send({ message: "Invalid request" });
      } else if (error.name === "DocumentNotFoundError") {
        res.status(errors.NOT_FOUND).send({ message: "Item not found" });
      } else {
        console.error("Error updating item:", error);
        res
          .status(errors.SERVER_ERROR)
          .send({ message: "An error occured within the server" });
      }
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
      res.status(200).send(updatedItem);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(errors.BAD_REQUEST).send({ message: "Invalid request" });
      } else if (error.name === "DocumentNotFoundError") {
        res.status(errors.NOT_FOUND).send({ message: "Item not found" });
      } else {
        console.error("Error updating item:", error);
        res
          .status(errors.SERVER_ERROR)
          .send({ message: "An error occurred on the server" });
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
