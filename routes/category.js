const express = require("express");
const router = express.Router();
const {
  addCategory,
  getAllCategory,
  getCategoryById,
  editCategory,
  deleteCategory,
} = require("../controller/category");
const {
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middleware/verifyToken");
router.post("/", verifyTokenAndAdmin, addCategory);
router.get("/", verifyToken, getAllCategory);
router.get("/:id", verifyToken, getCategoryById);
router.put("/:id", verifyTokenAndAdmin, editCategory);
router.delete("/:id", verifyTokenAndAdmin, deleteCategory);
module.exports = router;
