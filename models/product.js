const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

const Buyer = require("./buyer");
const Category = require("./category");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  buyerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Buyer,
      key: "id",
    },
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Category,
      key: "id",
    },
  },
});

module.exports = Product;
