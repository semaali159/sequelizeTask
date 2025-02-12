const sequelize = require("../config/connection");
const { DataTypes, INTEGER } = require("sequelize");

const OrderProduct = sequelize.define("OrderProduct", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});
module.exports = OrderProduct;
