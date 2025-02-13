const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

const { Customer } = require("./customer");
const db = require("../models");
const Order = sequelize.define(
  "Order",
  {
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Customer,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);
// Order.addHook("beforeCreate", async (order, options) => {
//   const orderProducts = await db.OrderProduct.findAll({
//     where: { orderId: order.id },
//     include: [{ model: db.Product }],
//   });

//   const totalAmount = orderProducts.reduce((sum, orderProduct) => {
//     return sum + orderProduct.Product.price * orderProduct.quantity;
//   }, 0);

//   order.totalAmount = totalAmount;
// });

// Order.addHook("beforeUpdate", async (order, options) => {
//   const orderProducts = await db.OrderProduct.findAll({
//     where: { orderId: order.id },
//     include: [{ model: db.Product }],
//   });

//   const totalAmount = orderProducts.reduce((sum, orderProduct) => {
//     return sum + orderProduct.Product.price * orderProduct.quantity;
//   }, 0);

//   order.totalAmount = totalAmount;
// });

module.exports = Order;
