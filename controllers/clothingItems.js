const ClothingItem = require("../models/clothingItem");

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.send(items);
  } catch (error) {
    res.status(500).send({ error: "An error occured retrieving items" });
  }
};

const postItem = async (req, res) => {
  try {
    const newItem = new ClothingItem({
      name: req.body.name,
      weather: req.body.weather,
      imageUrl: req.body.imageUrl,
    });

    const savedItem = await newItem.save();

    res.status(201).send(savedItem);
  } catch (error) {
    res.status(500).send({ error: "An error occured in posting item" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const deletedItem = await ClothingItem.findByIdAndDelete(req.params.itemId);
    res.status(204).send(deletedItem);
  } catch (error) {
    res.status(500).send({ error: "An error occured in deleting the item" });
  }
};

module.exports = {
  getItems,
  postItem,
  deleteItem,
};
