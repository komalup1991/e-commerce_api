const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/database");

class Analytics extends Model {}

Analytics.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "analytics",
  },
);

module.exports = Analytics;
