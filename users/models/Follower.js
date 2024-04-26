const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/database");
const User = require("./User");

// Define the model

class Follower extends Model {}

Follower.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users", // Note the table name is typically plural if not explicitly defined otherwise in Sequelize
        key: "id",
      },
    },
    followerId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "follower",
  },
);

// Establish relationships
User.belongsToMany(User, {
  as: "Followers",
  through: Follower,
  foreignKey: "userId",
  otherKey: "followerId",
});

User.belongsToMany(User, {
  as: "Following",
  through: Follower,
  foreignKey: "followerId",
  otherKey: "userId",
});

module.exports = Follower;
