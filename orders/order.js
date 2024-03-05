const Order = require("./models/Order");
const router = require("express").Router();
const OrderDetailsController = require("./controller/OrderDetailsController");
const OrderController = require("./controller/OrderController");
const {
  authenticateTokenAndAdmin,
  authenticateTokenAndAuthorization,
} = require("../middlewares/verifyToken");

// Place order
router.post(
  "/placeOrder/:userId",
  authenticateTokenAndAdmin,
  OrderController.placeOrder,
);


module.exports = router;
