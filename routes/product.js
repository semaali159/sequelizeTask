const express = require("express");
const router = express.Router();
const product = require("../controller/product");
const {
  verifyTokenAndBuyer,
  verifyToken,
} = require("../middleware/verifyToken");
router.post("/", verifyTokenAndBuyer, product.addProduct);
router.get("/", verifyToken, product.getAllProduct);
router.get("/:id", verifyToken, product.getProductById);
router.put("/:id", verifyTokenAndBuyer, product.updateProduct);
router.delete("/:id", verifyTokenAndBuyer, product.deleteProduct);
module.exports = router;
