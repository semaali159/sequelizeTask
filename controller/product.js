const { verifyProductOwner } = require("../middleware/verifyOwner");
const db = require("../models");
const asynchandler = require("express-async-handler");
// Create a new product
// const createProduct = asynchandler(async(req,res)=>{

// })
const addProduct = asynchandler(async (req, res) => {
  const { name, description, price, categoryId } = req.body;
  const product = await db.Product.create({
    name,
    description,
    price,
    categoryId,
    buyerId: req.user.id,
  });

  res.status(201).json({ message: "product added successfuly", product });
});
// Get all products
const getAllProduct = asynchandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 2;
  const offset = (page - 1) * pageSize;

  const products = await db.Product.findAll({
    include: [
      { model: db.Buyer, attributes: ["id", "name"] },
      { model: db.Category, attributes: ["id", "name"] },
    ],
    offset: offset,
    limit: pageSize,
  });
  if (!products) {
    return res.status(404).json({ error: "there are not products added yet " });
  }
  return res.status(200).json(products);
});
// Get product by ID
const getProductById = asynchandler(async (req, res) => {
  const { id } = req.params;
  const product = await db.Product.findByPk(id, {
    include: [
      { model: db.Buyer, attributes: ["id", "name"] },
      { model: db.Category, attributes: ["id", "name"] },
    ],
  });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  return res.status(200).json(product);
});

// Update product
const updateProduct = [
  verifyProductOwner,
  asynchandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    console.log(updates);
    const [updateRows] = await db.Product.update(updates, {
      where: { id: id },
    });
    if (updateRows === 0) {
      return res.status(404).json({ error: "product not found" });
    }
    return res.status(200).json({ message: "product updated successfully" });
    // const product = await db.Product.findByPk(id);

    // if (!product) {
    //   return res.status(404).json({ error: "Product not found" });
    // }

    // if (req.user.role !== "buyer" || req.user.id !== product.ownerId) {
    //   return res
    //     .status(403)
    //     .json({ error: "You are not authorized to update this product" });
    // }

    // await product.update({ name, description, price, category });

    // return res
    //   .status(200)
    //   .json({ message: "Product updated successfully", product });
  }),
];

// Delete product
const deleteProduct = [
  verifyProductOwner,
  asynchandler(async (req, res) => {
    // const { id } = req.params;

    // const product = await db.Product.findByPk(id);

    // if (!product) {
    //   return res.status(404).json({ error: "Product not found" });
    // }

    // if (req.user.role !== "buyer" || req.user.id !== product.ownerId) {
    //   return res
    //     .status(403)
    //     .json({ error: "You are not authorized to delete this product" });
    // }

    await req.product.destroy();

    return res.status(200).json({ message: "Product deleted successfully" });
  }),
];
module.exports = {
  addProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
