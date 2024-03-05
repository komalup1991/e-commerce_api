const OrderDetail = require("../models/OrderDetail");
const CartController = require("../../cart/controller/CartController");
const Order = require("../models/Order");

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

module.exports = { placeOrder, getOrdersByUserId };
