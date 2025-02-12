const db = require("../models");
const asynchandler = require("express-async-handler");
const addOrde = asynchandler(async (req, res) => {
  const order = await db.Order.create({ customerId: req.user.id });
  const products = req.body.products;
  if (products && products.length > 0) {
    for (const product of products) {
      const orderpr = await db.OrderProduct.create({
        orderId: newOrder.id,
        productId: product.id,
        quantity: product.quantity,
      });
    }
  }
  //   await db.OrderProduct.bulkCreate(orderProducts);
  return res.status(201).json({});
});
