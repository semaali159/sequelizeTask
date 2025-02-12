const sequelize = require("../config/connection");
const Admin = require("./Admin");
const Buyer = require("./buyer");
const Customer = require("./customer");
const Product = require("./product");
const Category = require("./category");
const Order = require("./order");
const OrderProduct = require("./orderProduct");

// Associations
Buyer.hasMany(Product, { foreignKey: "buyerId" });
Product.belongsTo(Buyer, { foreignKey: "buyerId" });

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

Customer.hasMany(Order, { foreignKey: "customerId" });
Order.belongsTo(Customer, { foreignKey: "customerId" });

Order.belongsToMany(Product, {
  through: OrderProduct,
  foreignKey: "orderId",
  as: "products",
});

Product.belongsToMany(Order, {
  through: OrderProduct,
  foreignKey: "productId",
  as: "orders",
});
module.exports = {
  OrderProduct,
  sequelize,
  Admin,
  Buyer,
  Customer,
  Product,
  Category,
  Order,
};
