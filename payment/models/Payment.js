const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/database");
const { paymentStatus, paymentMethod } = require("../../config");

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
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

module.exports = Payment;
