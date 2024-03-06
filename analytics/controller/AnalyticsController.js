const Analytics = require("../models/Analytics");
const Order = require("../../orders/models/Order");
const Sequelize = require("sequelize");
const OrderDetails = require("../../orders/models/OrderDetail");

const trackEvent = (data) => {
  Analytics.create({
    productId: data.productId,
    userId: data.userId,
    eventName: data.eventName,
  });
};

// Get 10 popular products Ids
const getPopularProducts = async (req, res) => {
  const popularProducts = await Analytics.findAll({
    attributes: ["productId", [Sequelize.fn("COUNT", "productId"), "count"]],
    where: {
      eventName: "placeOrder",
    },
    group: ["productId"],
    order: [[Sequelize.literal("count"), "DESC"]],
    limit: 10,
  });
  res.send(popularProducts);
};

const getTotalSales = async (req, res) => {
  const totalSales = await Order.findAll({
    attributes: [
      [Sequelize.fn("SUM", Sequelize.col("totalPrice")), "totalSales"],
    ],
  });
  res.send(totalSales);
};

const getTotalSalesByCategory = async (req, res) => {
  const totalSalesByCategory = await OrderDetails.findAll({
    attributes: [
      "category",
      [Sequelize.fn("SUM", Sequelize.col("itemTotalPrice")), "totalSales"],
    ],
    group: ["category"],
  });
  res.send(totalSalesByCategory);
};

module.exports = {
  trackEvent,
  getPopularProducts,
  getTotalSales,
  getTotalSalesByCategory,
};
