const Order = require("./models/Order");
const router = require("express").Router();
const OrderDetailsController = require("./controller/OrderDetailsController");
const OrderController = require("./controller/OrderController");
const {
  authenticateTokenAndId,
  authenticateTokenAndAdmin,
} = require("../middlewares/verifyToken");

// Place order
router.post(
  "/placeOrder/:userId",
  authenticateTokenAndId,
  OrderController.placeOrder,
);

router.get(
  "/income",
  authenticateTokenAndAdmin,
  OrderDetailsController.getIncome,
);

module.exports = router;
