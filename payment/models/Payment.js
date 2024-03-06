const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/database");
const { paymentStatus, paymentMethod } = require("../../config");
const Order = require("../../orders/models/Order");
const User = require("../../users/models/User");

class Payment extends Model {}

Payment.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    paymentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: paymentStatus.PENDING,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: paymentMethod.CREDIT_CARD,
    },
    paymentCardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentCardExpiry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentCardCvv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentCardZipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "payment",
  },
);

Payment.belongsTo(Order, { foreignKey: "orderId" });
Payment.belongsTo(User, { foreignKey: "userId" });
module.exports = Payment;
