const OrderDetail = require("../models/OrderDetail");
const CartController = require("../../cart/controller/CartController");
const Order = require("../models/Order");
const AnalyticsController = require("../../analytics/controller/AnalyticsController");
const { Op } = require("sequelize");
const Product = require("../../products/models/Product");
const sequelize = require("../../db/database");
const OrderDetails = require("../models/OrderDetail");

const placeOrder = async (req, res) => {
  let userId = req.params.userId;
  let cartItemDetails = await CartController.getDetails(userId);

  for (
    let index = 0;
    index < cartItemDetails.productWithPriceTotal.length;
    index++
  ) {
    element = cartItemDetails.productWithPriceTotal[index];
    await OrderDetail.create({
      orderId: req.body.orderId,
      productId: element.product.id,
      itemQuantity: element.itemQuantity,
      itemTotalPrice: element.itemTotalPrice,
      price: element.product.price,
      category: element.product.category,
    });

    AnalyticsController.trackEvent({
      userId: userId,
      productId: element.product.id,
      eventName: "placeOrder",
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  let orders = await Order.findAll({
    where: { userId: req.params.userId },
  });
  if (!orders) {
    return res.status(404).send("No orders found");
  }
  res.send(orders);
};
const getIncome = async (req, res) => {
  const productId = req.query.pid;
  console.log(productId);
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    // Construct where clause conditionally
    let whereClause = {
      createdAt: {
        [Op.gte]: previousMonth,
      },
    };

    if (productId) {
      whereClause["$product.id$"] = productId; // Adjust according to your model's associations
    }

    const income = await OrderDetails.findAll({
      where: whereClause,
      include: [
        {
          model: Product, // Assuming Product is related to Order
          as: "product", // Adjust according to your actual relation setup
          attributes: [], // No need to select any attributes from Product
        },
      ],
      attributes: [
        [
          sequelize.fn(
            "strftime",
            "%m",
            sequelize.col("OrderDetails.createdAt"),
          ),
          "month",
        ],
        [sequelize.fn("sum", sequelize.col("itemTotalPrice")), "total"],
      ],
      group: ["month"],
      order: [["month", "ASC"]], // Optional, for sorting results by month
    });

    res.status(200).json(
      income.map((i) => ({
        month: i.getDataValue("month"),
        total: i.getDataValue("total"),
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
module.exports = { placeOrder, getOrdersByUserId, getIncome };
