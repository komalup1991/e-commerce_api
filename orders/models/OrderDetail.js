const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/database");
const { productPriceUnit } = require("../../config");
const Product = require("../../products/models/Product");
const Order = require("./Order");

class OrderDetails extends Model {}

OrderDetails.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    priceUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: productPriceUnit.DOLLAR,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    itemQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    itemTotalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "orderDetails",
  },
);

OrderDetails.belongsTo(Order, { foreignKey: "orderId" });
OrderDetails.belongsTo(Product, { foreignKey: "productId" });
module.exports = OrderDetails;
