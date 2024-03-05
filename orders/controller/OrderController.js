const Order = require("../models/Order");
const CartController = require("../../cart/controller/CartController");
const OrderDetailsController = require("./OrderDetailsController");

const placeOrder = async (req, res) => {
  let userId = req.params.userId;
  let cartItemDetails = await CartController.getDetails(userId);

  if (cartItemDetails.productWithPriceTotal.length == 0) {
    return res.status(400).send("Cannot place order. Cart is empty.");
  }

  const order = await Order.create({
    userId: userId,
    totalPrice: cartItemDetails.total,
    totalQuantity: cartItemDetails.totalQuantity,
    address: req.body.address,
  });
  req.body.orderId = order.id;

  OrderDetailsController.placeOrder(req, res);
  CartController.clearCartForUser(userId);
  return res.status(200).send(order);
};

module.exports = { placeOrder };
