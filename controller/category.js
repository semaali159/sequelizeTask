const db = require("../models");
const asynchandler = require("express-async-handler");
const {
  validateCreateCategory,
  validateUpdateCategory,
} = require("../utils/validate");
/**
 *  @desc    Add A Category
 * @route    POST /api/category
 * @access  private (only admin)
 */
const addCategory = asynchandler(async (req, res) => {
  const { error } = validateCreateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, description } = req.body;
  const category = await db.Category.create({ name, description });
  return res
    .status(201)
    .json({ message: "category added successfully", category });
});
/**
 *  @desc    Get Category By Id
 * @route    GET /api/category
 * @access  public
 */
const getAllCategory = asynchandler(async (req, res) => {
  const categories = await db.Category.findAll();
  if (!categories) {
    return res.status(404).json({ message: "categories not found" });
  }
  return res.status(200).json({ categories });
});
/**
 *  @desc    Get All Categories
 * @route    GET /api/category
 * @access  public
 */
const getCategoryById = asynchandler(async (req, res) => {
  const { id } = req.params;
  const category = await db.Category.findByPk(id);

  if (!category) {
    return res.status(404).json({ error: "category not found" });
  }

  return res.status(200).json({ category });
});
/**
 *  @desc    Update A Category
 * @route    PUT /api/category
 * @access  private (only admin)
 */
const editCategory = asynchandler(async (req, res) => {
  const { error } = validateUpdateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { id } = req.params;
  const updates = req.body;
  const [updateRows] = await db.Category.update(updates, { where: { id: id } });
  if (updateRows === 0) {
    return res.status(404).json({ error: "category not found" });
  }
  return res.status(200).json({ message: "category updated successfully" });
  // const category = await db.Category.findByPk(id);
  // if (!category) {
  //   return res.status(404).json({ error: "category not found" });
  // }
  // const { name, description } = req.body;
  // await category.update({ name, description });

  // return res
  //   .status(200)
  //   .json({ message: "Product updated successfully", category });
});
/**
 *  @desc    Delete A Category
 * @route    DELETE /api/category
 * @access  private (only admin)
 */
const deleteCategory = asynchandler(async (req, res) => {
  const { id } = req.params;
  const category = await db.Category.findByPk(id);

  if (!category) {
    return res.status(404).json({ error: "category not found" });
  }
  await category.destroy();

  return res.status(200).json({ message: "Product deleted successfully" });
});
module.exports = {
  addCategory,
  getAllCategory,
  getCategoryById,
  editCategory,
  deleteCategory,
};
