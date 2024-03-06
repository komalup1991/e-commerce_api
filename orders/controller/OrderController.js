const Order = require("../models/Order");
const CartController = require("../../cart/controller/CartController");
const OrderDetailsController = require("./OrderDetailsController");
const PaymentController = require("../../payment/controller/PaymentController");

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
  // CartController.clearCartForUser(userId);

  PaymentController.processPayment(req, cartItemDetails.total, {
    setPayment: (payment) => {
      order.status = payment.paymentStatus;
      order.save();
      return res.status(200).send({ order, payment });
    },
  });
};

module.exports = { placeOrder };
