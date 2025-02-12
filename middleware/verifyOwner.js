const asynchandler = require("express-async-handler");
const db = require("../models");
const verifyProductOwner = asynchandler(async (req, res, next) => {
  const product = await db.Product.findByPk(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.id !== product.buyerId) {
    return res.status(403).json({
      message: "Access denied, only the owner can perform this action",
    });
  }

  req.product = product;
  next();
});
const verifyOrderOwner = asynchandler(async (req, res, next) => {
  const order = await db.Order.findByPk(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  if (req.user.id !== order.customer.toString()) {
    return res.status(403).json({
      message: "Access denied, only the owner can perform this action",
    });
  }
  req.order = order;
  next();
});
// const verifyCategoryOwner = asynchandler(async (req, res, next) => {
//     const category = await db.Category.findByPk(req.params.id);
//     if (!category) {
//       return res.status(404).json({ message: "category not found" });
//     }
//     if (req.user.id !== category.customer.toString()) {
//       return res.status(403).json({
//         message: "Access denied, only the owner can perform this action",
//       });
//     }
//     req.order = order;
//     next();
//   });
module.exports = { verifyOrderOwner, verifyProductOwner };
